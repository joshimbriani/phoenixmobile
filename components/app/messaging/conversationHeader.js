import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

import PlatformIonicon from '../../utils/platformIonicon';

// TODO: Need to wrap my Ionicon in a TouchableOpacity

export class ConversationHeader extends React.Component {
    render() {
        return (
            <View style={{paddingLeft: 10, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    <Text numberOfLines={1} style={{fontSize: 20, fontWeight: 'bold'}}>{this.props.users}</Text>
                    <Text numberOfLines={1} style={{fontSize: 10}}>{this.props.eventName}</Text>
                </View>
                <View style={{paddingRight: 20, justifyContent: 'center'}}>
                    <PlatformIonicon
                        name={'more'}
                        size={30}
                        style={{ color: "white" }}
                    />
                </View>
            </View>
        )
    }
}

ConversationHeader.propTypes = {
    users: PropTypes.string,
    eventName: PropTypes.string
}