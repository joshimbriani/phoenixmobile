import React from 'react';
import { connect } from 'react-redux';
import { Text, FlatList, View, Button, TextInput, TouchableOpacity, Keyboard, ToastAndroid } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { getURLForPlatform } from '../utils/networkUtils';
import Swiper from 'react-native-swiper';
import { Content, Form, Item, Input, Label } from 'native-base';
import ColorPicker from '../utils/ColorPicker';

import { materialColors } from '../utils/styleutils';
import { styles } from '../../assets/styles';
import HideableView from '../utils/hideableView';
import { CachedImage } from 'react-native-cached-image';
import debounce from 'lodash/debounce';

class NewGroup extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: 'Create a New Group',
    });

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description: "",
            color: materialColors[0],
            users: [],
            userSearchQuery: "",
            groupUsers: [this.props.user],
            errors: ""
        }

        this.loadUsers = this.loadUsers.bind(this);
        this.toggleUser = this.toggleUser.bind(this);
        this.userInGroup = this.userInGroup.bind(this);
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({item}) => {
        if (item.id !== this.props.user.id) {
            return (
                <View style={{flexDirection: 'row', marginBottom: 5, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: 'black'}}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <View style={{paddingRight: 10}}>
                            <CachedImage
                                style={{ width: 50, height: 50, borderRadius:25 }}
                                source={{ uri: item.profilePicture }}
                                ttl={60*60*24*3}
                                fallbackSource={require('../../assets/images/KootaK.png')}
                            />
                        </View>
                        <View style={{justifyContent: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>{item.username}</Text>
                        </View>
                    </View>
                    <View style={{justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={() => this.toggleUser(item)}>
                            <View style={{backgroundColor: '#2ecc71', aspectRatio: 1}}>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <PlatformIonicon
                                        name={this.userInGroup(item) ? "checkmark" : "add"}
                                        size={50} 
                                        style={{ color: "white", alignItems: 'center', paddingLeft: 'auto' }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return null;
        }
    };

    render() {
        return (
            <Swiper onMomentumScrollEnd={() => Keyboard.dismiss()} nextButton={<Text>&gt;</Text>} buttonWrapperStyle={{alignItems: 'flex-end'}} prevButton={<Text>&lt;</Text>} style={styles.wrapper} showsButtons={true} loop={false} removeClippedSubviews={false} >
                <View style={styles.flex1}>
                    <Content style={styles.flex1} keyboardShouldPersistTaps={'handled'}>
                        <Form>
                            <Item stackedLabel>
                                <Label>Group Name</Label>
                                <Input 
                                    name="name" 
                                    onChangeText={(text) => this.setState({"name": text, "errors": ""})} 
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>Color</Label>
                                <ColorPicker
                                    colors={materialColors}
                                    selectedColor={this.state.color}
                                    onSelect={(color) => this.setState({ color: color })}
                                />
                            </Item>
                            <Item stackedLabel last>
                                <Label>Group Description</Label>
                                <Input
                                    name="description" 
                                    multiline={true} 
                                    numberOfLines={5}
                                    onChangeText={(text) => this.setState({"description": text})} 
                                />
                            </Item>
                        </Form>
                    </Content>
                </View>
                <View style={styles.flex1}>
                    <Text style={{padding: 10}}>Group Members</Text>
                    <View style={{backgroundColor: 'white', padding: 5}}>
                        <TextInput value={this.userListToString(this.state.groupUsers)} placeholder="" editable={false} style={{height: 50}} />
                    </View>
                    <View style={{padding: 5}}>
                        <TextInput value={this.state.userSearchQuery} onChangeText={(text) => this.saveTextAndSearch(text)} placeholder="Type a username here" editable={true} style={{height: 50, borderBottomWidth: 1}} />
                    </View>
                    <FlatList
                        data={this.state.users}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        style={{flex: 1}}
                        keyboardShouldPersistTaps={'handled'}
                    />
                    <View style={{marginBottom: 50}}>
                        <HideableView hide={!this.state.errors} style={{backgroundColor: 'red', padding: 5}}>
                            <Text>{this.state.errors}</Text>
                        </HideableView>
                        <Button onPress={() => this.submitForm()} title="Create Group" />
                    </View>
                </View>
            </Swiper>
        )
    }

    toggleUser(user) {
        // If not in list
        if (!this.userInGroup(user)) {
            if (this.state.groupUsers.length >= 200) {
                ToastAndroid.show("Can't add more than 200 users to a group!", ToastAndroid.SHORT);
                return;
            }
            var groupUsers = this.state.groupUsers.slice();
            groupUsers.push(user);
            this.setState({ groupUsers: groupUsers, errors: "" });
        } else {
            const userIndex = this.state.groupUsers.findIndex(obj => obj.id == user.id);
            if (userIndex >= 0) {
                var groupUsers = this.state.groupUsers.slice();
                groupUsers.splice(userIndex, 1);
                this.setState({ groupUsers: groupUsers });
            } 
        }
    }

    userInGroup(user) {
        var inList = false;
        this.state.groupUsers.forEach((listUser) => {
            if (listUser.id === user.id) {
                inList = true
            }
        })

        return inList
    }

    saveTextAndSearch(text) {
        this.setState({ userSearchQuery: text })
        if (text !== "") {
            this.loadUsers(text);
        } else {
            this.setState({ users: [] })
        }
    }

    loadUsers = debounce((query) => {
        if (query === '') {
            this.setState({ users: [] });
            return;
        }
        fetch(getURLForPlatform() + "api/v1/user/search/?username=" + query + '&status=1', {
            headers: {
                Authorization: "Token " + this.props.token
            },
        })
        .then(response => response.json())
        .then(responseObj => {
            this.setState({users: responseObj["users"]});
        });
    })

    userListToString(users) {
        var userListString = "";
        for (var i = 0; i < users.length; i++) {
            userListString += users[i].username;
            userListString += ', '
        }

        return userListString
    }

    submitForm() {
        if (this.state.name === "") {
            this.setState({errors: "You need to give your group a name!"})
            return;
        }

        if (this.state.groupUsers.length < 2) {
            this.setState({errors: "You need to add at least one user to your group beside yourself!"});
            return;
        }

        var groupObject = {
            'name': this.state.name,
            'users': this.state.groupUsers.map(user => user.id),
            'color': this.state.color,
            'description': this.state.description
        }

        fetch(getURLForPlatform() + "api/v1/groups/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'POST',
            body: JSON.stringify(groupObject)
        })
        .then(response => response.json())
        .then(responseObj => {
            if (responseObj["success"]) {
                this.props.navigation.navigate('GroupWrapper', {backKey: this.props.navigation.state.key, groupID: responseObj["groupID"]});
            } else {
                this.setState({errors: "Something went wrong. Please try again in a few minutes."})
            }
        });
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
        
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewGroup);