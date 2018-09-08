import { connect } from 'react-redux';
import React from 'react';
import { DeviceEventEmitter, SectionList, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import PlatformIonicon from '../../utils/platformIonicon';
import { styles } from '../../../assets/styles';
import Icon from 'react-native-vector-icons/Ionicons';

import { UserRow } from './userRow';

import { generateUserToString } from '../../utils/textUtils';
import { listsEqual } from '../../utils/otherUtils';

class NewMessage extends React.Component {
    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'New Message',
        headerRight: <TouchableOpacity style={{paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}} onPress={() => navigation.state.params.startConversation(navigation, navigation.state.params.toUsers)}>
                        <Icon
                            name={'md-send'}
                            size={30}
                            style={{ color: "black" }}
                        />
                    </TouchableOpacity>

    }) : ({ navigation }) => ({
        title: 'New Message',
        headerRight: <TouchableOpacity style={{paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}} onPress={() => navigation.state.params.startConversation(navigation, navigation.state.params.toUsers)}>
                        <Icon
                            name={'ios-send'}
                            size={30}
                            style={{ color: "black" }}
                        />
                    </TouchableOpacity>
    });

    constructor(props) {
        super(props);

        this.state = {
            toUsers: [],
            creator: {},
            interested: [],
            going: []
        }

        this.userInList = this.userInList.bind(this);
        this.toggleUser = this.toggleUser.bind(this);
        this.startConversation = this.startConversation.bind(this);
        this.getExistingThread = this.getExistingThread.bind(this);
        this.removeUserFromList = this.removeUserFromList.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({ startConversation: this.startConversation, toUsers: this.state.toUsers });
        
        this.setState({creator: this.props.navigation.state.params.creator, interested: this.removeUserFromList(this.props.navigation.state.params.interested), going: this.removeUserFromList(this.props.navigation.state.params.going)});
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refresh',  {})
    }

    render() {
        return (
            <View style={[styles.flex1]} >
                <View style={{backgroundColor: 'white', padding: 5}}>
                    <TextInput value={this.userListToString(this.state.toUsers)} placeholder="Select users to message" editable={false} style={{height: 50}} />
                </View>
                <SectionList
                    renderItem={({userForRow, index, section}) => { 
                        // For some unknown reason user here is undefined so I have to do this the hacky way
                        return (
                            <UserRow user={(section.data[index] || {})} section={section.title} select={this.toggleUser} toUsers={this.state.toUsers} />
                        )
                    }}
                    renderSectionHeader={({section: {title}}) => (
                        <Text style={{fontWeight: 'bold'}}>{title}</Text>
                    )}
                    extraData={true}
                    sections={[
                        {title: 'Event Creator', data: this.props.user === this.state.creator.id ? [] : [this.state.creator]},
                        {title: 'Going', data: this.state.going},
                        {title: 'Interested', data: this.state.interested},
                    ]}
                    keyExtractor={(item, index) => item + index}
                />
            </View>
        )
    }

    removeUserFromList(list) {
        var copy = list.slice();
        for (var i = copy.length-1; i >= 0; i--) {
            if (copy[i].id === this.props.user) {
                copy.splice(i, 1);
            }
        }

        return copy
    }

    userListToString(users) {
        var userListString = "";
        for (var i = 0; i < users.length; i++) {
            userListString += users[i].username;
            userListString += ', '
        }

        return userListString
    }

    startConversation(navigation, toUsers) {
        if (toUsers.length > 0) {

            const thread = this.getExistingThread();
            const threadExists = Object.keys(thread).length > 0;

            // Want to have all threads passed to this object, check if thread exists for event and user, if so redirect to that thread
            // Otherwise create a new one
            if (threadExists) {
                navigation.navigate('ConversationView', { backKey: this.props.navigation.state.key, newConvo: false, userString: generateUserToString(this.props.user, this.state.toUsers, this.props.navigation.state.params.creator.username), eventName: this.props.navigation.state.params.eventName, thread: thread })
            } else {
                var usersList = this.state.toUsers.map(user => user.id);
                usersList.push(this.props.user)
                navigation.navigate('ConversationView', { backKey: this.props.navigation.state.key, newConvo: true, userString: generateUserToString(this.props.user, this.state.toUsers, this.props.navigation.state.params.creator.username), eventName: this.props.navigation.state.params.eventName, toUsers: usersList, eventID: this.props.navigation.state.params.eventID })
            }
        } 
    }

    toggleUser(user) {
        // If not in list
        if (!this.userInList(user)) {
            var toUsers = this.state.toUsers.slice();
            toUsers.push(user);
            this.setState({ toUsers: toUsers });
            this.props.navigation.setParams({ toUsers: toUsers });
        } else {
            const userIndex = this.state.toUsers.findIndex(obj => obj.id == user.id);
            if (userIndex >= 0) {
                var toUsers = this.state.toUsers.slice();
                toUsers.splice(userIndex, 1);
                this.setState({ toUsers: toUsers });
                this.props.navigation.setParams({ toUsers: toUsers });
            } 
        }
    }

    getExistingThread() {
        var returnThread = {};
        this.props.navigation.state.params.threads.forEach((thread) => {
            var usersList = this.state.toUsers.map(user => user.id);
            usersList.push(this.props.user)
            var threadUserList = thread.users.map(user => user.id);

            if (listsEqual(usersList, threadUserList)) {
                returnThread = thread
            }
        })

        return returnThread
    }

    userInList(user) {
        var inList = false;
        this.state.toUsers.forEach((listUser) => {
            if (listUser.id === user.id) {
                inList = true
            }
        })

        return inList
    }

}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewMessage);