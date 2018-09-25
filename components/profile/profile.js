import React from 'react';
import { View, Text, Platform, Button, TextInput, ToastAndroid, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import * as userActions from '../../redux/actions/user';
import { getURLForPlatform } from '../utils/networkUtils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'native-base';
import Modal from "react-native-modal";
import HideableView from '../utils/hideableView';
import moment from 'moment';

import { Base64 } from 'js-base64';
import md5 from 'crypto-js/md5';

var ImagePicker = require('react-native-image-picker');
import { CachedImage } from 'react-native-cached-image';
import Color from 'color';

class Profile extends React.Component {

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'My Koota',
        header: null
    }) : ({ navigation }) => ({
        title: 'My Koota',
        headerStyle: { paddingTop: -22, },
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            editingDetails: false,
            email: this.props.details.email,
            filteredFriends: [],
            filterString: "",
            userModalVisible: false,
            profilePictureModalVisible: false,
            selectedUser: -1,
            refreshing: false,
            loadingPic: false,
            oldPassword: "",
            newPassword1: "",
            newPassword2: "",
            oldPasswordError: "",
            newPassword1Error: "",
            newPassword2Error: "",
            changedPassword: false
        }

        this.editUser = this.editUser.bind(this);
        this.acceptRequest = this.acceptRequest.bind(this);
        this.denyRequest = this.denyRequest.bind(this);
        this.filterFriends = this.filterFriends.bind(this);
        this.removeUserFromFilteredUsers = this.removeUserFromFilteredUsers.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    componentDidMount() {
        this.setState({ email: this.props.details.email, filteredFriends: this.props.contacts });
        this.props.userActions.loadContacts(this.props.token, this.props.user);
        this.props.userActions.loadUserDetails(this.props.token, this.props.user);
        this.props.userActions.loadIncomingRequests(this.props.token, this.props.user);
        this.filterFriends(this.state.filterString, {})
    }

    // TODO: replace friend with whatever
    _keyExtractor = (item, index) => item.id;

    _renderItem = ({ item }) => (
        <View style={{ width: 150, justifyContent: 'center', alignItems: 'center', shadowRadius: 2, shadowOpacity: 1, shadowColor: 'black', elevation: 2, backgroundColor: 'white', margin: 10, padding: 5 }}>
            <CachedImage
                style={{ width: 50, height: 50, borderRadius: 25 }}
                source={{ uri: item.profilePicture }}
                ttl={60 * 60 * 24 * 3}
                fallbackSource={require('../../assets/images/KootaK.png')}
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
            <TouchableOpacity onPress={() => this.setState({ userModalVisible: true, selectedUser: item.id })} onLongPress={() => this.setState({ userModalVisible: true, selectedUser: item.id })}>
                <View style={{ borderBottomWidth: 1, flexDirection: 'row' }}>
                    <View style={{ padding: 10 }}>
                        <CachedImage
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                            source={{ uri: item.profilePicture }}
                            ttl={60 * 60 * 24 * 3}
                            fallbackSource={require('../../assets/images/KootaK.png')}
                        />
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ margin: 10 }}>{item.username}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    changePassword() {
        if (this.state.oldPassword === "" || this.state.newPassword1 === "" || this.state.newPassword2 === "") {
            if (this.state.oldPassword === "") {
                this.setState({ oldPasswordError: "You need to specify your old password!" })
            }

            if (this.state.newPassword1 === "") {
                this.setState({ newPassword1Error: "You need to specify your new password!" })
            }

            if (this.state.newPassword2 === "") {
                this.setState({ newPassword2Error: "You need to confirm your password!" })
            }

            return;
        }


        if (this.state.newPassword1 !== this.state.newPassword2) {
            this.setState({ newPassword2Error: "Your passwords must match!" })
            return;
        }

        fetch(getURLForPlatform() + 'api/v1/rest_auth/password/change/', {
            headers: {
                Authorization: "Token " + this.props.token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'new_password1': this.state.newPassword1,
                'new_password2': this.state.newPassword2,
                'old_password': this.state.oldPassword
            })
        }).then(request => request.json())
            .then(requestObject => {
                if (requestObject["detail"]) {
                    this.setState({ editingDetails: false, changedPassword: true });
                    setTimeout(() => {
                        this.setState({ changedPassword: false });

                    }, 5000);
                }
                if (requestObject["old_password"]) {
                    this.setState({ oldPasswordError: requestObject["old_password"][0] })
                }
            })
    }

    unfriendUser(userID) {
        if (userID === -1) {
            this.setState({ userModalVisible: false });
        }
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/unfriend/', {
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
                    this.props.userActions.loadContacts(this.props.token, this.props.user);
                    this.removeUserFromFilteredUsers(userID);
                    this.setState({ userModalVisible: false, selectedUser: -1 });
                }
            })
    }

    blockUser(userID) {
        if (userID === -1) {
            this.setState({ userModalVisible: false });
        }
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/block/', {
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
                    this.props.userActions.loadBlocked(this.props.token, this.props.user);
                    this.removeUserFromFilteredUsers(userID);
                    this.setState({ userModalVisible: false, selectedUser: -1 });
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
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/requests/', {
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
                    this.props.userActions.loadContacts(this.props.token, this.props.user);
                    this.props.userActions.loadIncomingRequests(this.props.token, this.props.user);
                    this.filterFriends(this.state.filterString, userFor);
                }
            })
    }

    denyRequest(userFor) {
        console.log("Deny friend request")
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/requests/', {
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
                    this.props.userActions.loadIncomingRequests(this.props.token, this.props.user);
                }
            })
    }

    emptyFriendList = () => (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>Can't find any users! Add some friends via the add button in the friends heading</Text>
        </View>
    );

    filterFriends(text, newFriend) {
        if (!this.props.contacts) {
            return;
        }
        var filteredFriends = this.props.contacts.slice();
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
        fetch(getURLForPlatform() + "api/v1/user/" + this.props.user + "/", {
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
                this.props.userActions.loadUserDetails(this.props.token, this.props.user);
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
            const fileName = this.props.details.username + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes();
            this.setState({ loadingPic: true })
            fetch(getURLForPlatform() + 'api/v1/image/?type=profile', {
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
                                fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/', {
                                    method: 'PUT',
                                    body: JSON.stringify({
                                        'profilePicture': 'https://s3.us-east-2.amazonaws.com/koota-profile-pictures/' + fileName
                                    }),
                                    headers: {
                                        Authorization: "Token " + this.props.token
                                    },
                                }).then(editUserResponse => {
                                    if (editUserResponse.status === 200) {
                                        this.props.userActions.loadUserDetails(this.props.token, this.props.user);
                                        this.setState({ profilePictureModalVisible: false, loadingPic: false })
                                    }
                                })
                            }
                        }
                    };
                    xhr.send({ uri: response.uri, type: 'image/jpeg', name: fileName + '.jpg' })

                })
        })
    }

    _onRefresh() {
        this.props.userActions.loadContacts(this.props.token, this.props.user);
        this.props.userActions.loadUserDetails(this.props.token, this.props.user);
        this.props.userActions.loadIncomingRequests(this.props.token, this.props.user);
        this.filterFriends(this.state.filterString, {})
    }

    render() {
        console.log(Platform.OS)
        var date;
        if (this.props.details) {
            date = new Date(this.props.details.created);
        } else {
            date = new Date();
        }
        if (this.props.details) {
            return (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    {Platform.OS === 'android' && <View style={{ backgroundColor: this.props.details.color }}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon android="md-menu" ios="ios-menu" style={{ fontSize: 40, margin: 5, color: Color(this.props.details.color).isDark() ? 'white' : 'black' }} />
                        </TouchableOpacity>
                    </View>}
                    <View style={{ flex: 1 }}>
                        <View style={{ backgroundColor: this.props.details.color, alignItems: 'center', justifyContent: 'center', paddingBottom: 10 }}>
                            <CachedImage
                                style={{ width: 100, height: 100, borderRadius: 50 }}
                                source={{ uri: this.props.details.profilePicture }}
                                ttl={60 * 60 * 24 * 3}
                                fallbackSource={require('../../assets/images/KootaK.png')}
                            />
                            <Text style={{ color: Color(this.props.details.color).isDark() ? 'white' : 'black', fontSize: 20 }}>{this.props.details.firstName} {this.props.details.lastName}</Text>
                            <Text style={{ color: Color(this.props.details.color).isDark() ? 'white' : 'black' }}>{this.props.details.username}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Button
                                onPress={() => console.log("Test")}
                                title="Learn More"
                                color="#841584"
                                accessibilityLabel="Learn more about this purple button"
                            />
                            <Button
                                onPress={() => console.log("Test")}
                                title="Learn More"
                                color="#841584"
                                accessibilityLabel="Learn more about this purple button"
                            />
                        </View>
                        <View>
                            <View>
                                <Text>{moment(this.props.details.create).format('M/D/YYYY')}</Text>
                                <Text>join date</Text>
                            </View>
                            <View>
                                <Text>{this.props.details.points}</Text>
                                <Text>points</Text>
                            </View>
                        </View>
                        <View>
                            <View>
                                <View>
                                    <Text>achievements</Text>
                                    <Text>30</Text>
                                </View>
                            </View>
                            <View>
                                {/* Achievement list view goes here */}
                            </View>
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View><Text>Loading...</Text></View>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        token: state.tokenReducer.token,
        details: state.userReducer.details,
        contacts: state.userReducer.contacts,
        pendingIncomingRelationships: state.userReducer.pendingIncomingRelationships
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
