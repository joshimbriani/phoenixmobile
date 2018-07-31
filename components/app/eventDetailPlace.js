import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';
import { Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

var parseGooglePlace = require('parse-google-place')

class EventDetailPlace extends React.Component {
    // TODO: Replace place with place.name or address
    // TODO: Put maps into application - https://github.com/react-community/react-native-maps
    render() {
        if (Object.keys(this.props.event).length > 0) {
            var address = {};
            if (this.props.event.place.placeDetails.address) {
                address = parseGooglePlace({"address_components": JSON.parse(this.props.event.place.placeDetails.address)});
            }
            return (
                <View style={styles.flex1} >
                    <View style={styles.eventDetailPlaceBody}>
                        <View>
                            <Text style={styles.eventDetailSectionHeader}>Place</Text>
                            {this.props.event.place && <View>
                                <Text>{this.props.event.place.name}</Text>
                                <Text>{address.streetNumber}{address.streetNumber && ' '}{address.streetName}</Text>
                                {this.props.event.place.addressUnit && <Text>{this.props.event.place.addressUnit}</Text>}
                                <Text>{address.city}, {address.stateShort} {address.zipCode}</Text>
                            </View>}
                            {!this.props.event.place && <View>
                                <Text>Islands of Adventure</Text>
                                <Text>6000 Universal Blvd</Text>
                                <Text>Attn Forbidden Journey</Text>
                                <Text>ORlando, FL 32819</Text>
                            </View>}
                        </View>
                    </View>
                    {this.props.event.place.placeDetails && <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.eventDetailPlaceMap}
                        region={{
                            latitude: this.props.event.place.placeDetails.latitude,
                            longitude: this.props.event.place.placeDetails.longitude,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: this.props.event.place.placeDetails.latitude,
                                longitude: this.props.event.place.placeDetails.longitude,
                              }}
                            title={this.props.event.place.name}
                        />
                    </MapView>}
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

EventDetailPlace.propTypes = {
    color: PropTypes.string,
    event: PropTypes.object
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventDetailPlace);