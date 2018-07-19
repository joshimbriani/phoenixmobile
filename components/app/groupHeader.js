import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';

import PlatformIonicon from '../utils/platformIonicon';

// TODO: Probably want to stop hard coding the location of the details slide
// TODO: NEed to change sad to save

export class GroupHeader extends React.Component {
    render() {
        if (this.props.index === 1) {
            if (this.props.editing) {
                return (
                    <View style={{paddingLeft: 10, flexDirection: 'row'}}>
                        <TouchableOpacity onPress={this.props.saveEdits}>
                            <PlatformIonicon
                                name={'sad'}
                                size={30}
                                style={{ color: "black" }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.props.cancelEditing}>
                            <PlatformIonicon
                                name={'close-circle'}
                                size={30}
                                style={{ color: "black" }}
                            />
                        </TouchableOpacity>
                    </View>
                )
            } else {
                return (
                    <View style={{paddingLeft: 10, flexDirection: 'row'}}>
                        <TouchableOpacity onPress={this.props.edit} style={{paddingRight: 10}}>
                            <PlatformIonicon
                                name={'create'}
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