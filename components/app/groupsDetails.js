import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';
import { Text, View, TextInput, TouchableOpacity, FlatList, Button, ScrollView, ToastAndroid, Alert } from 'react-native';
import ColorPicker from '../utils/ColorPicker';
import { CachedImage } from 'react-native-cached-image';
import { bindActionCreators } from 'redux';

import PlatformIonicon from '../utils/platformIonicon';
import { materialColors } from '../utils/styleutils';
import { getURLForPlatform } from '../utils/networkUtils';
import HideableView from '../utils/hideableView';
import * as userActions from '../../redux/actions/user';
import { StackActions, NavigationActions } from 'react-navigation';
import Modal from "react-native-modal";

class GroupsDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editing: true,
            name: this.props.group.name,
            description: this.props.group.description,
            color: this.props.group.color,
            removeUserModalVisible: false,
            selectedUser: -1
        }

        this.renderFriends = this.renderFriends.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.showDeleteAlert = this.showDeleteAlert.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.props.group.name && !prevProps.group.name) || (this.props.group.description && !prevProps.group.description) || (this.props.group.color && !prevProps.group.color)) {
            this.setState({ name: this.props.group.name, description: this.props.group.description, color: this.props.group.color })
        }
    }

    _keyExtractor = (item, index) => item.id;

    renderFriends = ({ item }) => (
        <TouchableOpacity onPress={() => this.setState({ removeUserModalVisible: true, selectedUser: item.id })} onLongPress={() => this.setState({ removeUserModalVisible: true, selectedUser: item.id })}>
            <View style={{ borderBottomWidth: 1, flexDirection: 'row', backgroundColor: 'white' }}>
                <View style={{ padding: 10 }}>
                    <CachedImage
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        source={{ uri: item.profilePicture }}
                        ttl={60 * 60 * 24 * 3}
                        fallbackSource={require('../../assets/images/KootaK.png')}
                    />
                </View>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <Text style={{ margin: 10 }}>{item.username}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    removeFromGroup(userID) {
        if (userID === this.props.group.creator) {
            ToastAndroid.show("You can't leave this group, you're the admin!", ToastAndroid.SHORT);
            return
        }
        fetch(getURLForPlatform() + 'api/v1/groups/' + this.props.group.id + '/users/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'DELETE',
            body: JSON.stringify({
                'user': userID
            })
        }).then(request => request.json())
            .then(requestObject => {
                if (requestObject["success"]) {
                    this.setState({ selectedUser: -1, removeUserModalVisible: false })
                    if (userID === this.props.user.id) {
                        this.props.userActions.loadUser(this.props.token);
                        const resetAction = StackActions.reset({
                            index: 0,
                            key: null,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Main', action: StackActions.push({ routeName: 'GroupsList' }), }),
                            ]
                        })
                        this.props.navigation.dispatch(resetAction);
                    } else {
                        this.props.loadGroup();
                    }
                }
            })
    }

    showDeleteAlert() {
        Alert.alert(
            'Confirm Deletion',
            "Are you sure you want to delete this? There's no going back after this!",
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yep!', onPress: () => this.deleteGroup() },
            ]
        )

    }

    deleteGroup() {
        if (this.props.user.id !== this.props.group.creator) {
            return;
        }

        fetch(getURLForPlatform() + 'api/v1/groups/' + this.props.group.id + '/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'DELETE'
        }).then(request => request.json())
            .then(requestObject => {
                if (requestObject["delete"]) {
                    this.props.loadGroups();
                    this.props.navigation.goBack();
                }
            })
    }

    render() {
        if (Object.keys(this.props.group).length > 0) {
            return (
                <ScrollView style={[styles.flex1]} keyboardShouldPersistTaps={'handled'} >
                    <View style={{ flexDirection: 'row', height: 50, padding: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>Name</Text>
                        </View>
                        <View style={{ flex: 3 }}>
                            <HideableView hide={!this.props.editing}>
                                <TextInput
                                    value={this.state.name}
                                    name="name"
                                    onChangeText={(text) => { this.setState({ "name": text, "errors": "" }); this.props.setGroupParams(text, this.state.color, this.state.description) }}
                                />
                            </HideableView>
                            <HideableView hide={this.props.editing}>
                                <Text>{this.props.group.name}</Text>
                            </HideableView>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>Color</Text>
                        </View>
                        <View style={{ flex: 3 }}>
                            <HideableView hide={!this.props.editing}>
                                <ColorPicker
                                    colors={materialColors}
                                    selectedColor={this.state.color}
                                    onSelect={(color) => { this.setState({ color: color }); this.props.setGroupParams(this.state.name, color, this.state.description) }}
                                />
                            </HideableView>
                            <HideableView hide={this.props.editing}>
                                <View style={{ backgroundColor: this.props.group.color, height: 50, aspectRatio: 1, borderRadius: 30 }}></View>
                            </HideableView>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>Description</Text>
                        </View>
                        <View style={{ flex: 3 }}>
                            <HideableView hide={!this.props.editing}>
                                <TextInput
                                    name="description"
                                    multiline={true}
                                    value={this.state.description}
                                    numberOfLines={5}
                                    onChangeText={(text) => { this.setState({ "description": text }); this.props.setGroupParams(this.state.name, this.state.color, text) }}
                                />
                            </HideableView>
                            <HideableView hide={this.props.editing}>
                                <HideableView hide={!this.props.group.description.length > 0}>
                                    <Text>{this.props.group.description}</Text>
                                </HideableView>
                                <HideableView hide={!this.props.group.description.length <= 0}>
                                    <Text>This group has no description. Feel free to add one!</Text>
                                </HideableView>
                            </HideableView>
                        </View>
                    </View>
                    {this.props.user.id !== this.props.group.creator && <View style={{ flexDirection: 'row', padding: 10, margin: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Button
                                onPress={() => this.removeFromGroup(this.props.user.id)}
                                title="Leave Group"
                                color="#F44336"
                                accessibilityLabel="Leave this group"
                            />
                        </View>
                    </View>}
                    {this.props.user.id === this.props.group.creator && <View style={{ flexDirection: 'row', padding: 10, margin: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Button
                                onPress={() => this.showDeleteAlert()}
                                title="Delete Group"
                                color="#F44336"
                                accessibilityLabel="Delete this group"
                            />
                        </View>
                    </View>}
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: this.state.color, alignItems: 'center' }}>
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text style={{ fontWeight: 'bold', color: 'white' }}>Group Members</Text>
                            </View>
                            <View style={{ paddingRight: 20, flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('AddToGroup', { loadGroup: this.props.loadGroup, group: this.props.group })}><PlatformIonicon
                                    name={"add"}
                                    size={30} //this doesn't adjust the size...?
                                    style={{ color: "white" }}
                                /></TouchableOpacity>
                            </View>
                        </View>

                        <FlatList
                            data={this.props.group.users}
                            extraData={this.props}
                            keyExtractor={this._keyExtractor}
                            renderItem={this.renderFriends}
                            ListEmptyComponent={this.emptyFriendList}
                        />
                    </View>
                    <Modal
                        isVisible={this.state.removeUserModalVisible}
                        backdropOpacity={0.5}
                        onBackButtonPress={() => this.setState({ removeUserModalVisible: false, selectedUser: -1 })}
                        onBackdropPress={() => this.setState({ removeUserModalVisible: false, selectedUser: -1 })}>
                        <View style={{
                            borderColor: "rgba(0, 0, 0, 0.1)",
                            backgroundColor: "white",
                        }}>
                            <View style={{
                                width: 324,
                                height: 50
                            }}>
                                <TouchableOpacity onPress={() => this.removeFromGroup(this.state.selectedUser)}>
                                    <View style={{ height: 50, width: 324, borderBottomWidth: 1, borderBottomColor: '#000', justifyContent: 'center', paddingLeft: 10 }}>
                                        <Text>Remove from Group</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            )
        } else {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }
    }
}

GroupsDetails.propTypes = {
    setGroupParams: PropTypes.func
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
)(GroupsDetails);