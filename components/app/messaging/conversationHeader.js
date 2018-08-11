import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

import PlatformIonicon from '../../utils/platformIonicon';

// TODO: Need to wrap my Ionicon in a TouchableOpacity

export class ConversationHeader extends React.Component {
    render() {
        return (
            <View style={{paddingLeft: 10, flexDirection: 'row', flex: 1, alignItems: 'center', alignSelf: 'center', alignContent: 'center'}}>
                <View style={{flex: 1, alignItems: 'center', alignSelf: 'center', alignContent: 'center'}}>
                    <Text numberOfLines={1} style={{fontSize: 20, fontWeight: 'bold'}}>{this.props.users}</Text>
                    <Text numberOfLines={1} style={{fontSize: 10}}>{this.props.eventName}</Text>
                </View>
            </View>
        )
    }
}

ConversationHeader.propTypes = {
    users: PropTypes.string,
    eventName: PropTypes.string
}