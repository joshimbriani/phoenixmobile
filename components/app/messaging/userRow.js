import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import PlatformIonicon from '../../utils/platformIonicon';

import PropTypes from 'prop-types';

import { CachedImage } from 'react-native-cached-image';

export class UserRow extends React.Component {

    constructor(props) {
        super(props);

        this.selectRow = this.selectRow.bind(this);
    }
    render() {
        if (Object.keys(this.props.user).length > 0) {
            if (!this.userInList(this.props.user)) {
                return (
                    <TouchableOpacity onPress={this.selectRow}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{marginRight: 10}}>
                                <CachedImage 
                                    style={{ width: 50, height: 50, borderRadius:25 }} 
                                    source={{ uri: this.props.user.profilePicture }} 
                                />
                            </View>
                            <Text style={{ fontSize: 15, color: 'black', alignSelf: 'center' }} key={(this.props.section || '') + this.props.user.id}>{this.props.user.username}</Text>
                        </View>
                    </TouchableOpacity>
                )
            } else {
                return (
                    <TouchableOpacity onPress={this.selectRow}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{ width: 50, height: 50, borderRadius:30, borderWidth: 1, borderColor: '#fff', marginRight: 10 }}>
                                <PlatformIonicon name={'checkmark'} size={40} style={{alignSelf: 'center', justifyContent: 'center'}} />
                            </View>
                            <Text style={{ fontSize: 15, color: 'black', alignSelf: 'center' }} key={(this.props.section || '') + this.props.user.id}>{this.props.user.username}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
        } else {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }
    }

    selectRow() {
        this.props.select(this.props.user);
    }

    userInList(user) {
        var inList = false;
        this.props.toUsers.forEach((listUser) => {
            if (listUser.id === user.id) {
                inList = true
            }
        })

        return inList
    }
}

UserRow.PropTypes = {
    user: PropTypes.object.isRequired,
    section: PropTypes.string,
    select: PropTypes.func
}