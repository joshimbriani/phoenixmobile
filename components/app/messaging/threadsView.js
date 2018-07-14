import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../../assets/styles';
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

import { generateUserToString, getDateStringForMessage } from '../../utils/textUtils';

// Alternate between colors for threads?

class ThreadsView extends React.Component {
    _keyExtractor = (item, index) => item.id;

    _onRefresh = () => {
        console.log("Refreshing")
      }

    render() {
        if (Object.keys(this.props.threads).length > 0) {
            return (
                <View style={[styles.flex1]} >
                    <FlatList
                        data={this.props.threads}
                        keyExtractor={this._keyExtractor}
                        refreshControl={
                            <RefreshControl
                              onRefresh={this._onRefresh}
                            />
                          }
                  
                        renderItem={({item, separators}) => {
                            const date = new Date(item.lastUpdate)
                            return (
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('ConversationView', { thread: item, eventName: this.props.eventName, color: this.props.color, userString: generateUserToString(this.props.user.id, item.users, this.props.creator) })}>
                                <View style={{flexDirection: 'row', marginTop: 10, paddingRight: 10, paddingLeft: 10, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: '#000'}}>
                                    <View style={{ justifyContent: 'center'}}>
                                        <Image
                                            source={{uri: this.generateUserImage(item.users)}}
                                            style={{borderRadius:30, borderWidth: 1, borderColor: '#fff', width: 60, height: 60}}
                                        />
                                    </View>
                                    <View style={{flex: 1, justifyContent: 'center', paddingLeft: 15}}>
                                        <Text numberOfLines={1} style={{fontWeight: "bold"}}>{generateUserToString(this.props.user.id, item.users, this.props.creator)}</Text>
                                        <Text numberOfLines={1}>{item.messages[0].content}</Text>
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
            return (
                <View>
                    <Text>No messages found. Send a new message by long pressing on a user. 
                        Remember only messages sent by users in the context of this event will show up here.</Text>
                </View>
            )
        }
    }

    generateUserImage(users) {
        return users[0].profilePicture
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