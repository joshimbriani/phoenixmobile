import React from 'react';
import { FlatList, View, Dimensions, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, Form, Item } from 'native-base';

import * as achievementActions from '../../redux/actions/achievements';
import * as userActions from '../../redux/actions/user';
import { getURLForPlatform } from '../utils/networkUtils';
import { CachedImage } from 'react-native-cached-image';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

class AddFriends extends React.Component {
    static navigationOptions = ({
        title: 'Add Friends',
    });

    constructor(props) {
        super(props);

        this.state = {
            filteredUsers: [],
            searchText: "",
            invitedUsers: [],
            wasInvitedByUsers: [],
            contacts: [],
            blockedUsers: []
        }
        this.findFriends = this.findFriends.bind(this);
        this.addFriend = this.addFriend.bind(this);
        this.updateUserLists = this.updateUserLists.bind(this);
    }

    componentDidMount() {
        this.props.userActions.loadOutgoingRequests(this.props.token, this.props.user)
        this.setState({ 
            invitedUsers: this.props.pendingOutgoingRelationships.map((user) => user.id),
            wasInvitedByUsers: this.props.pendingIncomingRelationships.map((user) => user.id),
            contacts: this.props.contacts.map((user) => user.id),
            blockedUsers: this.props.blockedUsers.map((user) => user.id),
        })
    }

    updateUserLists() {
        this.setState({ 
            invitedUsers: this.props.pendingOutgoingRelationships.map((user) => user.id),
            wasInvitedByUsers: this.props.pendingIncomingRelationships.map((user) => user.id),
            contacts: this.props.contacts.map((user) => user.id),
            blockedUsers: this.props.blockedUsers.map((user) => user.id),
        })
    }

    _keyExtractor = (item, index) => item.id;

    renderFriends = ({ item }) => (
        <View style={{ borderBottomWidth: 1, flexDirection: 'row' }}>
            <View style={{ padding: 10 }}>
                <CachedImage
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: item.profilePicture }}
                    ttl={60*60*24*3}
                    fallbackSource={require('../../assets/images/KootaK.png')}
                />
            </View>
            <View style={{ justifyContent: 'center', flex: 1 }}>
                <Text style={{ margin: 10 }}>{item.username}</Text>
            </View>
            <View style={{ justifyContent: 'center', paddingRight: 10}}>
                {this.state.invitedUsers.indexOf(item.id) === -1 && this.state.wasInvitedByUsers.indexOf(item.id) === -1 && this.state.contacts.indexOf(item.id) === -1 && this.state.blockedUsers.indexOf(item.id) === -1 && <Button
                    onPress={() => this.addFriend(item.id)}
                    title="Send Request"
                    color="#2196F3"
                    accessibilityLabel="Send contact request"
                />}
                {this.state.invitedUsers.indexOf(item.id) > -1 && <Button
                    onPress={() => this.cancelRequest(item.id)}
                    title="Cancel Request"
                    color="#F44336"
                    accessibilityLabel="Cancel contact request"
                />}
                {this.state.wasInvitedByUsers.indexOf(item.id) > -1 && <Button
                    onPress={() => this.acceptRequest(item.id)}
                    title="Accept Request"
                    color="#4CAF50"
                    accessibilityLabel="Accept contact request"
                />}
                {this.state.contacts.indexOf(item.id) > -1 && <Button
                    onPress={() => this.unfriendUser(item.id)}
                    title="Remove Contact"
                    color="#607D8B"
                    accessibilityLabel="Remove user from contacts"
                />}
                {this.state.blockedUsers.indexOf(item.id) > -1 && <Button
                    onPress={() => this.unblockUser(item.id)}
                    title="Unblock User"
                    color="#9E9E9E"
                />}
            </View>
        </View>
    )

     addFriend(userID) {
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/requests/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'POST',
            body: JSON.stringify({
                'user': userID
            })
        }).then(request => request.json())
        .then(async (requestObject) => {
            if (requestObject["success"]) {
                this.findFriends(this.state.searchText);
                await this.props.userActions.loadOutgoingRequests(this.props.token, this.props.user);
                this.updateUserLists()
            }
        })
    }

    cancelRequest(userID) {
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/unfriend/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'user': userID
            })
        }).then(request => request.json())
            .then(async (requestObject) => {
                if (requestObject["success"]) {
                    this.findFriends(this.state.searchText);
                    await this.props.userActions.loadOutgoingRequests(this.props.token, this.props.user);
                    this.updateUserLists()
                }
            })
    }

    acceptRequest(userID) {
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/requests/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'status': 1,
                'user': userID
            })
        }).then(request => request.json())
            .then(async (requestObject) => {
                if (requestObject["success"]) {
                    this.findFriends(this.state.searchText);
                    await this.props.userActions.loadContacts(this.props.token, this.props.user)
                    this.updateUserLists()
                }
            })
    }

    unfriendUser(userID) {
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/unfriend/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'user': userID
            })
        }).then(request => request.json())
            .then(async (requestObject) => {
                if (requestObject["success"]) {
                    this.findFriends(this.state.searchText);
                    await this.props.userActions.loadContacts(this.props.token, this.props.user)
                    this.updateUserLists()
                }
            })
    }

    unblockUser(user) {
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/block/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'user': user,
                'action': 'unblock'
            })
        }).then(request => request.json())
            .then(async (requestObject) => {
                if (requestObject["success"]) {
                    this.findFriends(this.state.searchText);
                    await this.props.userActions.loadBlocked(this.props.token, this.props.user)
                    this.updateUserLists()
                }
            })
    }

    findFriends(text) {
        if (text === '') {
            this.setState({ filteredUsers: [] });
            return;
        }
        fetch(getURLForPlatform() + 'api/v1/user/search/?username=' + text, {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(async (responseObject) => {
                this.setState({ filteredUsers: responseObject["users"] })
                this.updateUserLists()
            })
    }

    render() {
        return (
            <View>
                <Form>
                    <Item>
                        <Input placeholder="Search For Friends" onChangeText={(text) => {this.setState({searchText: text}); this.findFriends(text)}} />
                    </Item>
                </Form>
                <FlatList
                    data={this.state.filteredUsers}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderFriends}
                    ListEmptyComponent={this.emptyFriendList}
                    keyboardShouldPersistTaps={'handled'}
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
        user: state.userReducer.user,
        pendingOutgoingRelationships: state.userReducer.pendingOutgoingRelationships,
        pendingIncomingRelationships: state.userReducer.pendingIncomingRelationships,
        contacts: state.userReducer.contacts,
        blockedUsers: state.userReducer.blockedUsers
    };
}

function mapDispatchToProps(dispatch) {
    return {
        achievementActions: bindActionCreators(achievementActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddFriends);