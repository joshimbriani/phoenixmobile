import React from 'react';
import { View, Text, Image, Button, TextInput, ToastAndroid, TouchableOpacity, FlatList } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import * as userActions from '../../redux/actions/user';
import { getURLForPlatform } from '../utils/networkUtils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, Form, Item } from 'native-base';
import Modal from "react-native-modal";
import HideableView from '../utils/hideableView';

import { Base64 } from 'js-base64';
import md5 from 'crypto-js/md5';

var ImagePicker = require('react-native-image-picker');
import { CachedImage } from 'react-native-cached-image';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editingDetails: false,
            email: this.props.user.email,
            filteredFriends: [],
            filterString: "",
            userModalVisible: false,
            profilePictureModalVisible: false,
        }

        this.editUser = this.editUser.bind(this);
        this.acceptRequest = this.acceptRequest.bind(this);
        this.denyRequest = this.denyRequest.bind(this);
        this.filterFriends = this.filterFriends.bind(this);
        this.removeUserFromFilteredUsers = this.removeUserFromFilteredUsers.bind(this);
    }

    componentDidMount() {
        this.setState({ email: this.props.user.email, filteredFriends: this.props.user.friends });
        this.props.userActions.loadUser(this.props.token);
        this.filterFriends(this.state.filterString, {})
    }

    // TODO: replace friend with whatever
    _keyExtractor = (item, index) => item.id;

    _renderItem = ({ item }) => (
        <View style={{ width: 150, justifyContent: 'center', alignItems: 'center', shadowRadius: 10, shadowOpacity: 1, shadowColor: 'black', elevation: 2, backgroundColor: 'white', margin: 10, padding: 5 }}>
            <CachedImage
                style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#ecf0f1' }}
                source={{ uri: item.profilePicture }}
            />
            <Text>{item.username}</Text>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ margin: 5 }}>
                    <Button
                        onPress={() => this.denyRequest(item.id)}
                        title="Deny"
                        color="#F44336"
                        accessibilityLabel="Deny the friend request"
                    />
                </View>
                <View style={{ margin: 5 }}>
                    <Button
                        onPress={() => this.acceptRequest(item)}
                        title="Accept"
                        color="#4CAF50"
                        accessibilityLabel="Accept the friend request"
                    />
                </View>
            </View>
        </View>
    );

    renderFriends = ({ item }) => {
        return (
            <TouchableOpacity onLongPress={() => this.setState({ userModalVisible: true })}>
                <View style={{ borderBottomWidth: 1, flexDirection: 'row' }}>
                    <View style={{ padding: 10 }}>
                        <CachedImage
                            style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#ecf0f1' }}
                            source={{ uri: item.profilePicture }}
                        />
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ margin: 10 }}>{item.username}</Text>
                    </View>
                    <Modal
                        isVisible={this.state.userModalVisible}
                        backdropOpacity={0.5}
                        onBackButtonPress={() => this.setState({ userModalVisible: false })}
                        onBackdropPress={() => this.setState({ userModalVisible: false })}>
                        <View style={{
                            borderColor: "rgba(0, 0, 0, 0.1)",
                            backgroundColor: "white",
                        }}>
                            <View style={{
                                width: 324,
                                height: 100
                            }}>
                                <TouchableOpacity onPress={() => this.unfriendUser(item.id)}>
                                    <View style={{ height: 50, width: 324, borderBottomWidth: 1, borderBottomColor: '#000', justifyContent: 'center', paddingLeft: 10 }}>
                                        <Text>Unfriend User</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.blockUser(item.id)}>
                                    <View style={{ height: 50, width: 324, justifyContent: 'center', paddingLeft: 10 }}>
                                        <Text>Block User</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </TouchableOpacity>
        )
    }

    unfriendUser(userID) {
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user.id + '/unfriend/', {
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
                    this.props.userActions.loadUser(this.props.token);
                    this.removeUserFromFilteredUsers(userID);
                    this.setState({ userModalVisible: false });
                }
            })
    }

    blockUser(userID) {
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user.id + '/block/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'user': userID,
                'action': 'block'
            })
        }).then(request => request.json())
            .then(requestObject => {
                if (requestObject["success"]) {
                    this.props.userActions.loadUser(this.props.token);
                    this.removeUserFromFilteredUsers(userID);
                    this.setState({ userModalVisible: false });
                }
            })
    }

    removeUserFromFilteredUsers(userID) {
        var users = this.state.filteredFriends.slice();

        for (var i = users.length - 1; i >= 0; i--) {
            if (users[i].id === userID) {
                users.splice(i, 1);
            }
        }

        this.setState({ filteredFriends: users });
    }

    acceptRequest(userFor) {
        console.log("Accept friend request")
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user.id + '/requests/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'status': 1,
                'user': userFor.id
            })
        }).then(request => request.json())
            .then(requestObject => {
                if (requestObject["success"]) {
                    this.props.userActions.loadUser(this.props.token).then();
                    this.filterFriends(this.state.filterString, userFor);
                }
            })
    }

    denyRequest(userFor) {
        console.log("Deny friend request")
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user.id + '/requests/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'status': 3,
                'user': userFor
            })
        }).then(request => request.json())
            .then(requestObject => {
                if (requestObject["success"]) {
                    this.props.userActions.loadUser(this.props.token);
                }
            })
    }

    emptyFriendList = () => (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>Can't find any users! Add some friends via the add button in the friends heading</Text>
        </View>
    );

    filterFriends(text, newFriend) {
        var filteredFriends = this.props.user.friends.slice();
        if (Object.keys(newFriend).length > 0 && filteredFriends.map((friend) => friend.id).indexOf(newFriend.id) === -1) {
            filteredFriends.push(newFriend);
        }
        if (text === "") {
            this.setState({ filteredFriends: filteredFriends });
            return;
        }
        for (var i = filteredFriends.length - 1; i >= 0; i--) {
            if (!filteredFriends[i].username.toUpperCase().includes(text.toUpperCase())) {
                filteredFriends.splice(i, 1);
            }
        }

        this.setState({ filteredFriends: filteredFriends });
    }

    editUser() {
        fetch(getURLForPlatform() + "api/v1/user/" + this.props.user.id + "/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'email': this.state.email
            })
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ email: responseObj["email"], editingDetails: false });
                this.props.userActions.loadUser(this.props.token);
            });
    }

    async changeProfilePicture() {
        const options = {
            title: 'Select Profile Picture',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                return;
            }
            if (response.error) {
                console.log("Error")
                return;
            }

            const date = new Date();
            const fileName = this.props.user.username + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes();
            fetch(getURLForPlatform() + 'api/v1/image/', {
                method: 'POST',
                body: JSON.stringify({
                    'name': fileName,
                    'checksum': Base64.encode(md5(response.data).toString())
                })
            }).then(serverresponse => serverresponse.json())
                .then(responseJSON => {
                    const url = responseJSON["url"];

                    const xhr = new XMLHttpRequest();
                    xhr.open('PUT', url);
                    xhr.setRequestHeader('Content-Type', 'image/jpeg');
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user.id + '/', {
                                    method: 'PUT',
                                    body: JSON.stringify({
                                        'profilePicture': 'https://s3.us-east-2.amazonaws.com/koota-profile-pictures/' + fileName
                                    }),
                                    headers: {
                                        Authorization: "Token " + this.props.token
                                    },
                                }).then(editUserResponse => {
                                    if (editUserResponse.status === 200) {
                                        this.props.userActions.loadUser(this.props.token);
                                        this.setState({profilePictureModalVisible: false})
                                    }
                                })
                            }
                        }
                    };
                    xhr.send({ uri: response.uri, type: 'image/jpeg', name: fileName + '.jpg' })

                })
        })
    }

    render() {
        const date = new Date(this.props.user.created);
        return (
            <KeyboardAwareScrollView >
                <View style={{ flex: 1 }}>
                    <HideableView hide={this.state.editingDetails}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#c0392b', height: 175 }}>
                            <TouchableOpacity onLongPress={() => this.setState({ profilePictureModalVisible: true })}>
                                <CachedImage
                                    style={{ width: 75, height: 75, borderRadius: 38, borderWidth: 1, borderColor: '#c0392b' }}
                                    source={{ uri: this.props.user.profilePicture }}
                                />
                            </TouchableOpacity>
                            <Text style={{ color: '#ecf0f1', fontSize: 35, fontWeight: 'bold' }}>{this.props.user.username}</Text>
                        </View>
                    </HideableView>
                    <HideableView hide={!this.state.editingDetails}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#c0392b', height: 175 }}>
                            <TouchableOpacity onPress={() => this.changeProfilePicture()}>
                                <CachedImage
                                    style={{ width: 75, height: 75, borderRadius: 38, borderWidth: 1, borderColor: '#c0392b' }}
                                    source={{ uri: this.props.user.profilePicture }}
                                />
                            </TouchableOpacity>
                            <Text style={{ color: '#ecf0f1', fontSize: 35, fontWeight: 'bold' }}>{this.props.user.username}</Text>
                        </View>
                    </HideableView>
                    <Modal
                        isVisible={this.state.profilePictureModalVisible}
                        backdropOpacity={0.5}
                        onBackButtonPress={() => this.setState({ profilePictureModalVisible: false })}
                        onBackdropPress={() => this.setState({ profilePictureModalVisible: false })}>
                        <View style={{
                            borderColor: "rgba(0, 0, 0, 0.1)",
                            backgroundColor: "white",
                        }}>
                            <View style={{
                                width: 324,
                                height: 50
                            }}>
                                <TouchableOpacity onPress={() => this.changeProfilePicture()}>
                                    <View style={{ height: 50, width: 324, borderBottomWidth: 1, borderBottomColor: '#000', justifyContent: 'center', paddingLeft: 10 }}>
                                        <Text>Change Profile Picture</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <View>
                        <View style={{ flexDirection: 'row', backgroundColor: '#8e44ad', alignItems: 'center' }}>
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text style={{ fontWeight: 'bold', color: 'white' }}>Details</Text>
                            </View>
                            <View style={{ paddingRight: 20, flexDirection: 'row' }}>
                                {!this.state.editingDetails && <TouchableOpacity onPress={() => this.setState({ editingDetails: true })}><PlatformIonicon
                                    name={"create"}
                                    size={30} //this doesn't adjust the size...?
                                    style={{ color: "white" }}
                                /></TouchableOpacity>}
                                {this.state.editingDetails && <TouchableOpacity onPress={() => this.editUser()}><PlatformIonicon
                                    name={"save"}
                                    size={30} //this doesn't adjust the size...?
                                    style={{ color: "white", paddingRight: 10 }}
                                /></TouchableOpacity>}
                                {this.state.editingDetails && <TouchableOpacity onPress={() => this.setState({ editingDetails: false })}><PlatformIonicon
                                    name={"close-circle"}
                                    size={30} //this doesn't adjust the size...?
                                    style={{ color: "white" }}
                                /></TouchableOpacity>}
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#ecf0f1', padding: 10, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', paddingRight: 20 }}>Username:</Text>
                                </View>
                                <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', paddingRight: 20 }}>Email:</Text>
                                </View>
                                <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', paddingRight: 20 }}>Password:</Text>
                                </View>
                            </View>
                            <View style={{ flex: 2 }}>
                                <View style={{ height: 40, justifyContent: 'center' }}>
                                    <Text>{this.props.user.username}</Text>
                                </View>
                                <View style={{ height: 40, justifyContent: 'center' }}>
                                    {!this.state.editingDetails && <Text>{this.props.user.email}</Text>}
                                    {this.state.editingDetails && <TextInput value={this.state.email} onChangeText={(text) => this.setState({ email: text })} />}
                                </View>
                                <View style={{ height: 40, justifyContent: 'center' }}>
                                    {!this.state.editingDetails && <Text>Click on the Edit Icon to Reset</Text>}
                                    {this.state.editingDetails && <Button title="Reset Password" color="#8e44ad" onPress={() => ToastAndroid.show('Password Reset Email Sent', ToastAndroid.SHORT)} />}
                                </View>
                            </View>
                        </View>
                    </View>
                    {this.props.user.pendingIncominRequests && this.props.user.pendingIncomingRequests.length > 0 && <View>
                        <View style={{ flexDirection: 'row', backgroundColor: '#2196F3', alignItems: 'center' }}>
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text style={{ fontWeight: 'bold', color: 'white' }}>Requests</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#ecf0f1', padding: 10, flexDirection: 'row' }}>
                            <FlatList
                                horizontal={true}
                                data={this.props.user.pendingIncomingRequests}
                                extraData={this.props}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                            />
                        </View>
                    </View>}
                    <View>
                        <View style={{ flexDirection: 'row', backgroundColor: '#2196F3', alignItems: 'center' }}>
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text style={{ fontWeight: 'bold', color: 'white' }}>Friends</Text>
                            </View>
                            <View style={{ paddingRight: 20, flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.setState({ searchFriends: !this.state.searchFriends })}><PlatformIonicon
                                    name={"search"}
                                    size={30} //this doesn't adjust the size...?
                                    style={{ color: "white", paddingRight: 10 }}
                                /></TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('AddFriends')}><PlatformIonicon
                                    name={"add"}
                                    size={30} //this doesn't adjust the size...?
                                    style={{ color: "white" }}
                                /></TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#ecf0f1' }}>
                            {this.state.searchFriends &&
                                <View style={{ padding: 10 }}>
                                    <Form>
                                        <Item>
                                            <Input value={this.state.filterString} placeholder="Filter Friends" onChangeText={(text) => { this.setState({ filterString: text }); this.filterFriends(text, {}) }} />
                                        </Item>
                                    </Form>
                                </View>}
                            <FlatList
                                data={this.state.filteredFriends}
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                renderItem={this.renderFriends}
                                ListEmptyComponent={this.emptyFriendList}
                            />
                        </View>
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', backgroundColor: '#16a085', alignItems: 'center' }}>
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text style={{ fontWeight: 'bold', color: 'white' }}>Stats</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#ecf0f1', padding: 10, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', paddingRight: 20 }}>Join Date:</Text>
                                </View>
                            </View>
                            <View style={{ flex: 2 }}>
                                <View style={{ height: 40, justifyContent: 'center' }}>
                                    {this.props.user.created && <Text>{(new Date(this.props.user.created)).getMonth() + 1}/{(new Date(this.props.user.created)).getDate()}/{(new Date(this.props.user.created)).getFullYear()}</Text>}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        token: state.tokenReducer.token
    };
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);
