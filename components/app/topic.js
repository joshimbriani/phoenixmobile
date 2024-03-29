import React from 'react';
import { Button, Container, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View, PermissionsAndroid, Platform } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor'
import * as userActions from '../../redux/actions/user';
import ColorScheme from 'color-scheme';
import { getURLForPlatform } from '../utils/networkUtils';
import { KootaListView } from '../utils/listView';
import { styles } from '../../assets/styles';
import { getCurrentLocation } from '../utils/otherUtils';
import Icon from 'react-native-vector-icons/Ionicons';

import {
    Menu,
    MenuTrigger,
    MenuOptions,
    MenuOption
  } from 'react-native-popup-menu';

class Topic extends React.Component {

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: navigation.state.params.topic,
        headerStyle: { backgroundColor: '#' + navigation.state.params.color },
        headerRight: <Menu style={{paddingRight: 20}}>
                        <MenuTrigger>
                            <View style={{paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
                                <Icon
                                    name={'md-more'}
                                    size={30}
                                    style={{ color: "white" }}
                                />
                            </View>
                        </MenuTrigger>
                        <MenuOptions optionsContainerStyle={{ marginTop: 30 }}>
                            <MenuOption onSelect={navigation.state.params.toggleTopic}>
                                <Text>{isTopicFollowed((navigation.state.params.followingTopics || []), navigation.state.params.topicID) ? "Unfollow" : "Follow"}</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => navigation.navigate('Filter')}>
                                <Text>Filter</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => navigation.state.params.reportTopic()}>
                                <Text>Report</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
    }) : ({ navigation }) => ({
        title: navigation.state.params.topic,
        headerStyle: { backgroundColor: '#' + navigation.state.params.color },
        headerRight: <Menu style={{paddingRight: 20}}>
                        <MenuTrigger>
                            <View style={{paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
                                <Icon
                                    name={'ios-more'}
                                    size={30}
                                    style={{ color: "white" }}
                                />
                            </View>
                        </MenuTrigger>
                        <MenuOptions optionsContainerStyle={{ marginTop: 30 }}>
                            <MenuOption onSelect={navigation.state.params.toggleTopic}>
                                <Text>{isTopicFollowed((navigation.state.params.followingTopics || []), navigation.state.params.topicID) ? "Unfollow" : "Follow"}</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => navigation.navigate('Filter')}>
                                <Text>Filter</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => navigation.state.params.reportTopic()}>
                                <Text>Report</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
    });

    constructor(props) {
        super(props);
        this.state = {
            colors: ["ffffff"],
            data: [],

        }

        this.toggleTopic = this.toggleTopic.bind(this);
        this.reportTopic = this.reportTopic.bind(this);
    }

    async componentDidMount() {
        this.props.userActions.loadFollowingTopics(this.props.token, this.props.user)

        this.props.colorActions.changeColor(this.props.navigation.state.params.color);
        this.props.navigation.setParams({ toggleTopic: this.toggleTopic, followingTopics: this.props.followingTopics, topicID: this.props.navigation.state.params.id, userID: this.props.user, reportTopic: this.reportTopic });
        
        var url = getURLForPlatform() + "api/v1/events/search/?topic=" + this.props.navigation.state.params.id;
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted) {
                const coordinates = await getCurrentLocation();
                url += '&lat=' + coordinates.latitude + '&long=' + coordinates.longitude;
            }
        }
        fetch(url, {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: responseObj });
            });

            var mColors;
            if (this.state.colors && this.state.colors.length === 1 && this.state.colors[0] === "ffffff") {
                mColors = (new ColorScheme()).from_hex(this.props.navigation.state.params.color).scheme('mono');
                this.setState({ colors: mColors.colors() });
            } else {
                mColors = this.state.colors;
            }
    }

    componentWillUnmount() {
        this.props.colorActions.resetColor();
    }

    toggleTopic() {
        fetch(getURLForPlatform() + "api/v1/topic/" + this.props.navigation.state.params.id + "/follow/", {
            method: 'PUT',
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseJSON => {
                if (responseJSON["success"] !== true) {
                    console.log("Bad going.")
                } else {
                    var userFollow = this.props.followingTopics.slice();
                    if (responseJSON["action"] === "add") {
                        userFollow.push({id: this.props.navigation.state.params.id})
                    } else if (responseJSON["action"] === "remove") {
                        removeTopic(userFollow, this.props.navigation.state.params.id)
                    }
                    this.props.navigation.setParams({ followingTopics: userFollow });
                    this.props.userActions.loadFollowingTopics(this.props.token, this.props.user)
                }
            })
    }

    reportTopic() {
        fetch(getURLForPlatform() + "api/v1/topic/" + this.props.navigation.state.params.id + "/report/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
        })
            .then(response => response.json())
            .then(responseObj => {
                if (responseObj["success"] !== true) {
                    console.log("Bad report.")
                }
            });
    }

    render() {
        if (this.state.data.length > 0) {
            return (
                <Container style={{ flex: 1 }}>
                    <View style={{ flex: 10 }}>
                        <KootaListView colors={this.state.colors} data={this.state.data} pressCallback={(item) => this.props.navigation.navigate('EventDetailWrapper', { event: item.title, id: item.id, color: '#' + this.props.navigation.state.params.color })} />
                    </View>
                </Container>
            );
        } else {
            return (
                <Container>
                    <Text>No Events found for this topic! Blaze the trail and create an event!</Text>
                </Container>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        color: state.backgroundColorReducer.color,
        token: state.tokenReducer.token,
        user: state.userReducer.user,
        followingTopics: state.userReducer.followingTopics
    };
}

function mapDispatchToProps(dispatch) {
    return {
        colorActions: bindActionCreators(colorActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Topic);

function isTopicFollowed (topicList, topic) {
    for (var i = 0; i < topicList.length; i++) {
        if (topic === topicList[i].id) {
            return true;
        }
    }

    return false;
}

function removeTopic(userFollow, topicID) {
    for (var i = userFollow.length - 1; i >= 0; i--) {
        if (userFollow[i].id === topicID) {
            userFollow.splice(i, 1)
        }
    }
}