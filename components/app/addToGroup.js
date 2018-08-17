import React from 'react';
import { FlatList, View, Dimensions, Text, Button, ToastAndroid } from 'react-native';
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

class AddToGroup extends React.Component {
    static navigationOptions = ({
        title: 'Add To Group',
    });

    constructor(props) {
        super(props);

        this.state = {
            filteredUsers: [],
            searchText: "",
            addedUsers: this.props.navigation.state.params.group.users
        }
        this.findFriends = this.findFriends.bind(this);
        this.addToGroup = this.addToGroup.bind(this);
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
                <Button
                    onPress={() => this.addToGroup(item.id)}
                    title="Add to Group"
                    color="#2196F3"
                    accessibilityLabel="Add to Group"
                />
            </View>
        </View>
    )

    addToGroup(userID) {
        if (this.state.addedUsers.length >= 200) {
            ToastAndroid.show("Can't add more than 200 users to a group!", ToastAndroid.SHORT);
            return
        }
        fetch(getURLForPlatform() + 'api/v1/groups/' + this.props.navigation.state.params.group.id + '/users/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'user': userID
            })
        }).then(request => request.json())
        .then(requestObject => {
            if (requestObject["success"]) {
                ToastAndroid.show('User added to group!', ToastAndroid.SHORT);
                var users = this.state.addedUsers.slice();
                users.push({id: userID});
                this.setState({addedUsers: users});
                this.props.navigation.state.params.loadGroup();
                this.findFriends(this.state.searchText);
            }
        })
    }

    findFriends(text) {
        if (text === '') {
            this.setState({ filteredUsers: [] });
            return;
        }
        fetch(getURLForPlatform() + 'api/v1/user/search/?username=' + text + '&status=1', {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseObject => {
                var users = responseObject["users"];
                const usersInGroup = this.state.addedUsers.map((user) => user.id);
                for (var i = users.length - 1; i >= 0; i--) {
                    if (usersInGroup.indexOf(users[i].id) > -1) {
                        users.splice(i);
                    }
                }
                this.setState({ filteredUsers: users })
            })
    }

    render() {
        return (
            <View>
                <Form>
                    <Item>
                        <Input placeholder="Search For Contacts to Add To Group" onChangeText={(text) => {this.setState({searchText: text}); this.findFriends(text)}} />
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
    emptyFriendList = () => (
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <Text>Can't find any users!</Text>
        </View>
    );
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
        user: state.userReducer.user
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
)(AddToGroup);

