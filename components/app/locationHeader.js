import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

import { Dropdown } from 'react-native-material-dropdown';

export class LocationHeader extends React.Component {
    render() {
        return (
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', alignSelf: 'center', alignContent: 'center' }}>
                <View style={{ marginBottom: 10, flex: 1, alignItems: 'center', alignSelf: 'center', alignContent: 'center' }}>
                    <Dropdown
                        containerStyle={{width: 250 }}
                        value={this.props.selectedLocation}
                        onChangeText={(text) => this.props.setCurrentLocation(text)}
                        data={(this.props.locations || []).concat([{id: -2, name: 'Add Location...'}])}
                        valueExtractor={(location) => {return location.id}}
                        labelExtractor={(location) => location.name}
                        fontSize={20}
                        dropdownPosition={0}
                    />
                </View>
            </View>
        )
    }
}

LocationHeader.propTypes = {
    locations: PropTypes.array.isRequired,
    setCurrentLocation: PropTypes.func.isRequired,
    selectedLocation: PropTypes.number.isRequired
}