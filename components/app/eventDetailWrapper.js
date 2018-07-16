import React from 'react';
import { DeviceEventEmitter, Text, Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import PlatformIonicon from '../utils/platformIonicon';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { getURLForPlatform } from '../utils/networkUtils';
import { styles } from '../../assets/styles';
import EventDetailDetails from './eventDetailDetails';
import EventDetailPlace from './eventDetailPlace';
import EventDetailPeople from './eventDetailPeople';
import EventDetailMessages from './eventDetailMessages';

import {
    Menu,
    MenuTrigger,
    MenuOptions,
    MenuOption
  } from 'react-native-popup-menu';

// TODO: Do I need to pass navigation to all the objects?

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

class EventDetailWrapper extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.event,
        headerStyle: { backgroundColor: '#' + navigation.state.params.color },
        headerRight: <Menu style={{paddingRight: 20}}>
            <MenuTrigger>
                <View style={{paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
                    <PlatformIonicon
                        name={'more'}
                        size={30}
                        style={{ color: "white" }}
                    />
                </View>
            </MenuTrigger>
            <MenuOptions optionsContainerStyle={{ marginTop: 30 }}>
                <MenuOption onSelect={navigation.state.params.markUserAsGoing}>
                    <Text>{userInList(navigation.state.params.userID, (navigation.state.params.usersGoing || [])) ? "I Can't Go" : "I'm Going!"}</Text>
                </MenuOption>
                <MenuOption onSelect={navigation.state.params.markUserAsInterested}>
                    <Text>{userInList(navigation.state.params.userID, (navigation.state.params.usersInterested || [])) ? "I'm Not Interested Anymore" : "I'm Interested!"}</Text>
                </MenuOption>
                <MenuOption onSelect={navigation.state.params.loadEvent}>
                    <Text>Refresh</Text>
                </MenuOption>
            </MenuOptions>
        </Menu>
    });

    constructor(props) {
        super(props);
        var routes = [
            { key: 'details', title: 'Details' },
            { key: 'place', title: 'Place' },
            { key: 'people', title: 'People' },
            { key: 'messages', title: 'Messages'}
        ];

        this.state = {
            eventData: {},
            index: 0,
            routes: routes,
        }

        this.loadEvent = this.loadEvent.bind(this);
        this.markUserAsGoing = this.markUserAsGoing.bind(this);
        this.markUserAsInterested = this.markUserAsInterested.bind(this);
    }  

    _handleIndexChange = index => this.setState({ index });

    _renderHeader = props => <TabBar {...props} labelStyle={{fontSize: 11}} style={[styles.eventTabBar, { backgroundColor: '#' + this.props.navigation.state.params.color }]} />;

    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'details':
                return <EventDetailDetails event={this.state.eventData} color={this.props.navigation.state.params.color} navigation={this.props.navigation} />;
            case 'place':
                return <EventDetailPlace event={this.state.eventData} color={this.props.navigation.state.params.color} navigation={this.props.navigation} />;
            case 'people':
                return <EventDetailPeople event={this.state.eventData} color={this.props.navigation.state.params.color} navigation={this.props.navigation} />
            case 'messages':
                return <EventDetailMessages 
                            event={this.state.eventData}  
                            color={this.props.navigation.state.params.color} 
                            navigation={this.props.navigation} 
                            userInvolved={userInList(this.props.user.id, (this.state.eventData.interested || []))} 
                            userGoing={userInList(this.props.user.id, (this.state.eventData.going || []))} />
            default:
                return null;
        }
    }


    componentDidMount() {
        this.loadEvent();
        this.props.navigation.setParams({ markUserAsInterested: this.markUserAsInterested, markUserAsGoing: this.markUserAsGoing, loadEvent: this.loadEvent, userID: this.props.user.id });

        DeviceEventEmitter.addListener('refresh', (e)=>{ this.loadEvent() })
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
                }
            });
    }

    loadEvent() {
        fetch(getURLForPlatform() + "api/v1/events/" + this.props.navigation.state.params.id + "?format=json", {
            headers: {
                Authorization: "Token " + this.props.token
            }
        })
            .then(response => response.json())
            .then(responseObj => {
                this.setState({ eventData: responseObj });
                this.props.navigation.setParams({usersInterested: responseObj["interested"], usersGoing: responseObj["going"]})
            });

        
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
        user: state.userReducer.user
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventDetailWrapper);

