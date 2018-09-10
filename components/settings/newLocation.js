import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Text, Button, Form, Label } from 'native-base';
import { PermissionsAndroid, Platform, RefreshControl, StyleSheet, TouchableOpacity, View, FlatList, ListItem } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { styles } from '../../assets/styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import * as locationActions from '../../redux/actions/location';

class NewLocation extends React.Component {
    static navigationOptions = ({
        title: 'Add Pin',
    });

    constructor(props) {
        super(props);

        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        this.state = {
            GPSPermission: false,
            searchText: '',
            coordinates: {
                lat: 28.473802,
                long: -81.465088
            },
            location: {
                name: '',
                lat: null,
                long: null,
                id: null
            },
            placePredictions: [],
            session: text
        }

        this.getPlaces = this.getPlaces.bind(this);
        this.getPlaceDetails = this.getPlaceDetails.bind(this);
        this.checkUserPermissions = this.checkUserPermissions.bind(this);
        this.addUserLocation = this.addUserLocation.bind(this);
    }

    async checkUserPermissions() {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

                if (granted) {
                    this.setState({ GPSPermission: true })
                } else {
                    const grantedNow = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            'title': 'Koota',
                            'message': 'Koota needs access to your GPS location ' +
                                'so you can find awesome things happening around you.'
                        }
                    )
                    if (grantedNow === PermissionsAndroid.RESULTS.GRANTED) {
                        this.setState({ GPSPermission: true })
                    }
                }

            } catch (err) {
                console.warn(err)
            }
        } else if (Platform.OS === 'ios') {
            navigator.geolocation.requestAuthorization();
            this.setState({ GPSPermission: true })
        }
    }

    async componentDidMount() {
        await this.checkUserPermissions();

        if (this.state.GPSPermission) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({ coordinates: { lat: position.coords.latitude, long: position.coords.longitude } })
            },
                (error) => console.error(error.message),
                Platform.OS === 'ios' ? { enableHighAccuracy: true, timeout: 20000 } : { timeout: 50000 },
            );
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
            .then((resultsJSON) => { this.setState({ location: { id: item["place_id"], name: item["structured_formatting"]["main_text"], lat: resultsJSON["result"]["geometry"]["location"]["lat"], long: resultsJSON["result"]["geometry"]["location"]["lng"] }, coordinates: { lat: resultsJSON["result"]["geometry"]["location"]["lat"], long: resultsJSON["result"]["geometry"]["location"]["lng"] } }) })
            .catch((error) => console.log(error.message));

        this.setState({ placePredictions: [], searchText: "" });
    }

    addUserLocation() {
        this.props.locationActions.addUserLocation(this.state.location);
        this.props.navigation.goBack();
    }

    render() {
        console.log(this.state.location)
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input
                            placeholder="Pin where?"
                            value={this.state.searchText}
                            onChangeText={(text) => { this.setState({ searchText: text }); this.getPlaces(text); }}
                            onSubmitEditing={() => { this.props.navigation.navigate('Search', { query: this.state.searchQuery }) }}
                        />
                        {this.state.searchText.length > 0 && <Icon name="ios-close-circle" onPress={() => this.setState({ searchText: '' })} />}
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>
                {this.state.searchText.length <= 0 && <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.eventDetailPlaceMap}
                            region={{
                                latitude: this.state.coordinates.lat,
                                longitude: this.state.coordinates.long,
                                latitudeDelta: 1,
                                longitudeDelta: 1,
                            }}
                        >
                            {this.state.location.lat && this.state.location.long && <Marker
                                coordinate={{
                                    latitude: this.state.location.lat,
                                    longitude: this.state.location.long,
                                }}
                                title={this.state.location.name}
                            />
                            }
                        </MapView>
                    </View>
                    <View style={{ flex: 2 }}>
                        <View style={{ flex: 1 }}>
                            <Form>
                                <Item stackedLabel last>
                                    <Label>Name</Label>
                                    <Input value={this.state.location.name} onChangeText={(text) => this.setState({location: {...this.state.location, name: text}})} />
                                </Item>
                            </Form>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5 }}>
                            <View>
                                <Button
                                    onPress={() => this.props.navigation.goBack()}
                                    color="#841584"
                                    accessibilityLabel="Learn more about this purple button">
                                    <Text>Cancel</Text>
                                </Button>
                            </View>
                            <View>
                                <Button
                                    onPress={() => this.addUserLocation()}
                                    disabled={!this.state.location.lat || !this.state.location.long || !this.state.location.name || !this.state.location.id}
                                    color="#841584"
                                    accessibilityLabel="Learn more about this purple button">
                                    <Text>Add Pin</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>}
                {this.state.searchText.length > 0 && <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <FlatList
                        data={this.state.placePredictions}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        keyboardShouldPersistTaps={'handled'}
                    />
                </View>}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        locations: state.locationReducer.locations,
        selected: state.locationReducer.selected
    };
}

function mapDispatchToProps(dispatch) {
    return {
        locationActions: bindActionCreators(locationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewLocation);