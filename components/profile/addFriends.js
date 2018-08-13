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
            searchText: ""
        }
        this.findFriends = this.findFriends.bind(this);
        this.addFriend = this.addFriend.bind(this);
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
                <Button
                    onPress={() => this.addFriend(item.id)}
                    title="Send Request"
                    color="#2196F3"
                    accessibilityLabel="Send friend request"
                />
            </View>
        </View>
    )

    addFriend(userID) {
        fetch(getURLForPlatform() + 'api/v1/user/' + this.props.user.id + '/requests/', {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'POST',
            body: JSON.stringify({
                'user': userID
            })
        }).then(request => request.json())
        .then(requestObject => {
            if (requestObject["success"]) {
                this.findFriends(this.state.searchText);
            }
        })
    }

    findFriends(text) {
        if (text === '') {
            this.setState({ filteredUsers: [] });
            return;
        }
        fetch(getURLForPlatform() + 'api/v1/user/search/?username=' + text + '&notRelationship=true', {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseObject => {
                this.setState({ filteredUsers: responseObject["users"] })
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
                />
            </View>
        );
    }
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
)(AddFriends);

