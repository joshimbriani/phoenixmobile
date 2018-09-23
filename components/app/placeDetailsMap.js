import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, TouchableOpacity, View, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import { styles } from '../../assets/styles';

class PlaceDetailsMaps extends React.Component {
    render() {
        console.log(this.props.place)
        if (Object.keys(this.props.place).length > 0) {
            return (
                <View style={styles.flex1} >
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.eventDetailPlaceMap}
                        region={{
                            latitude: parseFloat(this.props.place.latitude),
                            longitude: parseFloat(this.props.place.longitude),
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: parseFloat(this.props.place.latitude),
                                longitude: parseFloat(this.props.place.longitude),
                            }}
                            title={this.props.place.name}
                        />
                    </MapView>
                </View>
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

PlaceDetailsMaps.propTypes = {
    place: PropTypes.object
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlaceDetailsMaps);