import React from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { CachedImage } from 'react-native-cached-image';
import * as userActions from '../../redux/actions/user';
import Modal from "react-native-modal";
import { getURLForPlatform } from '../utils/networkUtils';
import { bindActionCreators } from 'redux';

class BlockedUserSettings extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Blocked Users',
    });

    constructor(props) {
        super(props);

        this.state = {
            showUserModal: false,
            selectedUser: -1
        }
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({ item }) => (
        <View>
            <TouchableOpacity onPress={() => this.setState({ showUserModal: true, selectedUser: item.id }) }>
                <View style={{ flexDirection: 'row', height: 75, backgroundColor: 'white', borderBottomWidth: 1, }}>
                    <View style={{ paddingLeft: 20, justifyContent: 'center' }}>
                        <CachedImage
                            style={{ width: 50, height: 50, borderRadius: 30, borderWidth: 1, borderColor: '#fff' }}
                            source={{ uri: item.profilePicture }}
                        />
                    </View>
                    <View style={{ paddingLeft: 20, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    unblockUser(userToUnblock) {
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user.id + '/block/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'user': userToUnblock,
                'action': 'unblock'
            })
        }).then(request => request.json())
            .then(requestObject => {
                if (requestObject["success"]) {
                    this.props.userActions.loadUser(this.props.token);
                    this.setState({ showUserModal: false, selectedUser: -1 });
                }
            })
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.props.user.blockedUsers}
                    extraData={this.props}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
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
                            <TouchableOpacity onPress={() => this.unblockUser(this.state.selectedUser)}>
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
)(BlockedUserSettings);