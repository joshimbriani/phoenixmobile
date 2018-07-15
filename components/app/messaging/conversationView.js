import { connect } from 'react-redux';
import React from 'react';
import { styles } from '../../../assets/styles';
import { Button, FlatList, Image, ScrollView, Platform, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ConversationHeader } from './conversationHeader';
import { getURLForPlatform } from '../../utils/networkUtils';

import HideableView from '../../utils/hideableView';
import { getDateStringForMessage } from '../../utils/textUtils';
import PlatformIonicon from '../../utils/platformIonicon';

// Probably want to switch to https://github.com/APSL/react-native-keyboard-aware-scroll-view at some point

class ConversationView extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: <ConversationHeader users={navigation.state.params.userString} eventName={navigation.state.params.eventName} />,
        headerStyle: { backgroundColor: '#' + navigation.state.params.color },
    });

    constructor(props) {
        super(props);

        this.state = {
            messageContent: ""
        }

        this.sendMessage = this.sendMessage.bind(this);
    }

    _keyExtractor = (item, index) => item.id;

    componentDidMount() {
        //console.log(this.scrollView)
        setTimeout(() => {
            this.scrollView.scrollToEnd({animated: false})
        }, 50);
    }

    render() {
        return (
            <View style={[styles.flex1]} >
                <ScrollView
                    ref={scrollView => { this.scrollView = scrollView; }}
                    style={{ flex: 1, flexGrow: 1 }}>
                    <FlatList
                        data={this.props.navigation.state.params.thread.messages}
                        keyExtractor={this._keyExtractor}
                        renderItem={({ item, separators }) => {
                            if (item.fromUser !== this.props.user.id) {
                                return (
                                    <View style={[styles.flex1, { flexDirection: 'row', alignContent: 'flex-end' }]}>
                                        <View style={{justifyContent: 'flex-end'}}>
                                            <Image
                                                source={{ uri: this.getProfilePictureFromMessage(item.fromUser, this.props.navigation.state.params.thread.users) }}
                                                style={{ borderRadius: 25, borderWidth: 1, borderColor: '#fff', width: 20, height: 20 }}
                                            />
                                        </View>
                                        <View>
                                            <View style={{backgroundColor: 'red', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: 'white'}}>
                                                <Text>{item.content}</Text>
                                            </View>
                                            <HideableView hide={true}>
                                                <Text>{this.getUsernameFromMessage(item.fromUser, this.props.navigation.state.params.thread.users)}</Text>
                                                <Text>{getDateStringForMessage(new Date(item.sentDate))}</Text>
                                            </HideableView>
                                        </View>
                                    </View>
                                )
                            } else {
                                return (
                                    <View style={[styles.flex1, { flexDirection: 'row', alignContent: 'flex-end' }]}>
                                        <View style={{flex: 1}}></View>
                                        <View>
                                            <View style={{backgroundColor: 'blue', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: 'white'}}>
                                                <Text>{item.content}</Text>
                                            </View>
                                            <HideableView hide={true}>
                                                <Text>{this.getUsernameFromMessage(item.fromUser, this.props.navigation.state.params.thread.users)}</Text>
                                                <Text>{getDateStringForMessage(new Date(item.sentDate))}</Text>
                                            </HideableView>
                                        </View>
                                        <View style={{justifyContent: 'flex-end'}}>
                                            <Image
                                                source={{ uri: this.getProfilePictureFromMessage(item.fromUser, this.props.navigation.state.params.thread.users) }}
                                                style={{ borderRadius: 25, borderWidth: 1, borderColor: '#fff', width: 20, height: 20 }}
                                            />
                                        </View>
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

        console.log(messageBody)

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