import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';

import HideableView from '../../utils/hideableView';

// TODO: Need to wrap my Ionicon in a TouchableOpacity

export class Bubble extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: true
        }

        this.toggleHiddenInfo = this.toggleHiddenInfo.bind(this);
    }
    render() {
        return (
            <View style={{ marginRight: this.props.isUserSender ? 0 : 20, marginLeft: this.props.isUserSender ? 10 : 0 }}>
                <TouchableOpacity
                    onPress={this.toggleHiddenInfo}>
                    <View style={{ backgroundColor: this.props.isUserSender ? '#ecf0f1' : '#3498db', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: this.props.isUserSender ? '#ecf0f1' : '#3498db' }}>
                        <Text style={{ fontSize: 17, overflow: 'hidden' }}>{this.props.message}</Text>
                    </View>
                </TouchableOpacity>
                <HideableView hide={this.state.hidden} style={{ flexDirection: 'row' }}>
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