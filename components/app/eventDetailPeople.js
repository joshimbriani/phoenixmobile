import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';
import { Dimensions, TouchableOpacity, Text, View, Button } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

import { CachedImage } from 'react-native-cached-image';
import Modal from "react-native-modal";
import * as userActions from '../../redux/actions/user';
import { getURLForPlatform } from '../utils/networkUtils';
import { bindActionCreators } from 'redux';


// TODO: Add text to progress bar

class EventDetailPeople extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userOptionModalVisible: false,
            selectedUser: -1
        }
    }

    render() {
        console.log("blocked", this.props.blockedUsers)
        console.log("contacts", this.props.contacts)
        console.log("incoming", this.props.pendingIncomingRelationships)
        console.log("outgoing", this.props.pendingOutgoingRelationships)
        const selectedUserBlocked = this.props.blockedUsers.map((user) => user.id).indexOf(this.state.selectedUser) !== -1;
        const selectedUserContact = this.props.contacts.map((user) => user.id).indexOf(this.state.selectedUser) !== -1;
        const selectedUserRequestedCurrentUser = this.props.pendingIncomingRelationships.map((user) => user.id).indexOf(this.state.selectedUser) !== -1;
        const selectedUserPendingRequested = this.props.pendingOutgoingRelationships.map((user) => user.id).indexOf(this.state.selectedUser) !== -1;
        var modalHeight = 0;
        if (this.state.selectedUser === -1) {
            modalHeight = 0;
        } else if (selectedUserBlocked) {
            modalHeight = 50;
        } else if (selectedUserRequestedCurrentUser) {
            modalHeight = 150;
        } else {
            modalHeight = 100;
        }

        if (Object.keys(this.props.event).length > 0) {
            return (
                <View style={styles.flex1} >
                    {this.props.event.owned && <View style={styles.eventDetailPeopleSection}>
                        <Text style={styles.eventDetailSectionHeader}>Created By</Text>
                        <TouchableOpacity onLongPress={() => this.setState({ userOptionModalVisible: true, selectedUser: this.props.event.userBy.id })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
                                <CachedImage
                                    style={{ margin: 0, width: 50, height: 50, borderRadius: 25 }}
                                    source={{ uri: this.props.event.userBy.profilePicture }}
                                    ttl={60 * 60 * 24 * 3}
                                    fallbackSource={require('../../assets/images/KootaK.png')}
                                />
                                <Text style={{ paddingLeft: 20 }}>{this.props.event.userBy.username}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>}
                    {!this.props.event.owned && <View style={styles.eventDetailPeopleSection}>
                        <Text style={styles.eventDetailSectionHeader}>Groups</Text>
                        {this.props.event.forks && this.props.event.forks.length > 0 && <View style={{marginVertical: 5}}>
                            <Text>There are {this.props.event.forks.length} groups looking for users!</Text>
                        </View>}
                        <View style={{marginTop: 10, flexDirection: 'row'}}>
                            {this.props.event.forks && this.props.event.forks.length > 0 && <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Button
                                    onPress={() => this.findSubEvents()}
                                    title="Join a Group"
                                    color="#2196F3"
                                    accessibilityLabel="Join a Group"
                                />
                            </View>}
                            {this.props.event.forks && this.props.event.forks.length > 0 && <View style={{padding: 5, alignItems: 'center', justifyContent: 'center'}}>
                                <Text>Or</Text>
                            </View>}
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Button
                                    onPress={() => this.props.forkEvent()}
                                    title="Create a Group"
                                    color="#2196F3"
                                    accessibilityLabel="Create a Group"
                                />
                            </View>
                        </View>
                    </View>}
                    <View style={[styles.eventDetailPeopleSection, { flex: 3, justifyContent: 'flex-end' }]}>
                        <Text style={styles.eventDetailSectionHeader}>Going</Text>
                        {this.props.event.owned && <View style={{ flexDirection: 'row', }}>
                            {this.props.event.going.map((user, index) => {
                                return (
                                    <TouchableOpacity onLongPress={() => this.setState({ userOptionModalVisible: true, selectedUser: user.id })}>
                                        <View style={{ margin: 5 }}>
                                            <CachedImage
                                                key={index}
                                                style={{ width: 50, height: 50, borderRadius: 25 }}
                                                source={{ uri: user.profilePicture }}
                                                ttl={60 * 60 * 24 * 3}
                                                fallbackSource={require('../../assets/images/KootaK.png')}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>}
                        {this.props.event.owned && <View>
                            <ProgressBar style={{ marginTop: 'auto' }} progress={this.props.event.going && this.props.event.capacity && (this.props.event.going.length / this.props.event.capacity)} width={Dimensions.get('window').width - 30} />
                            <Text>{this.props.event.going.length} out of {this.props.event.capacity} places have been filled.</Text>
                        </View>}
                        {!this.props.event.owned && <View>
                            <Text>{this.props.event.going.length} users going</Text>
                        </View>}
                    </View>
                    <View style={[styles.eventDetailPeopleSection, { flex: 3 }]}>
                        <Text style={styles.eventDetailSectionHeader}>Interested</Text>
                        {this.props.event.owned && <View style={{ flexDirection: 'row' }}>
                            {this.props.event.interested.map((user, index) => {
                                return (
                                    <TouchableOpacity onLongPress={() => this.setState({ userOptionModalVisible: true, selectedUser: user.id })}>
                                        <View style={{ margin: 5 }}>
                                            <CachedImage
                                                key={index}
                                                style={{ width: 50, height: 50, borderRadius: 25 }}
                                                source={{ uri: user.profilePicture }}
                                                ttl={60 * 60 * 24 * 3}
                                                fallbackSource={require('../../assets/images/KootaK.png')}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>}
                        {!this.props.event.owned && <View>
                            <Text>{this.props.event.interested.length} users interested</Text>
                        </View>}
                    </View>
                    <Modal
                        isVisible={this.state.userOptionModalVisible}
                        backdropOpacity={0.5}
                        onBackButtonPress={() => this.setState({ userOptionModalVisible: false, selectedUser: -1 })}
                        onBackdropPress={() => this.setState({ userOptionModalVisible: false, selectedUser: -1 })}>
                        <View style={{
                            borderColor: "rgba(0, 0, 0, 0.1)",
                            backgroundColor: "white",
                        }}>
                            <View style={{
                                width: 324,
                                height: modalHeight
                            }}>
                                {!selectedUserBlocked && <TouchableOpacity onPress={() => this.addUserToContacts(this.state.selectedUser, !selectedUserContact && !selectedUserPendingRequested && !selectedUserRequestedCurrentUser, selectedUserContact || selectedUserPendingRequested, selectedUserRequestedCurrentUser, false)}>
                                    <View style={{ height: 50, width: 324, borderBottomWidth: 1, borderBottomColor: '#000', justifyContent: 'flex-start', paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                                        {this.props.distanceMeasure === 'mi' && <PlatformIonicon
                                            name='checkmark'
                                            size={30}
                                            style={{ paddingRight: 10, paddingLeft: 10 }}
                                        />}
                                        <Text>
                                            {selectedUserContact && "Remove User from Contacts"}
                                            {!selectedUserContact && !selectedUserPendingRequested && !selectedUserRequestedCurrentUser && "Add User to Contacts"}
                                            {selectedUserPendingRequested && "Cancel Contact Request"}
                                            {selectedUserRequestedCurrentUser && "Accept Contact Request"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>}
                                {selectedUserRequestedCurrentUser && <TouchableOpacity onPress={() => this.addUserToContacts(this.state.selectedUser, false, false, false, true)}>
                                    <View style={{ height: 50, width: 324, borderBottomWidth: 1, borderBottomColor: '#000', justifyContent: 'flex-start', paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                                        {this.props.distanceMeasure === 'mi' && <PlatformIonicon
                                            name='checkmark'
                                            size={30}
                                            style={{ paddingRight: 10, paddingLeft: 10 }}
                                        />}
                                        <Text>Deny Contact Request</Text>
                                    </View>
                                </TouchableOpacity>}
                                <TouchableOpacity onPress={() => this.blockUser(this.state.selectedUser, !selectedUserBlocked)}>
                                    <View style={{ height: 50, width: 324, justifyContent: 'flex-start', paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                                        {this.props.distanceMeasure === 'km' && <PlatformIonicon
                                            name='checkmark'
                                            size={30}
                                            style={{ paddingRight: 10, paddingLeft: 10 }}
                                        />}
                                        <Text>{!selectedUserBlocked ? "Block User" : "Unblock User"}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            )
        } else {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }
    }

    blockUser(userToBlock, blockUser) {
        if (userToBlock < 0) {
            return;
        }
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/block/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'user': userToBlock,
                'action': blockUser ? 'block' : 'unblock'
            })
        }).then(request => request.json())
            .then(requestObject => {
                if (requestObject["success"]) {
                    this.props.userActions.loadBlocked(this.props.token, this.props.user)
                    this.setState({ userOptionModalVisible: false })
                    this.setState({ selectedUser: -1 });
                }
            })
    }

    findSubEvents() {
        this.props.navigation.navigate('FindSubEvents', {event: this.props.event})
    }

    addUserToContacts(userToAdd, addUserToContacts, removeUserFromContacts, acceptUserRequest, denyUserRequest) {
        if (userToAdd < 0) {
            return;
        }
        if (addUserToContacts) {
            fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/requests/', {
                headers: {
                    Authorization: "Token " + this.props.token
                },
                method: 'POST',
                body: JSON.stringify({
                    'user': userToAdd,
                })
            }).then(request => request.json())
                .then(requestObject => {
                    if (requestObject["success"]) {
                        this.props.userActions.loadOutgoingRequests(this.props.token, this.props.user);
                        this.setState({ userOptionModalVisible: false });
                        this.setState({ selectedUser: -1 });
                    }
                })
        } else if (removeUserFromContacts) {
            fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/unfriend/', {
                headers: {
                    Authorization: "Token " + this.props.token
                },
                method: 'PUT',
                body: JSON.stringify({
                    'user': userToAdd,
                })
            }).then(request => request.json())
                .then(requestObject => {
                    if (requestObject["success"]) {
                        this.props.userActions.loadContacts(this.props.token, this.props.user)
                        this.setState({ userOptionModalVisible: false });
                        this.setState({ selectedUser: -1 });
                    }
                })
        } else if (acceptUserRequest) {
            fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/requests/', {
                headers: {
                    Authorization: "Token " + this.props.token
                },
                method: 'PUT',
                body: JSON.stringify({
                    'status': 1,
                    'user': userToAdd
                })
            }).then(request => request.json())
                .then(requestObject => {
                    if (requestObject["success"]) {
                        this.props.userActions.loadContacts(this.props.token, this.props.user)
                        this.setState({ userOptionModalVisible: false });
                        this.setState({ selectedUser: -1 });
                    }
                })
        } else if (denyUserRequest) {
            fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user + '/requests/', {
                headers: {
                    Authorization: "Token " + this.props.token
                },
                method: 'PUT',
                body: JSON.stringify({
                    'status': 3,
                    'user': userToAdd
                })
            }).then(request => request.json())
                .then(requestObject => {
                    if (requestObject["success"]) {
                        this.props.userActions.loadUser(this.props.token).then();
                        this.setState({ userOptionModalVisible: false });
                        this.setState({ selectedUser: -1 });
                    }
                })
        }

    }

}

EventDetailPeople.propTypes = {
    color: PropTypes.string,
    event: PropTypes.object
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        token: state.tokenReducer.token,
        blockedUsers: state.userReducer.blockedUsers,
        contacts: state.userReducer.contacts,
        pendingIncomingRelationships: state.userReducer.pendingIncomingRelationships,
        pendingOutgoingRelationships: state.userReducer.pendingOutgoingRelationships
    };
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventDetailPeople);