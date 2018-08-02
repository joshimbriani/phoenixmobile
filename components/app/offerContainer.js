import React from 'react';
import { View, Image, Text, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import CheckBox from 'react-native-check-box'
import { CachedImage } from 'react-native-cached-image';

import PlatformIonicon from '../utils/platformIonicon';

export class OfferContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
        }
    }

    render() {
        const width = Dimensions.get('window').width;
        if (Object.keys(this.props.offer).length > 0) {
            return (
                <View key={this.props.index} style={{flexDirection: 'row', shadowRadius: 10, shadowOpacity: 1, shadowColor: 'black', elevation: 2, backgroundColor: 'white', padding: 5, marginBottom: 5}}>
                    <View style={{paddingRight: 10}}>
                        <CachedImage
                            style={{ width: 100, height: 100 }}
                            source={{ uri: this.props.offer.icon }}
                        />
                    </View>
                    <View style={{width: width - 185}}>
                        {this.props.offer.adType === "OF" && <Text style={{ fontWeight: 'bold' }} numberOfLines={2}>{this.props.offer.name}</Text>}
                        <Text numberOfLines={1}>{this.props.offer.place.name}</Text>
                        <Text numberOfLines={1}>{this.props.offer.place.addressStreet}</Text>
                        {this.props.offer.place.addressUnit && this.props.offer.place.addressUnit.length > 0 && <Text numberOfLines={1}>{this.props.offer.place.addressUnit}</Text>}
                        <Text numberOfLines={1}>{this.props.offer.place.addressState}</Text>
                        {this.props.offer.adType === "IN" && <Text numberOfLines={1}>{this.props.offer.tagLine}</Text>}
                    </View>
                    {this.props.addable && <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=> {
                            if (!this.state.checked) {
                                // It wasn't checked but now it is
                                this.props.addToEvent(this.props.offer.id);
                            } else {
                                this.props.removeFromEvent(this.props.offer.id);
                            }
                            this.setState({checked: !this.state.checked})
                        }}
                        isChecked={this.state.checked}
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