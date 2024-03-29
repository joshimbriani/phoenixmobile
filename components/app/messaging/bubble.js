import React from 'react';
import PropTypes from 'prop-types';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import ParsedText from 'react-native-parsed-text';

import HideableView from '../../utils/hideableView';

export class Bubble extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: true
        }

        this.toggleHiddenInfo = this.toggleHiddenInfo.bind(this);
    }
    render() {
        console.log(this.props.message)
        return (
            <View style={{ marginRight: this.props.isUserSender ? 0 : 20, marginLeft: this.props.isUserSender ? 10 : 0 }}>
                <TouchableOpacity
                    onPress={this.toggleHiddenInfo}>
                    <View style={{ backgroundColor: this.props.isUserSender ? '#ecf0f1' : '#3498db', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: this.props.isUserSender ? '#ecf0f1' : '#3498db' }}>
                        <ParsedText
                            style={{ fontSize: 17, overflow: 'hidden' }}
                            parse={
                                [
                                    {type: 'url', style: {color: 'blue', textDecorationLine: 'underline'}, onPress: (url) => Linking.openURL(url)},
                                    {type: 'phone', style: {color: 'blue', textDecorationLine: 'underline'}, onPress: (phone) => Linking.openURL('tel:' + phone)},
                                    {type: 'email', style: {color: 'blue', textDecorationLine: 'underline'}, onPress: (email) => Linking.openURL('mailto:' + email)},
                                    {pattern: /[-a-zA-Z0-9:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b/, style: {color: 'blue', textDecorationLine: 'underline'}, onPress: (url) => Linking.openURL('https://' + url)},
                                ]
                            }
                        >
                            {this.props.message}
                        </ParsedText>
                    </View>
                </TouchableOpacity>
                <HideableView hide={this.state.hidden} style={{ flexDirection: 'row', paddingLeft: 10 }}>
                    <Text style={{ fontSize: 10, paddingRight: 10 }}>{this.props.username}</Text>
                    <Text style={{ fontSize: 10, alignContent: 'flex-end', justifyContent: 'flex-end' }}>{this.props.sendDate}</Text>
                </HideableView>
            </View>
        )
    }

    toggleHiddenInfo() {
        this.setState({ hidden: !this.state.hidden });
    }
}

Bubble.propTypes = {
    isUserSender: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    sendDate: PropTypes.string.isRequired
}