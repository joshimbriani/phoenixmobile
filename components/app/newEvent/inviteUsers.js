import React from 'react';
import { FlatList, View, Dimensions, Text, Button, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { Input, Form, Item } from 'native-base';

import { CachedImage } from 'react-native-cached-image';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

class InviteUsers extends React.Component {
    static navigationOptions = ({
        title: 'Invite Others to your Event!',
    });

    constructor(props) {
        super(props);

        this.state = {
            filteredUsers: this.props.navigation.state.params.contacts,
            searchText: "",
            userContacts: this.props.navigation.state.params.contacts,
            invitedUsers: this.props.navigation.state.params.invitedUsers
        }
        this.findFriends = this.findFriends.bind(this);
        this.toggleUser = this.toggleUser.bind(this);
        this.userInInviteList = this.userInInviteList.bind(this);
    }

    _keyExtractor = (item, index) => item.id;

    renderFriends = ({ item }) => (
        <View style={{ borderBottomWidth: 1, flexDirection: 'row' }}>
            <View style={{ padding: 10 }}>
                <CachedImage
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: item.profilePicture }}
                />
            </View>
            <View style={{ justifyContent: 'center', flex: 1 }}>
                <Text style={{ margin: 10 }}>{item.username}</Text>
            </View>
            <View style={{ justifyContent: 'center', paddingRight: 10}}>
                {this.userInInviteList(item.id) && <Button
                    onPress={() => this.toggleUser(item.id)}
                    title="Invited!"
                    color="#4CAF50"
                    accessibilityLabel="This user has been invited!"
                />}
                {!this.userInInviteList(item.id) && <Button
                    onPress={() => this.toggleUser(item.id)}
                    title="Invite"
                    color="#2196F3"
                    accessibilityLabel="Invite this user to your event!"
                />}
            </View>
        </View>
    )

    userInInviteList(userID) {
        return this.state.invitedUsers.indexOf(userID) > -1;
    }

    toggleUser(userID) {
        const userInList = this.userInInviteList(userID);
        if (this.state.invitedUsers.length >= 200 && !userInList) {
            ToastAndroid.show("Can't invite more than 200 users!", ToastAndroid.SHORT);
            return
        }
        var invitedUsers = this.state.invitedUsers.slice();
        if (!userInList) {
            invitedUsers.push(userID)
        } else {
            const userIndex = this.state.invitedUsers.indexOf(userID);
            invitedUsers.splice(userIndex, 1);
        }
        
        this.setState({invitedUsers: invitedUsers });
        this.props.navigation.state.params.addUsersToInviteLists(userID);
    }

    findFriends(text) {
        if (text === '') {
            this.setState({ filteredUsers: this.props.navigation.state.params.contacts });
            return;
        }
        this.setState({filteredUsers: this.state.userContacts.filter(user => user.username.toLowerCase().startsWith(text.toLowerCase()))})
    }

    render() {
        return (
            <View>
                <Form>
                    <Item>
                        <Input placeholder="Search For Contacts to Invite to your Event!" onChangeText={(text) => {this.setState({searchText: text}); this.findFriends(text)}} />
                    </Item>
                </Form>
                <FlatList
                    data={this.state.filteredUsers}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderFriends}
                />
            </View>
        );
    }
    emptyFriendList = () => (
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <Text>Can't find any users!</Text>
        </View>
    );
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InviteUsers);

