import { connect } from 'react-redux';
import React from 'react';
import { styles } from '../../../assets/styles';
import { BackHandler, DeviceEventEmitter, FlatList, Text, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity, View, Platform, Keyboard } from 'react-native';
import { ConversationHeader } from './conversationHeader';
import { getURLForPlatform } from '../../utils/networkUtils';
import { HeaderBackButton } from 'react-navigation';

import { getDateStringForMessage } from '../../utils/textUtils';
import PlatformIonicon from '../../utils/platformIonicon';
import { Bubble } from './bubble';
import { getMaterialColor } from '../../utils/styleutils';

import { CachedImage } from 'react-native-cached-image';
import {
    Menu,
    MenuTrigger,
    MenuOptions,
    MenuOption
} from 'react-native-popup-menu';

// Probably want to switch to https://github.com/APSL/react-native-keyboard-aware-scroll-view at some point

// Two options for starting a new conversation:
// newConvo=false or not included - params={userString, eventName, color, thread} 
// newConvo=true - params={userString, eventName, eventID, toUsers}

class ConversationView extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: <ConversationHeader users={navigation.state.params.userString} eventName={navigation.state.params.eventName} />,
        headerStyle: { backgroundColor: typeof (jsVar) == 'undefined' ? getMaterialColor() : '#' + navigation.state.params.color },
        headerLeft: <HeaderBackButton onPress={() => { if (navigation.state.params.backKey) { navigation.goBack(navigation.state.params.backKey) } else { navigation.goBack() } }} />,
        /*headerRight: <View style={{ paddingRight: 10 }}>
            <Menu>
                <MenuTrigger>
                    <PlatformIonicon
                        name={'more'}
                        size={30}
                        style={{ color: "white" }}
                    />
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={{ marginTop: 30 }}>
                    <MenuOption onSelect={() => console.log("refresh")}>
                        <Text>Refresh</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </View>*/
    });

    constructor(props) {
        super(props);

        // TODO: when the convo is a new one, users can just contain the logged in user
        // But when we switch to websockets, it's possible for others to message before the user
        // Closes the conversation
        if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.newConvo) {
            this.state = {
                messageContent: "",
                messages: [],
                threadID: '',
                users: [
                    { id: this.props.user.id, username: this.props.user.username, profilePicture: this.props.user.profilePicture }
                ]
            }
        } else {
            if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.thread) {
                this.state = {
                    messageContent: "",
                    messages: this.props.navigation.state.params.thread.messages,
                    threadID: this.props.navigation.state.params.thread.id,
                    users: this.props.navigation.state.params.thread.users
                }
            } else if (this.props.thread) {
                this.state = {
                    messageContent: "",
                    messages: this.props.thread.messages,
                    threadID: this.props.thread.id,
                    users: this.props.thread.users
                }
            }
        }

        this.sendMessage = this.sendMessage.bind(this);
        this.handleBackPress = this.handleBackPress.bind(this);
    }

    _keyExtractor = (item, index) => item.id;

    componentDidMount() {
        setTimeout(() => {
            if (this.scrollView) {
                this.scrollView.scrollToEnd({ animated: false })
            }

        }, 150);

        /*setTimeout(() => {

        })*/

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refresh', {});
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.keyboardDidShowListener.remove();
    }

    _keyboardDidShow() {
        setTimeout(() => {
            if (this.scrollView) {
                this.scrollView.scrollToEnd({ animated: false })
            }

        }, 300);
    }

    render() {
        return (
            <View style={[styles.flex1, { backgroundColor: '#DCDCDC' }]} >
                <ScrollView
                    ref={scrollView => { this.scrollView = scrollView; }}
                    keyboardShouldPersistTaps={'handled'}
                    style={{ flex: 1, flexGrow: 1, margin: 10, backgroundColor: '#DCDCDC' }}>
                    <FlatList
                        data={this.state.messages}
                        keyExtractor={this._keyExtractor}
                        extraData={this.state}
                        initialNumToRender={this.state.messages.length}
                        renderItem={({ item, separators }) => {
                            if (item.fromUser !== this.props.user.id) {
                                return (
                                    <View style={[styles.flex1, { flexDirection: 'row', alignContent: 'flex-end', marginTop: 5, marginBottom: 10 }]}>
                                        <View style={{ justifyContent: 'flex-end', margin: 1 }}>
                                            <CachedImage
                                                source={{ uri: this.getProfilePictureFromMessage(item.fromUser, this.state.users) }}
                                                style={{ borderRadius: 10, width: 20, height: 20 }}
                                                ttl={60 * 60 * 24 * 3}
                                                fallbackSource={require('../../../assets/images/KootaK.png')}
                                            />
                                        </View>
                                        <Bubble
                                            isUserSender={item.fromUser === this.props.user.id}
                                            message={item.content}
                                            username={this.getUsernameFromMessage(item.fromUser, this.state.users)}
                                            sendDate={getDateStringForMessage(new Date(item.sentDate))}
                                        />
                                    </View>
                                )
                            } else {
                                return (
                                    <View style={[styles.flex1, { flexDirection: 'row', alignContent: 'flex-end', marginTop: 5, marginBottom: 10 }]}>
                                        <View style={{ flex: 1 }}></View>
                                        <Bubble
                                            isUserSender={item.fromUser === this.props.user.id}
                                            message={item.content}
                                            username={this.getUsernameFromMessage(item.fromUser, this.state.users)}
                                            sendDate={getDateStringForMessage(new Date(item.sentDate))}
                                        />
                                    </View>
                                )
                            }
                        }}
                    />
                </ScrollView>
                <KeyboardAvoidingView enabled behavior={Platform.OS === 'ios' ? "padding" : null} keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}>
                    <View style={{ flexDirection: 'row', padding: 5, backgroundColor: '#f9f9f9' }}>
                        <TouchableOpacity
                            onPress={() => console.log("Pressed media button")}>
                            <View style={{ paddingRight: 10, alignContent: 'center' }}>
                                <PlatformIonicon
                                    name={'images'}
                                    size={30}
                                    style={{ color: "black" }}
                                />
                            </View>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', flex: 1, alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                            <TextInput
                                value={this.state.messageContent}
                                style={{ flex: 1, borderBottomColor: Platform.OS === 'ios' ? 'black' : null, borderBottomWidth: 1 }}
                                height={40}
                                onChangeText={(messageContent) => this.setState({ messageContent })}
                            />
                            <TouchableOpacity
                                onPress={this.sendMessage}>
                                <View style={{ paddingLeft: 10, paddingRight: 5, alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                    <PlatformIonicon
                                        name={'send'}
                                        size={30}
                                        style={{ color: "black" }}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        )
    }

    handleBackPress() {
        if (this.props.navigation.state.params.backKey) {
            this.props.navigation.goBack(this.props.navigation.state.params.backKey)
        } else {
            this.props.navigation.goBack()
        }

        return true;
    }

    getUsernameFromMessage(messageSender, users) {
        for (var i = 0; i < users.length; i++) {
            if (messageSender === users[i].id) {
                return users[i].username;
            }
        }
    }

    getProfilePictureFromMessage(messageSender, users) {
        for (var i = 0; i < users.length; i++) {
            if (messageSender === users[i].id) {
                return users[i].profilePicture;
            }
        }
    }

    sendMessage() {
        if (this.state.messageContent.length < 1) {
            return
        }

        if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params.newConvo && this.state.messages.length < 1) {
            // Is a newConvo
            var messageBody = {
                from: this.props.user.id,
                sentDate: new Date(),
                content: this.state.messageContent,
                createThread: true,
                event: this.props.navigation.state.params.eventID,
                users: this.props.navigation.state.params.toUsers
            }
        } else {

            var messageBody = {
                from: this.props.user.id,
                sentDate: new Date(),
                content: this.state.messageContent,
                createThread: false,
                thread: this.state.threadID
            }
        }

        if (this.props.groupID) {
            messageBody["group"] = this.props.groupID;
        }

        fetch(getURLForPlatform() + "api/v1/messages/", {
            method: 'POST',
            headers: {
                Authorization: "Token " + this.props.token
            },
            body: JSON.stringify(messageBody),
        }).then(response => response.json())
            .then(responseJSON => {
                this.setState({ messageContent: "" })

                if (this.state.threadID === '') {
                    this.setState({ threadID: responseJSON['threadID'] })
                }
            })

        messageBody["fromUser"] = this.props.user.id;
        messageBody["id"] = Math.random().toString(36).substr(2, 5);
        var messages = this.state.messages;
        messages.push(messageBody);

        this.setState({ messages: messages });
        setTimeout(() => {
            this.scrollView.scrollToEnd({ animated: true })
        }, 150);
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConversationView);