import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, RefreshControl, StyleSheet, TouchableHighlight, View, PermissionsAndroid, AsyncStorage } from 'react-native';
import GridView from 'react-native-super-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor';
import * as userActions from '../../redux/actions/user';
import PlatformIonicon from '../utils/platformIonicon';
import { getURLForPlatform } from '../utils/networkUtils';
import { styles } from '../../assets/styles';
import firebase from 'react-native-firebase';

import { NavigationActions } from 'react-navigation';
import { generateUserToString } from '../utils/textUtils';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            data: [],
            searchQuery: "",
            refreshing: false,
            GPSPermission: false,
            notificationsAllowed: false
        };

        this.changeValue = this.changeValue.bind(this);
        this.checkUserPermissions = this.checkUserPermissions.bind(this);
        this.reactToNotification = this.reactToNotification.bind(this);

    }

    async componentDidMount() {
        await this.props.userActions.loadUser(this.props.token);
        this.props.colorActions.resetColor();
        fetch(getURLForPlatform() + "api/v1/user/", {
            headers: {
                Authorization: "Token " + this.props.token
            }
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: [{ id: -1, name: "IDK", color: "0097e6", icon: "help" }].concat('followingTopics' in responseObj ? responseObj['followingTopics'] : []) });
            });

        await this.checkUserPermissions();

        if (this.props.FCMToken !== this.props.user.FCMToken) {
            fetch(getURLForPlatform() + "api/v1/user/" + this.props.user.id + "/", {
                headers: {
                    Authorization: "Token " + this.props.token
                },
                body: JSON.stringify({
                    'FCMToken': this.props.FCMToken
                }),
                method: 'PUT'
            }).then(response => response.json())
                .then(responseObj => {
                    if (!responseObj["update"]) {
                        console.log("Bad Update")
                    }
                })
        }

        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position)
        },
            (error) => console.error(error.message),
            Platform.OS === 'ios' ? { enableHighAccuracy: true, timeout: 20000 } : {timeout: 50000},
        );

        firebase.messaging().requestPermission()
            .then(() => {
                // User has authorised  
                this.setState({ notificationsAllowed: true })
            })
            .catch(error => {
                // User has rejected permissions  
            });

        firebase.notifications().getInitialNotification().then(async(notification) => {
            console.log(notification)
            const not = await AsyncStorage.getItem("notification")
            console.log(not)
            if (notification && notification.notification.notificationId !== not) {
                const not = notification;
          
                var data = {}
                data["type"] = notification.notification.data["type"]
                data["event"] = notification.notification.data["event"]
                data["group"] = notification.notification.data["group"]
                data["threadID"] = notification.notification.data["threadID"]
          
                await AsyncStorage.setItem('notification', notification.notification.notificationId);
                this.reactToNotification(data);
                console.log("Here")
            }
          })

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            console.log("On notifiaction displayed")
            console.log(notification)

            //this.props.navigation.navigate('NewEvent', { topic: "" })
        });

        this.notificationListener = firebase.notifications().onNotification((notification) => {
            // Process your notification as required
            console.log("On Message");
            const displaynotification = new firebase.notifications.Notification()
                .setNotificationId('notificationId')
                .setTitle(notification._body)
                .setBody('My notification body')
                .android.setChannelId('messages')
                .setData(notification.data);

            firebase.notifications().displayNotification(displaynotification);
        });

        this.openNotification = firebase.notifications().onNotificationOpened(async (notification) => {
            console.log("User opened app")
            console.log(notification)
            var data = {}
            data["type"] = notification.notification.data["type"]
            data["event"] = notification.notification.data["event"]
            data["group"] = notification.notification.data["group"]
            data["threadID"] = notification.notification.data["threadID"]
            const not = await AsyncStorage.getItem("notificationOpened");
            if (not !== notification.notification.notificationId) {
                await AsyncStorage.setItem('notificationOpened', notification.notification.notificationId);
                this.reactToNotification(data)
            }
            
        });

    }

    componentWillUnmount() {
        //this.notificationDisplayedListener();
        //this.notificationListener();
        //this.notificationOnStartup();
        //this.openNotification();
    }

    reactToNotification(data) {
        const type = data["type"];
        if (type === "m") {
            const event = data["event"];
            const group = data["group"];
            if (event) {
                fetch(getURLForPlatform() + "api/v1/events/" + event + "/", {
                    headers: {
                        Authorization: "Token " + this.props.token
                    }
                }).then(response => response.json())
                    .then(responseObj => {
                        var thread = {};
                        const threadID = parseInt(data["threadID"]);
                        for (var i = 0; i < responseObj["threads"].length; i++) {
                            if (responseObj["threads"][i].id === threadID) {
                                thread = responseObj["threads"][i]
                            }
                        }
                        this.props.navigation.dispatch({
                            index: 2,
                            type: 'Navigation/RESET',
                            actions: [
                                NavigationActions.navigate({ routeName: 'Home' }),
                                NavigationActions.navigate({ routeName: 'EventDetailWrapper', params: { event: responseObj["title"], id: responseObj["id"], goToMessages: true } }),
                                NavigationActions.navigate({ routeName: 'ConversationView', params: { newConvo: false, eventName: responseObj["title"], thread: thread, color: '#ffffff', userString: generateUserToString(this.props.user.id, thread.users, responseObj["userBy"]["username"]) } })
                            ]
                        })
                    })
            } else if (group) {
                this.props.navigation.navigate('GroupWrapper', { groupID: group, goToMessages: true });
            }
        } else if (type === "s") {

        } else if (type === "o") {

        } else if (type === "y") {

        } else if (type === "e") {

        }
    }

    async checkUserPermissions() {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

                if (granted) {
                    this.setState({ GPSPermission: true })
                } else {
                    const grantedNow = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            'title': 'Koota',
                            'message': 'Koota needs access to your GPS location ' +
                                'so you can find awesome things happening around you.'
                        }
                    )
                    if (grantedNow === PermissionsAndroid.RESULTS.GRANTED) {
                        console.warn("You can use the camera")
                        this.setState({ GPSPermission: true })
                    }
                }

            } catch (err) {
                console.warn(err)
            }
        } else if (Platform.OS === 'ios') {
            navigator.geolocation.requestAuthorization();
        }
    }

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'Home',
        headerLeft: <PlatformIonicon
            name="menu"
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.navigate('DrawerOpen')} />
    }) : ({ navigation }) => ({
        title: 'Home',
        headerStyle: { paddingTop: -22, }
    });

    changeValue(text) {
        this.setState({ searchQuery: text });
    }

    // TODO: Does IDK need to route to a special IDK page or just to the suggested page?
    routeToTopic(item) {
        if (item.id === -1) {
            this.props.navigation.navigate('IDK', {});
        } else {
            this.props.navigation.navigate('Topic', { topic: item.name, id: item.id, color: item.color.substring(0) })
        }
    }

    _onRefresh() {
        fetch(getURLForPlatform() + "api/v1/user/", {
            headers: {
                Authorization: "Token " + this.props.token
            }
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: [{ id: -1, name: "IDK", color: "0097e6", icon: "help" }].concat('followingTopics' in responseObj ? responseObj['followingTopics'] : []) });
            })
    }

    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input 
                            placeholder="What Do You Wanna Do?" 
                            onChangeText={(text) => this.changeValue(text)} 
                            onSubmitEditing={() => { 
                                if (this.state.searchQuery.length > 0) {
                                    this.props.navigation.navigate('Search', { query: this.state.searchQuery }); 
                                }
                            }} />
                    </Item>
                    <Button transparent onPress={() => {
                        if (this.state.searchQuery.length > 0) { 
                            this.props.navigation.navigate('Search', { query: this.state.searchQuery })}
                        }
                        }>
                        <Text>Search</Text>
                    </Button>
                </Header>
                <GridView
                    contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}
                    style={styles.gridView}
                    itemWidth={150}
                    enableEmptySections
                    items={this.state.data}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    renderItem={item => {
                        console.log(item);
                        return (
                            <TouchableHighlight onPress={() => { this.routeToTopic(item) }}>
                                <View
                                    style={[styles.itemBox, { backgroundColor: '#' + item.color }]}
                                >
                                    <PlatformIonicon
                                        name={item.icon || 'aperture'}
                                        size={50}
                                        style={{ color: "white" }}
                                    />
                                    <Text style={styles.itemText}>{item.name}</Text>
                                </View>
                            </TouchableHighlight>
                        )
                    }} />
                <Fab
                    active={this.state.active}
                    containerStyle={{}}
                    style={{ backgroundColor: '#e84118' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('NewEvent', { topic: "" })}>
                    <PlatformIonicon
                        name={"add"}
                        size={50} //this doesn't adjust the size...?
                        style={{ color: "white" }}
                    />
                </Fab>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        color: state.backgroundColorReducer.color,
        token: state.tokenReducer.token,
        FCMToken: state.tokenReducer.FCMToken,
        user: state.userReducer.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        colorActions: bindActionCreators(colorActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);

