import React from 'react';

import { Content, Form, Item, Input, Label, Button } from 'native-base';
import { ScrollView, View, Picker, ToastAndroid, KeyboardAvoidingView, Platform, PermissionsAndroid, FlatList, TouchableOpacity, Text } from 'react-native';
import { REACT_SWIPER_BOTTOM_MARGIN } from '../../utils/constants';
import debounce from 'lodash/debounce';
import PlatformIonicon from '../../utils/platformIonicon';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Dialog from "react-native-dialog";
import { styles } from '../../../assets/styles';

export class PlaceNewEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            placeSearchText: "",
            placePredictions: [],
            geometryDetails: {},
            showHelp: false
        }

        this.getPlaces = this.getPlaces.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    placeDisplay() {
        if (Object.keys(this.props.place).length > 0 && this.props.place.structured_formatting && this.props.place.structured_formatting.main_text) {
            return this.props.place.structured_formatting.main_text;
        } else if (Object.keys(this.props.place).length > 0 && this.props.place.placeDetails) {
            return this.props.place.name;
        } else {
            return this.state.placeSearchText;
        }
    }

    getPlaces = debounce((text) => {
        var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + text + "&key=AIzaSyDUVAEJq3xQe6nTG4uaj00xcl-EkHp2oXQ&sessiontoken=" + this.props.session;

        if (this.props.lat > -200 && this.props.long > -200) {
            url += "&location=" + this.props.lat + "," + this.props.long + "&radius=25";
        }

        fetch(url)
            .then((results) => results.json())
            .then((resultsJSON) => { this.setState({ placePredictions: resultsJSON["predictions"] }) })
            .catch((error) => console.log(error.message));
    }, 250);

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.getPlaceDetails(item)}>
            <View id={item.id} style={{ borderBottomColor: '#333', borderBottomWidth: 1 }}>
                <Text style={{ padding: 5 }}>{item.structured_formatting.main_text}</Text>
                <Text style={{ padding: 5 }}>{item.structured_formatting.secondary_text}</Text>
            </View>
        </TouchableOpacity>
    );

    getPlaceDetails(item) {

        fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + item["place_id"] + '&fields=geometry&key=AIzaSyDUVAEJq3xQe6nTG4uaj00xcl-EkHp2oXQ&sessiontoken=' + this.props.session)
            .then((results) => results.json())
            .then((resultsJSON) => { this.setState({ geometryDetails: resultsJSON["result"]["geometry"] }); console.log(resultsJSON["result"]["geometry"]) })
            .catch((error) => console.log(error.message));

        this.setState({ placePredictions: [], placeSearchText: "" });
        this.props.onChange("place", item);
    }

    render() {
        return (
            <View style={styles.flex1} >
                <Dialog.Container visible={this.state.showHelp}>
                    <Dialog.Title>Place Screen</Dialog.Title>
                    <Dialog.Description>
                        On this screen you can choose where your event will take place. If you choose an offer, your place will be not editable.
                    </Dialog.Description>
                    <Dialog.Button label="Got it!" onPress={() => this.setState({ showHelp: false })} />
                </Dialog.Container>
                <View style={{ backgroundColor: '#03A9F4', flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 20, paddingVertical: 10, alignContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>Place</Text>
                    </View>
                    <View style={{ alignSelf: 'center', padding: 10 }}>
                        <View style={{ backgroundColor: 'white', height: 35, width: 35, borderRadius: 20 }}>
                            <TouchableOpacity onPress={() => this.setState({ showHelp: true })}>
                                <PlatformIonicon
                                    name={"help"}
                                    size={30} //this doesn't adjust the size...?
                                    style={{ color: "#607D8B", justifyContent: 'center', alignSelf: 'center' }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Form>
                    {this.props.errors["place"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 30, paddingVertical: 5, marginHorizontal: 30 }}>
                        <Text style={{ color: 'white' }}>{this.props.errors["place"]}</Text>
                    </View>}
                    <Item>
                        <Input name="place" placeholder="Place" value={this.placeDisplay()} disabled={this.props.selectedOffers.length > 0} onChangeText={(text) => { this.setState({ placeSearchText: text }); this.getPlaces(text); this.props.onChange("place", {}) }} />
                    </Item>
                </Form>
                {this.state.placeSearchText.length > 0 && <View style={{ marginBottom: REACT_SWIPER_BOTTOM_MARGIN, flex: 1, backgroundColor: 'white' }}>
                    <FlatList
                        data={this.state.placePredictions}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        keyboardShouldPersistTaps={'handled'}
                    />
                </View>}
                {this.state.placeSearchText.length <= 0 && <View style={{ flex: 1, marginBottom: REACT_SWIPER_BOTTOM_MARGIN }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.eventDetailPlaceMap}
                        region={{
                            latitude: this.props.place.placeDetails && this.props.place.placeDetails.latitude ? this.props.place.placeDetails.latitude : (Object.keys(this.state.geometryDetails).length > 0 && this.state.geometryDetails.location) ? this.state.geometryDetails.location.lat : this.props.lat,
                            longitude: this.props.place.placeDetails && this.props.place.placeDetails.longitude ? this.props.place.placeDetails.longitude : (Object.keys(this.state.geometryDetails).length > 0 && this.state.geometryDetails.location) ? this.state.geometryDetails.location.lng : this.props.long,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: this.props.place.placeDetails && this.props.place.placeDetails.latitude ? this.props.place.placeDetails.latitude : (Object.keys(this.state.geometryDetails).length > 0 && this.state.geometryDetails.location) ? this.state.geometryDetails.location.lat : this.props.lat,
                                longitude: this.props.place.placeDetails && this.props.place.placeDetails.longitude ? this.props.place.placeDetails.longitude : (Object.keys(this.state.geometryDetails).length > 0 && this.state.geometryDetails.location) ? this.state.geometryDetails.location.lng : this.props.long,
                            }}
                            title="Your Current Location"
                        />
                    </MapView>
                </View>}
            </View>
        )
    }
}