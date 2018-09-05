import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

import { Dropdown } from 'react-native-material-dropdown';

export class LocationHeader extends React.Component {
    render() {
        return (
            <View style={{ paddingLeft: 10, flexDirection: 'row', flex: 1, alignItems: 'center', alignSelf: 'center', alignContent: 'center' }}>
                <View style={{ flex: 1, alignItems: 'center', alignSelf: 'center', alignContent: 'center' }}>
                    <Dropdown
                        containerStyle={{width: 200}}
                        value={this.props.selectedLocation}
                        onChangeText={(text) => console.log(text)}
                        data={this.props.locations}
                        valueExtractor={(location) => {console.log(location); return location.id}}
                        labelExtractor={(location) => location.name}
                        
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