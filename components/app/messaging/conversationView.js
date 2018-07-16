import { connect } from 'react-redux';
import React from 'react';
import { styles } from '../../../assets/styles';
import { Button, DeviceEventEmitter, FlatList, Image, ScrollView, Platform, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ConversationHeader } from './conversationHeader';
import { getURLForPlatform } from '../../utils/networkUtils';

import { getDateStringForMessage } from '../../utils/textUtils';
import PlatformIonicon from '../../utils/platformIonicon';
import { Bubble } from './bubble';

// Probably want to switch to https://github.com/APSL/react-native-keyboard-aware-scroll-view at some point

// newConvo 

class ConversationView extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: <ConversationHeader users={navigation.state.params.userString} eventName={navigation.state.params.eventName} />,
        headerStyle: { backgroundColor: '#' + navigation.state.params.color },
    });

    constructor(props) {
        super(props);

        this.state = {
            messageContent: "",
            messages: this.props.navigation.state.params.thread.messages
        }

        this.sendMessage = this.sendMessage.bind(this);

    }

    _keyExtractor = (item, index) => item.id;

    componentDidMount() {
        //console.log(this.scrollView)
        setTimeout(() => {
            this.scrollView.scrollToEnd({animated: false})
        }, 150);

    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refresh',  {})
    }

    render() {
        return (
            <View style={[styles.flex1]} >
                <ScrollView
                    ref={scrollView => { this.scrollView = scrollView; }}
                    style={{ flex: 1, flexGrow: 1 }}>
                    <FlatList
                        data={this.state.messages}
                        keyExtractor={this._keyExtractor}
                        extraData={this.state}
                        initialNumToRender={this.state.messages.length}
                        renderItem={({ item, separators }) => {
                            if (item.fromUser !== this.props.user.id) {
                                return (
                                    <View style={[styles.flex1, { flexDirection: 'row', alignContent: 'flex-end', marginTop: 5, marginBottom: 5 }]}>
                                        <View style={{justifyContent: 'flex-end'}}>
                                            <Image
                                                source={{ uri: this.getProfilePictureFromMessage(item.fromUser, this.props.navigation.state.params.thread.users) }}
                                                style={{ borderRadius: 25, borderWidth: 1, borderColor: '#fff', width: 20, height: 20 }}
                                            />
                                        </View>
                                        <Bubble 
                                            isUserSender={item.fromUser === this.props.user.id} 
                                            message={item.content} 
                                            username={this.getUsernameFromMessage(item.fromUser, this.props.navigation.state.params.thread.users)}
                                            sendDate={getDateStringForMessage(new Date(item.sentDate))}
                                        />
                                    </View>
                                )
                            } else {
                                return (
                                    <View style={[styles.flex1, { flexDirection: 'row', alignContent: 'flex-end', marginTop: 5, marginBottom: 5 }]}>
                                        <View style={{flex: 1}}></View>
                                        <Bubble 
                                            isUserSender={item.fromUser === this.props.user.id} 
                                            message={item.content} 
                                            username={this.getUsernameFromMessage(item.fromUser, this.props.navigation.state.params.thread.users)}
                                            sendDate={getDateStringForMessage(new Date(item.sentDate))}
                                        />
                                    </View>
                                )
                            }
                        }}
                    />
                </ScrollView>
                <KeyboardAvoidingView enabled keyboardVerticalOffset={75} behavior="padding">
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
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <TextInput
                                value={this.state.messageContent}
                                style={{ flex: 1 }}
                                height={40}
                                onChangeText={(messageContent) => this.setState({ messageContent })}
                            />
                            <TouchableOpacity
                                onPress={this.sendMessage}>
                                <View style={{ paddingLeft: 10, alignContent: 'center' }}>
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

        var messageBody = {
            from: this.props.user.id,
            sentDate: new Date(),
            content: this.state.messageContent,
            createThread: false,
            thread: this.props.navigation.state.params.thread.id
        }

        fetch(getURLForPlatform() + "api/v1/messages/", {
            method: 'POST',
            headers: {
                Authorization: "Token " + this.props.token
            },
            body: JSON.stringify(messageBody),
        }).then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({messageContent: ""})
            })

        messageBody["fromUser"] = this.props.user.id;
        messageBody["id"] = Math.random().toString(36).substr(2, 5);
        var messages = this.state.messages;
        messages.push(messageBody);

        this.setState({messages: messages});
        setTimeout(() => {
            this.scrollView.scrollToEnd({animated: true})
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