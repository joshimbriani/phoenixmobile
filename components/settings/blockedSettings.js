import React from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { Content, Form, Item, Input, Label } from 'native-base';
import { connect } from 'react-redux';
import { CachedImage } from 'react-native-cached-image';
import * as userActions from '../../redux/actions/user';
import Modal from "react-native-modal";
import { getURLForPlatform } from '../utils/networkUtils';
import { bindActionCreators } from 'redux';
import debounce from 'lodash/debounce';
import PlatformIonicon from '../utils/platformIonicon';

class BlockedUserSettings extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Blocked Users',
    });

    constructor(props) {
        super(props);

        this.state = {
            showUserModal: false,
            selectedUser: -1,
            searchText: "",
            filteredUsers: []
        }
    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = (item) => {
        return (
            <TouchableOpacity style={{ height: 75 }} onLongPress={() => this.setState({ showUserModal: true, selectedUser: item.id })} onPress={() => this.setState({ showUserModal: true, selectedUser: item.id })}>
                <View style={{ flexDirection: 'row', height: 75, backgroundColor: 'white', borderBottomWidth: 1, }}>
                    <View style={{ paddingLeft: 20, justifyContent: 'center' }}>
                        <CachedImage
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                            source={{ uri: item.profilePicture }}
                            ttl={60 * 60 * 24 * 3}
                            fallbackSource={require('../../assets/images/KootaK.png')}
                        />
                    </View>
                    <View style={{ paddingLeft: 20, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    renderAddBlock = (item) => (
        <View style={{ flexDirection: 'row', height: 75, backgroundColor: 'white', borderBottomWidth: 1, }}>
            <View style={{ paddingLeft: 20, justifyContent: 'center' }}>
                <CachedImage
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: item.profilePicture }}
                    ttl={60 * 60 * 24 * 3}
                    fallbackSource={require('../../assets/images/KootaK.png')}
                />
            </View>
            <View style={{ paddingLeft: 20, justifyContent: 'center', flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.toggleBlock(item.id, 'block')}>
                    <View style={{ backgroundColor: '#F44336', aspectRatio: 1 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <PlatformIonicon
                                name={"close-circle"}
                                size={50}
                                style={{ color: "white", alignItems: 'center', paddingLeft: 'auto' }}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )


    toggleBlock(user, action) {
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/block/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'user': user,
                'action': action
            })
        }).then(request => request.json())
            .then(requestObject => {
                if (requestObject["success"]) {
                    this.props.userActions.loadBlocked(this.props.token, this.props.user);
                    if (action === 'unblock') {
                        this.setState({ showUserModal: false, selectedUser: -1 });
                    }
                    if (action === 'block') {
                        var users = this.state.filteredUsers.slice();
                        for (var i = users.length - 1; i >= 0; i--) {
                            if (users[i].id === user) {
                                users.splice(i, 1);
                            }
                        }

                        this.setState({ filteredUsers: users })
                    }

                }
            })
    }

    findUsers = debounce((text) => {
        if (text === '') {
            this.setState({ filteredUsers: [] });
            return;
        }
        fetch(getURLForPlatform() + 'api/v1/user/search/?username=' + text + '&excludeStatus=4', {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseObject => {
                this.setState({ filteredUsers: responseObject["users"] })
            })
    })

    componentDidMount() {
        this.props.userActions.loadBlocked(this.props.token, this.props.user);
    }

    render() {
        return (
            <View>
                <View style={{ paddingBottom: 10 }}>
                    <Form>
                        <Item>
                            <Input placeholder="Search For Users to Block" onChangeText={(text) => { this.setState({ searchText: text }); this.findUsers(text) }} />
                        </Item>
                    </Form>
                </View>
                <View style={{ flex: 1 }}>
                    {!this.state.searchText && this.props.blockedUsers.length > 0 && this.props.blockedUsers.map((user, index) => {
                        return this._renderItem(user)
                    })}
                    {!this.state.searchText && this.props.blockedUsers.length <= 0 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>You have no users blocked</Text>
                        </View>
                    </View>}
                    {this.state.searchText.length > 0 && this.state.filteredUsers.map((user, index) => {
                        return this.renderAddBlock(user)
                    })}
                    {this.state.searchText.length > 0 && this.state.filteredUsers.length <= 0 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>No results</Text>
                    </View>}
                </View>
                <Modal
                    isVisible={this.state.showUserModal}
                    backdropOpacity={0.5}
                    onBackButtonPress={() => this.setState({ showUserModal: false, selectedUser: -1 })}
                    onBackdropPress={() => this.setState({ showUserModal: false, selectedUser: -1 })}>
                    <View style={{
                        borderColor: "rgba(0, 0, 0, 0.1)",
                        backgroundColor: "white",
                    }}>
                        <View style={{
                            width: 324,
                            height: 50
                        }}>
                            <TouchableOpacity onPress={() => this.toggleBlock(this.state.selectedUser, 'unblock')}>
                                <View style={{ height: 50, width: 324, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>Remove Block</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        token: state.tokenReducer.token,
        blockedUsers: state.userReducer.blockedUsers
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
)(BlockedUserSettings);