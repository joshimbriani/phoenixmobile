import React from 'react';
import { Alert, Platform, StyleSheet, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { styles } from '../../assets/styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

var parseGooglePlace = require('parse-google-place')

class OfferPlace extends React.Component {

    constructor(props) {
        super(props);

        this.shareOffer = this.shareOffer.bind(this);
    }

    shareOffer(offer) {
        Share.share({
            message: "It's " + this.props.details.username + " and I think you'd really like this offer - " + offer.name + ". Check it out on Koota! https://kootasocial.com/",
            url: 'http://kootasocial.com',
            title: "I think you'd like this event on Koota!"
        }, {
                // Android only:
                dialogTitle: 'Share this awesome event!',
            })

    }

    render() {
        if (Object.keys(this.props.offer).length > 0) {
            var address = {};
            if (this.props.offer.place.placeDetails.address && (!this.props.offer.place.addressState || !this.props.offer.place.addressStreet)) {
                var address = this.props.offer.place.placeDetails.address;
                if (typeof address === "string") {
                    address = JSON.parse(address)
                }
                address = parseGooglePlace({"address_components": address});
            }
            return (
                <View style={styles.flex1} >
                    <View style={styles.eventDetailPlaceBody}>
                        <View>
                            <Text style={styles.eventDetailSectionHeader}>Place</Text>
                            {this.props.offer.place && Object.keys(address).length > 0 && <View>
                                <Text>{this.props.offer.place.name}</Text>
                                <Text>{address.streetNumber}{address.streetNumber && ' '}{address.streetName}</Text>
                                {this.props.offer.place.addressUnit && <Text>{this.props.offer.place.addressUnit}</Text>}
                                <Text>{address.city}, {address.stateShort} {address.zipCode}</Text>
                            </View>}
                            {this.props.offer.place && this.props.offer.place.addressState && this.props.offer.place.addressStreet && <View>
                                <Text>{this.props.offer.place.name}</Text>
                                <Text>{this.props.offer.place.addressStreet}</Text>
                                {this.props.offer.place.addressUnit && <Text>{this.props.offer.place.addressUnit}</Text>}
                                <Text>{this.props.offer.place.addressState}</Text>
                            </View>}
                            {!this.props.offer.place && <View>
                                <Text>Islands of Adventure</Text>
                                <Text>6000 Universal Blvd</Text>
                                <Text>Attn Forbidden Journey</Text>
                                <Text>ORlando, FL 32819</Text>
                            </View>}
                        </View>
                    </View>
                    {this.props.offer.place.placeDetails && <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.eventDetailPlaceMap}
                        region={{
                            latitude: this.props.offer.place.placeDetails.latitude,
                            longitude: this.props.offer.place.placeDetails.longitude,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: this.props.offer.place.placeDetails.latitude,
                                longitude: this.props.offer.place.placeDetails.longitude,
                              }}
                            title={this.props.offer.place.name}
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
)(OfferPlace);
