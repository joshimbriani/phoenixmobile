import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import PlatformIonicon from '../utils/platformIonicon';

// TODO: Probably want to stop hard coding the location of the details slide

export class GroupHeader extends React.Component {
    render() {
        var save = Platform.OS === 'android' ? 'md-save' : 'ios-save';
        var closeCircle = Platform.OS === 'android' ? 'md-close-circle' : 'ios-close-circle';
        var create = Platform.OS === 'android' ? 'md-create' : 'ios-create';
        if (this.props.index === 1) {
            if (this.props.editing) {
                return (
                    <View style={{paddingLeft: 10, flexDirection: 'row'}}>
                        <TouchableOpacity onPress={this.props.saveEdits}>
                            <View style={{padding: 5}}>
                                <Icon
                                    name={save}
                                    size={30}
                                    style={{ color: "black" }}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.props.cancelEditing}>
                            <View style={{padding: 5}}>
                                <Icon
                                    name={closeCircle}
                                    size={30}
                                    style={{ color: "black" }}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            } else {
                return (
                    <View style={{paddingLeft: 10, flexDirection: 'row'}}>
                        <TouchableOpacity onPress={this.props.edit} style={{paddingRight: 10}}>
                            <Icon
                                name={create}
                                size={30}
                                style={{ color: "black" }}
                            />
                        </TouchableOpacity>
                    </View> 
                )
            }
        } else {
            return null;
        }
    }
}

GroupHeader.propTypes = {
    index: PropTypes.number,
}