import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';
import { Dimensions, TouchableOpacity, Text, View } from 'react-native';
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
        const selectedUserBlocked = this.props.user.blockedUsers.map((user) => user.id).indexOf(this.state.selectedUser) !== -1;
        const selectedUserContact = this.props.user.friends.map((user) => user.id).indexOf(this.state.selectedUser) !== -1;
        const selectedUserRequestedCurrentUser = this.props.user.pendingIncomingRequests.map((user) => user.id).indexOf(this.state.selectedUser) !== -1;
        const selectedUserPendingRequested = this.props.user.pendingOutgoingRequests.map((user) => user.id).indexOf(this.state.selectedUser) !== -1;
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
                    <View style={styles.eventDetailPeopleSection}>
                        <Text style={styles.eventDetailSectionHeader}>Created By</Text>
                        <TouchableOpacity onLongPress={() => this.setState({ userOptionModalVisible: true, selectedUser: this.props.event.userBy.id })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
                                <CachedImage
                                    style={{ width: 50, height: 50, borderRadius: 30, borderWidth: 1, borderColor: '#fff' }}
                                    source={{ uri: this.props.event.userBy.profilePicture }}
                                />
                                <Text style={{ paddingLeft: 20 }}>{this.props.event.userBy.username}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.eventDetailPeopleSection, { flex: 3, justifyContent: 'flex-end' }]}>
                        <Text style={styles.eventDetailSectionHeader}>Going</Text>
                        <View style={{ flexDirection: 'row', }}>
                            {this.props.event.going.map((user, index) => {
                                return (
                                    <TouchableOpacity onLongPress={() => this.setState({ userOptionModalVisible: true, selectedUser: user.id })}>
                                        <CachedImage
                                            key={index}
                                            style={{ margin: 5, width: 50, height: 50, borderRadius: 30, borderWidth: 1, borderColor: '#fff' }}
                                            source={{ uri: user.profilePicture }}
                                        />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View>
                            <ProgressBar style={{ marginTop: 'auto' }} progress={this.props.event.going && this.props.event.capacity && (this.props.event.going.length / this.props.event.capacity)} width={Dimensions.get('window').width - 30} />
                            <Text>{this.props.event.going.length} out of {this.props.event.capacity} places have been filled.</Text>
                        </View>
                    </View>
                    <View style={[styles.eventDetailPeopleSection, { flex: 3 }]}>
                        <Text style={styles.eventDetailSectionHeader}>Interested</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {this.props.event.interested.map((user, index) => {
                                return (
                                    <TouchableOpacity onLongPress={() => this.setState({ userOptionModalVisible: true, selectedUser: user.id })}>
                                        <CachedImage
                                            key={index}
                                            style={{ margin: 5, width: 50, height: 50, borderRadius: 30, borderWidth: 1, borderColor: '#fff' }}
                                            source={{ uri: user.profilePicture }}
                                        />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
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
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user.id + '/block/', {
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
                    this.props.userActions.loadUser(this.props.token);
                    this.setState({ userOptionModalVisible: false})
                    this.setState({selectedUser: -1 });
                }
            })
    }

    addUserToContacts(userToAdd, addUserToContacts, removeUserFromContacts, acceptUserRequest, denyUserRequest) {
        if (userToAdd < 0) {
            return;
        }
        if (addUserToContacts) {
            fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user.id + '/requests/', {
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
                        this.props.userActions.loadUser(this.props.token);
                        this.setState({ userOptionModalVisible: false });
                        this.setState({selectedUser: -1 });
                    }
                })
        } else if (removeUserFromContacts) {
            fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user.id + '/unfriend/', {
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
                        this.props.userActions.loadUser(this.props.token);
                        this.setState({ userOptionModalVisible: false });
                        this.setState({selectedUser: -1 });
                    }
                })
        } else if (acceptUserRequest) {
            fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user.id + '/requests/', {
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
                        this.props.userActions.loadUser(this.props.token).then();
                        this.setState({ userOptionModalVisible: false });
                        this.setState({selectedUser: -1 });
                    }
                })
        } else if (denyUserRequest) {
            fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user.id + '/requests/', {
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
                        this.setState({selectedUser: -1 });
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
        token: state.tokenReducer.token
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