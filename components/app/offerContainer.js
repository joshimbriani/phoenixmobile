import React from 'react';
import { View, Image, Text, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import CheckBox from 'react-native-check-box'
import { CachedImage } from 'react-native-cached-image';
var parseGooglePlace = require('parse-google-place')

import PlatformIonicon from '../utils/platformIonicon';

export class OfferContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
        }
    }

    componentDidMount() {
        if (this.props.checked) {
            this.setState({ checked: this.props.checked })
        }
    }

    render() {
        const width = Dimensions.get('window').width;
        var address = {};
        if (this.props.offer && this.props.offer.place && this.props.offer.place.placeDetails.address) {
            if (IsJsonString(this.props.offer.place.placeDetails.address)) {
                address = parseGooglePlace({ "address_components": JSON.parse(this.props.offer.place.placeDetails.address) });
            }
        }
        if (Object.keys(this.props.offer).length > 0) {
            return (
                <View key={this.props.index} style={{ flexDirection: 'row', shadowRadius: 10, shadowOpacity: 1, shadowColor: 'black', elevation: 2, backgroundColor: 'white', padding: 5, marginBottom: 5, borderRadius: 5 }}>
                    <View style={{ paddingRight: 10, alignSelf: 'center' }}>
                        <CachedImage
                            style={{ width: 100, height: 100 }}
                            source={{ uri: this.props.offer.icon }}
                            ttl={60 * 60 * 24 * 3}
                            fallbackSource={require('../../assets/images/KootaK.png')}
                        />
                    </View>
                    <View style={{ width: width - 185 }}>
                        {this.props.offer.adType === "OF" && <Text style={{ fontWeight: 'bold' }} numberOfLines={2}>{this.props.offer.name}</Text>}
                        <Text numberOfLines={1}>{this.props.offer.place.name}</Text>
                        <Text numberOfLines={1}>{this.props.offer.place.addressStreet || (address.streetNumber + address.streetName)}</Text>
                        {this.props.offer.place.addressUnit && this.props.offer.place.addressUnit.length > 0 && <Text numberOfLines={1}>{this.props.offer.place.addressUnit}</Text>}
                        <Text numberOfLines={1}>{this.props.offer.place.addressState || address.city + ", " + address.stateShort + " " + address.zipCode}</Text>
                        {this.props.offer.adType === "IN" && <Text numberOfLines={1}>{this.props.offer.tagLine}</Text>}
                    </View>
                    {this.props.addable && <CheckBox
                        style={{ flex: 1, padding: 10 }}
                        onClick={() => {
                            if (!this.state.checked) {
                                // It wasn't checked but now it is
                                this.props.addToEvent(this.props.offer);
                            } else {
                                this.props.removeFromEvent(this.props.offer.id);
                            }
                            this.setState({ checked: !this.state.checked })
                        }}
                        isChecked={this.props.checked}
                    />}
                </View>
            );
        } else {
            return null;
        }
    }
}

OfferContainer.propTypes = {
    offer: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    addable: PropTypes.bool.isRequired,
    addToEvent: PropTypes.func
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
