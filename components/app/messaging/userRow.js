import React from 'react';
import { SectionList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

import PropTypes from 'prop-types';

export class UserRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: false,
        }
    }
    render() {
        if (Object.keys(this.props.user).length > 0) {
            return (
                <TouchableOpacity onPress={() => this.props.select(this.props.user)}>
                    <View style={{flexDirection: 'row'}}>
                        <Image style={{ width: 50, height: 50, borderRadius:30, borderWidth: 1, borderColor: '#fff', marginRight: 10 }} source={{ uri: this.props.user.profilePicture }} />
                        <Text style={{ fontSize: 15, color: 'black', alignSelf: 'center' }} key={(this.props.section || '') + this.props.user.id}>{this.props.user.username}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }
    }
}

UserRow.PropTypes = {
    user: PropTypes.object.isRequired,
    section: PropTypes.string,
    select: PropTypes.func
}