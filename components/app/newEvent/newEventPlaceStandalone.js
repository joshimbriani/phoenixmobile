import React from 'react';
import { Content, Form, Item, Input, Label } from 'native-base';
import { Platform, PermissionsAndroid, Keyboard, Button, View, Text, TouchableOpacity, FlatList } from 'react-native';
import PlatformIonicon from '../../utils/platformIonicon';
import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Dialog from "react-native-dialog";
import debounce from 'lodash/debounce';
import { styles } from '../../../assets/styles';
import Icon from 'react-native-vector-icons/Ionicons';

class NewEventPlaceStandalone extends React.Component {

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'Add Place to Event',
        headerLeft: <Icon
            name='md-arrow-back'
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.goBack()} />

    }) : ({ navigation }) => ({
        title: 'Add Place to Event',
        headerLeft: <Icon
            name='ios-arrow-back'
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.goBack()} />
    });

    constructor(props) {
        super(props);

        this.state = {
            placeSearchText: "",
            placePredictions: [],
            geometryDetails: {},
            place: props.navigation.state.params.place || {},
            showHelp: false
        }

        this.getPlaces = this.getPlaces.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    placeDisplay() {
        if (Object.keys(this.state.place).length > 0 && this.state.place.structured_formatting && this.state.place.structured_formatting.main_text) {
            return this.state.place.structured_formatting.main_text;
        } else if (Object.keys(this.state.place).length > 0 && this.state.place.placeDetails) {
            return this.state.place.name;
        } else {
            return this.state.placeSearchText;
        }
    }

    getPlaces = debounce((text) => {
        var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + text + "&key=AIzaSyDUVAEJq3xQe6nTG4uaj00xcl-EkHp2oXQ&sessiontoken=" + this.props.session;

        if (this.props.lat > -200 && this.props.long > -200) {
            url += "&location=" + this.props.navigation.state.params.lat + "," + this.props.navigation.state.params.long + "&radius=25";
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

        fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + item["place_id"] + '&fields=geometry,formatted_address&key=AIzaSyDUVAEJq3xQe6nTG4uaj00xcl-EkHp2oXQ&sessiontoken=' + this.props.session)
            .then((results) => results.json())
            .then((resultsJSON) => { item["address"] = resultsJSON["result"]["formatted_address"]; this.setState({ geometryDetails: resultsJSON["result"]["geometry"] }) })
            .catch((error) => console.log(error.message));

        Keyboard.dismiss()

        this.setState({ placePredictions: [], placeSearchText: "", place: item });
        this.props.navigation.state.params.onChange("place", item);
    }

    render() {
        return (
            <View style={styles.flex1} >
                <View style={{flex: 1}}>
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
                    <Form style={{ backgroundColor: 'white', borderBottomWidth: 1 }}>
                        <Item>
                            <Input name="place" placeholder="Place" value={this.placeDisplay()} onChangeText={(text) => { this.setState({ placeSearchText: text }); this.getPlaces(text); this.props.navigation.state.params.onChange("place", {}) }} />
                        </Item>
                    </Form>
                    {this.state.placeSearchText.length > 0 && <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <FlatList
                            data={this.state.placePredictions}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            keyboardShouldPersistTaps={'handled'}
                        />
                    </View>}
                    {this.state.placeSearchText.length <= 0 && <View style={{ flex: 1 }}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.eventDetailPlaceMap}
                            region={{
                                latitude: this.state.place.placeDetails && this.state.place.placeDetails.latitude ? this.state.place.placeDetails.latitude : (Object.keys(this.state.geometryDetails).length > 0 && this.state.geometryDetails.location) ? this.state.geometryDetails.location.lat : this.props.navigation.state.params.lat,
                                longitude: this.state.place.placeDetails && this.state.place.placeDetails.longitude ? this.state.place.placeDetails.longitude : (Object.keys(this.state.geometryDetails).length > 0 && this.state.geometryDetails.location) ? this.state.geometryDetails.location.lng : this.props.navigation.state.params.long,
                                latitudeDelta: 0.015,
                                longitudeDelta: 0.0121,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: this.state.place.placeDetails && this.state.place.placeDetails.latitude ? this.state.place.placeDetails.latitude : (Object.keys(this.state.geometryDetails).length > 0 && this.state.geometryDetails.location) ? this.state.geometryDetails.location.lat : this.props.navigation.state.params.lat,
                                    longitude: this.state.place.placeDetails && this.state.place.placeDetails.longitude ? this.state.place.placeDetails.longitude : (Object.keys(this.state.geometryDetails).length > 0 && this.state.geometryDetails.location) ? this.state.geometryDetails.location.lng : this.props.navigation.state.params.long,
                                }}
                                title="Your Current Location"
                            />
                        </MapView>
                    </View>}
                </View>
                <View>
                    <Button
                        onPress={() => this.props.navigation.goBack()}
                        title="Set Place"
                        color="#2196F3"
                        accessibilityLabel="Set Place"
                    />
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
        user: state.userReducer.user
    };
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewEventPlaceStandalone);

