import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../../assets/styles';
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

import { generateUserToString, getDateStringForMessage } from '../../utils/textUtils';

import { CachedImage } from 'react-native-cached-image';

// Alternate between colors for threads?

class ThreadsView extends React.Component {
    _keyExtractor = (item, index) => item.id;

    render() {
        if (Object.keys(this.props.threads).length > 0) {
            return (
                <View style={[styles.flex1]} >
                    <FlatList
                        data={this.props.threads}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item, separators}) => {
                            const date = new Date(item.lastUpdate)
                            return (
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('ConversationView', { newConvo: false, thread: item, eventName: this.props.eventName, color: this.props.color, userString: generateUserToString(this.props.user.id, item.users, this.props.creator) })}>
                                <View style={{flexDirection: 'row', marginTop: 10, paddingRight: 10, paddingLeft: 10, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: '#000'}}>
                                    <View style={{ justifyContent: 'center'}}>
                                        <CachedImage
                                            source={{uri: this.generateUserImage(item.users)}}
                                            style={{borderRadius:30, borderWidth: 1, borderColor: '#fff', width: 60, height: 60}}
                                        />
                                    </View>
                                    <View style={{flex: 1, justifyContent: 'center', paddingLeft: 15}}>
                                        <Text numberOfLines={1} style={{fontWeight: "bold"}}>{generateUserToString(this.props.user.id, item.users, this.props.creator)}</Text>
                                        <Text numberOfLines={1}>{item.messages[item.messages.length - 1].content}</Text>
                                    </View>
                                    <View style={{justifyContent: 'center'}}>
                                        <Text>{getDateStringForMessage(date)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}}
                    />
                </View>
            )
        } else {
            const invLevel = this.getUserInvolvementLevel(this.props.userGoing, this.props.userInterested);
            return (
                <View style={{padding: 5}}>
                    <Text>No messages found. Send a new message by pressing the add button down below.</Text>
                    <Text>Remember only messages sent by users in the context of this event will show up here.</Text>
                    <Text>You are currently marked as <Text style={{fontWeight: 'bold'}}>{invLevel[0]}</Text> for this event.</Text>
                    <Text><Text style={{fontWeight: 'bold'}}>{invLevel[0]}</Text> users can message <Text style={{fontWeight: 'bold'}}>{invLevel[1]}</Text> {invLevel[2]}</Text>
                </View>
            )
        }
    }

    generateUserImage(users) {
        var usersCopy = users.slice();
        for (var i = usersCopy.length - 1; i >= 0; i--) {
            if (usersCopy[i].id === this.props.user.id) {
                usersCopy.splice(i, 1);
                break;
            }
        }
        return usersCopy[0].profilePicture
    }

    getUserInvolvementLevel(userGoing, userInvolved) {
        if (userGoing) {
            return ['Going', 'the event organizer and other interested or going users.', '']
        }

        if (userInvolved) {
            return ['Interested', 'the event organizer and other interested or going users.', '']
        }

        return ['Not Interested or Going', 'the event organizer.', 'Mark yourself as interested or going to message other users!']
    }
}

ThreadsView.propTypes = {
    threads: PropTypes.array,
    eventName: PropTypes.string
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
)(ThreadsView);