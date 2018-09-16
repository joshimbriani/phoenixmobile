import React from 'react';
import { Platform, DeviceEventEmitter, Text, Dimensions, View, ToastAndroid, Alert, TouchableOpacity, Share } from 'react-native';
import { connect } from 'react-redux';
import PlatformIonicon from '../utils/platformIonicon';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { getURLForPlatform } from '../utils/networkUtils';
import { styles } from '../../assets/styles';
import EventDetailDetails from './eventDetailDetails';
import EventDetailPlace from './eventDetailPlace';
import EventDetailPeople from './eventDetailPeople';
import EventDetailMessages from './eventDetailMessages';
import Icon from 'react-native-vector-icons/Ionicons';
import * as userActions from '../../redux/actions/user';
import { bindActionCreators } from 'redux';

import { getMaterialColor } from '../utils/styleutils';

import {
    Menu,
    MenuTrigger,
    MenuOptions,
    MenuOption
} from 'react-native-popup-menu';

// TODO: Fork View

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

class EventDetailWrapper extends React.Component {

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: navigation.state.params.event,
        headerStyle: { backgroundColor: navigation.state.params.color },
        headerRight: <Menu style={{ paddingRight: 20, flexDirection: 'row' }}>
            <MenuTrigger>
                <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                    <Icon
                        name={'md-more'}
                        size={30}
                        style={{ color: "white" }}
                    />
                </View>
            </MenuTrigger>
            <TouchableOpacity onPress={() => navigation.state.params.forkEvent()}>
                <View style={{ paddingRight: 10, paddingLeft: 10, paddingTop: 10, paddingBottom: 10 }}>
                    <Icon
                        name={'md-git-branch'}
                        size={30}
                        style={{ color: "white" }}
                    />
                </View>
            </TouchableOpacity>
            <MenuOptions optionsContainerStyle={{ marginTop: 30 }}>
                {navigation.state.params.userID !== navigation.state.params.eventCreator && <MenuOption onSelect={navigation.state.params.markUserAsGoing}>
                    <Text>{userInList(navigation.state.params.userID, (navigation.state.params.usersGoing || [])) ? "I Can't Go" : "I'm Going!"}</Text>
                </MenuOption>}
                {navigation.state.params.userID !== navigation.state.params.eventCreator && !userInList(navigation.state.params.userID, (navigation.state.params.usersGoing || [])) && <MenuOption onSelect={navigation.state.params.markUserAsInterested}>
                    <Text>{userInList(navigation.state.params.userID, (navigation.state.params.usersInterested || [])) ? "Nahh, Not Interested Anymore" : "I'm Considering It!"}</Text>
                </MenuOption>}
                {/*<MenuOption onSelect={navigation.state.params.loadEvent}>
                    <Text>Refresh</Text>
                </MenuOption>*/}
                <MenuOption onSelect={navigation.state.params.reportEvent}>
                    <Text>Report Inappropriate Content</Text>
                </MenuOption>
                {navigation.state.params.userID === navigation.state.params.eventCreator && <MenuOption onSelect={navigation.state.params.deleteEvent}>
                    <Text>Delete Event</Text>
                </MenuOption>}
            </MenuOptions>
        </Menu>

    }) : ({ navigation }) => ({
        title: navigation.state.params.event,
        headerStyle: { backgroundColor: navigation.state.params.color },
        headerRight: <Menu style={{ paddingRight: 20, flexDirection: 'row' }}>
            <MenuTrigger>
                <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                    <Icon
                        name={'ios-more'}
                        size={30}
                        style={{ color: "white" }}
                    />
                </View>
            </MenuTrigger>
            <TouchableOpacity onPress={() => navigation.state.params.forkEvent()}>
                <View style={{ paddingRight: 10, paddingLeft: 10, paddingTop: 10, paddingBottom: 10 }}>
                    <Icon
                        name={'ios-git-branch'}
                        size={30}
                        style={{ color: "white" }}
                    />
                </View>
            </TouchableOpacity>
            <MenuOptions optionsContainerStyle={{ marginTop: 30 }}>
                {navigation.state.params.userID !== navigation.state.params.eventCreator && <MenuOption onSelect={navigation.state.params.markUserAsGoing}>
                    <Text>{userInList(navigation.state.params.userID, (navigation.state.params.usersGoing || [])) ? "I Can't Go" : "I'm Going!"}</Text>
                </MenuOption>}
                {navigation.state.params.userID !== navigation.state.params.eventCreator && !userInList(navigation.state.params.userID, (navigation.state.params.usersGoing || [])) && <MenuOption onSelect={navigation.state.params.markUserAsInterested}>
                    <Text>{userInList(navigation.state.params.userID, (navigation.state.params.usersInterested || [])) ? "Nahh, Not Interested Anymore" : "I'm Considering It!"}</Text>
                </MenuOption>}
                {/*<MenuOption onSelect={navigation.state.params.loadEvent}>
                    <Text>Refresh</Text>
                </MenuOption>*/}
                <MenuOption onSelect={navigation.state.params.reportEvent}>
                    <Text>Report Inappropriate Content</Text>
                </MenuOption>
                {navigation.state.params.userID === navigation.state.params.eventCreator && <MenuOption onSelect={navigation.state.params.deleteEvent}>
                    <Text>Delete Event</Text>
                </MenuOption>}
            </MenuOptions>
        </Menu>
    });

    constructor(props) {
        super(props);
        var routes = [
            { key: 'details', title: 'The Deets' },
            { key: 'place', title: 'Where' },
            { key: 'people', title: 'Who' },
            { key: 'messages', title: 'Messages' }
        ];

        this.state = {
            eventData: {},
            index: this.props.navigation.state.params.goToMessages ? 3 : 0,
            routes: routes,
            color: getMaterialColor()
        }

        this.loadEvent = this.loadEvent.bind(this);
        this.markUserAsGoing = this.markUserAsGoing.bind(this);
        this.markUserAsInterested = this.markUserAsInterested.bind(this);
        this.reportEvent = this.reportEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.showDeleteAlert = this.showDeleteAlert.bind(this);
        this.redeemOffer = this.redeemOffer.bind(this);
        this.forkEvent = this.forkEvent.bind(this);
        this.shareEvent = this.shareEvent.bind(this);
    }

    _handleIndexChange = index => this.setState({ index });

    _renderHeader = props => <TabBar {...props} labelStyle={{ fontSize: 10 }} style={[styles.eventTabBar, { backgroundColor: this.props.navigation.state.params.color }]} />;

    _renderScene = ({ route }) => {
        console.log("Interested In Event ", this.state.eventData.interested)
        switch (route.key) {
            case 'details':
                return <EventDetailDetails markUserAsInterested={this.markUserAsInterested} markUserAsGoing={this.markUserAsGoing} shareEvent={this.shareEvent} event={this.state.eventData} color={this.props.navigation.state.params.color} navigation={this.props.navigation} redeemOffer={this.redeemOffer} userGoing={userInList(this.props.user, (this.state.eventData.going || []))} userInterested={userInList(this.props.user, (this.state.eventData.interested || []))} />;
            case 'place':
                return <EventDetailPlace event={this.state.eventData} color={this.props.navigation.state.params.color} navigation={this.props.navigation} />;
            case 'people':
                return <EventDetailPeople forkEvent={this.forkEvent} event={this.state.eventData} color={this.props.navigation.state.params.color} navigation={this.props.navigation} />
            case 'messages':
                return <EventDetailMessages
                    event={this.state.eventData}
                    color={this.props.navigation.state.params.color}
                    navigation={this.props.navigation}
                    userInterested={userInList(this.props.user, (this.state.eventData.interested || []))}
                    userGoing={userInList(this.props.user, (this.state.eventData.going || []))} />
            default:
                return null;
        }
    }

    redeemOffer() {
        fetch(getURLForPlatform() + 'api/v1/events/' + this.state.eventData.id + '/', {
            headers: {
                Authorization: 'Token ' + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({ 'redeemed': true })
        }).then(response => {
            if (response.ok) {
                ToastAndroid.show("Offer Redeemed!", ToastAndroid.SHORT);
                this.loadEvent();
            } else {
                ToastAndroid.show("System Error. Please try again later!", ToastAndroid.SHORT);
            }
        })
    }

    shareEvent() {
        Share.share({
            message: "It's " + this.props.details.username + " and I think you'd really like this event - " + this.state.eventData.title + ". Check it out on Koota! https://kootasocial.com/",
            url: 'http://kootasocial.com',
            title: "I think you'd like this event on Koota!"
        }, {
                // Android only:
                dialogTitle: 'Share this awesome event!',
            })

    }

    forkEvent() {
        if (Object.keys(this.state.eventData).length > 0) {
            this.props.navigation.navigate('NewEventFork', { event: this.state.eventData });
        }

    }

    componentDidMount() {
        this.loadEvent();
        this.props.userActions.loadBlocked(this.props.token, this.props.user);
        this.props.userActions.loadContacts(this.props.token, this.props.user);
        this.props.userActions.loadIncomingRequests(this.props.token, this.props.user);
        this.props.userActions.loadOutgoingRequests(this.props.token, this.props.user);
        this.props.navigation.setParams({ markUserAsInterested: this.markUserAsInterested, markUserAsGoing: this.markUserAsGoing, loadEvent: this.loadEvent, userID: this.props.user, reportEvent: this.reportEvent, deleteEvent: this.showDeleteAlert, forkEvent: this.forkEvent });

        if (!this.props.navigation.state.params.color) {
            this.props.navigation.setParams({ color: this.state.color });
        }

        DeviceEventEmitter.addListener('refresh', (e) => { this.loadEvent() })
    }

    render() {
        return (
            <TabViewAnimated
                style={styles.eventTabView}
                navigationState={this.state}
                renderScene={this._renderScene}
                renderHeader={this._renderHeader}
                onIndexChange={this._handleIndexChange}
                initialLayout={initialLayout}
            />
        )
    }

    reportEvent() {
        fetch(getURLForPlatform() + "api/v1/events/" + this.props.navigation.state.params.id + "/report/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
        })
            .then(response => response.json())
            .then(responseObj => {
                if (responseObj["success"] !== true) {
                    console.log("Bad report.")
                } else {
                    ToastAndroid.show("Post Reported. Thanks for taking care of your community!", ToastAndroid.SHORT)
                }
            });
    }

    markUserAsInterested() {
        fetch(getURLForPlatform() + "api/v1/events/" + this.props.navigation.state.params.id + "/interested/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
        })
            .then(response => response.json())
            .then(responseObj => {
                if (responseObj["success"] !== true) {
                    console.log("Bad interested.")
                } else {
                    this.loadEvent();
                    this.props.userActions.loadInterested(this.props.token, this.props.user)
                }
            });
    }

    markUserAsGoing() {
        fetch(getURLForPlatform() + "api/v1/events/" + this.props.navigation.state.params.id + "/going/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
        })
            .then(response => response.json())
            .then(responseObj => {
                if (responseObj["success"] !== true) {
                    console.log("Bad going.")
                } else {
                    this.loadEvent();
                    this.props.userActions.loadGoing(this.props.token, this.props.user)
                }
            });
    }

    loadEvent() {
        fetch(getURLForPlatform() + "api/v1/events/" + this.props.navigation.state.params.id + "/?format=json", {
            headers: {
                Authorization: "Token " + this.props.token
            }
        })
            .then(response => response.json())
            .then(responseObj => {
                this.setState({ eventData: responseObj });
                this.props.navigation.setParams({ usersInterested: responseObj["interested"], usersGoing: responseObj["going"], eventCreator: responseObj["userBy"]["id"] })
            });
    }

    showDeleteAlert() {
        Alert.alert(
            'Confirm Deletion',
            "Are you sure you want to delete this? There's no going back after this!",
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yep!', onPress: () => this.deleteEvent() },
            ]
        )

    }

    deleteEvent() {
        fetch(getURLForPlatform() + 'api/v1/events/' + this.state.eventData.id + '/', {
            headers: {
                Authorization: 'Token ' + this.props.token
            },
            method: 'DELETE',
        }).then(response => {
            if (response.ok) {
                ToastAndroid.show("Event Deleted!", ToastAndroid.SHORT);
                this.props.navigation.state.params.loadEvents();
                this.props.navigation.goBack();
            } else {
                ToastAndroid.show("System Error. Please try again later!", ToastAndroid.SHORT);
            }
        })

    }
}

function userInList(userID, userList) {
    for (var i = 0; i < userList.length; i++) {
        if (userID === userList[i].id) {
            return true
        }
    }

    return false
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
        user: state.userReducer.user,
        details: state.userReducer.details,
        pendingOutgoingRelationships: state.userReducer.pendingOutgoingRelationships,
        pendingIncomingRelationships: state.userReducer.pendingIncomingRelationships,
        contacts: state.userReducer.contacts,
        blockedUsers: state.userReducer.blockedUsers
    };
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventDetailWrapper);

