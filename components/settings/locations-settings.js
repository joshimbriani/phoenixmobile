import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { PermissionsAndroid, Platform, RefreshControl, StyleSheet, TouchableOpacity, View, FlatList, ListItem } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { styles } from '../../assets/styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { bindActionCreators } from 'redux';
import * as locationActions from '../../redux/actions/location';

class LocationsSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            coordinates: {
                lat: 28.473802,
                long: -81.465088
            },
            mapView: {
                latitude: 39.8283,
                longitude: -98.5795,
                latitudeDelta: 30,
                longitudeDelta: 30,
            },
            GPSPermission: false
        }

        this.checkUserPermissions = this.checkUserPermissions.bind(this);
        this.selectLocation = this.selectLocation.bind(this);
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
        }
    }

    selectLocation(item) {
        this.setState({
            mapView: {
                latitude: item.id === -1 ? this.state.coordinates.lat : item.lat,
                longitude: item.id === -1 ? this.state.coordinates.long : item.long,
                latitudeDelta: .1,
                longitudeDelta: .1,
            },
        });

        this.props.locationActions.setSelectedLocation(item.id);
    }

    render() {
        console.log(this.props.locations)
        return (
            <Container>
                <View style={{ flex: 1 }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.eventDetailPlaceMap}
                        region={this.state.mapView}
                    >
                        {this.props.locations.map((location) => {
                            if (location.id === -1) {
                                return (
                                    <Marker
                                        coordinate={{
                                            latitude: this.state.coordinates.lat,
                                            longitude: this.state.coordinates.long,
                                        }}
                                        pinColor={"blue"}
                                        title={"Current Location"}
                                    />
                                )
                            } else {
                                console.log(location)
                                return (
                                    <Marker
                                        coordinate={{
                                            latitude: location.lat,
                                            longitude: location.long,
                                        }}
                                        title={location.name}
                                    />
                                )
                            }
                        })}
                    </MapView>
                </View>
                <View style={{ flex: 2 }}>
                    <FlatList
                        data={this.props.locations}
                        contentContainerStyle={{ paddingTop: 0 }}
                        keyExtractor={(item, index) => index}
                        style={styles.listView}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ height: 75, alignItems: 'center', flexDirection: 'row', backgroundColor: index % 2 === 0 ? '#f0f0f0' : 'white' }}>
                                    <TouchableOpacity
                                        style={{ flex: 1 }}
                                        onPress={() => this.selectLocation(item)}>
                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 10, flexDirection: 'row' }}>
                                            {this.props.selected === item.id && <View style={{ marginRight: 10, marginLeft: 20 }}>
                                                <PlatformIonicon
                                                    name={"home"}
                                                    size={25} //this doesn't adjust the size...?
                                                    style={{ color: "green", margin: 5 }}
                                                />
                                            </View>}
                                            <Text style={{ width: '100%' }} numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    {item.id !== -1 && <TouchableOpacity onPress={() => this.props.locationActions.removeUserLocation(item.id)}>
                                        <View style={{ marginRight: 10 }}>
                                            <PlatformIonicon
                                                name={"trash"}
                                                size={25} //this doesn't adjust the size...?
                                                style={{ color: "black", margin: 5 }}
                                            />
                                        </View>
                                    </TouchableOpacity>}
                                </View>
                            )
                        }}
                    />
                </View>
                <Fab
                    //active={this.state.active}
                    containerStyle={{}}
                    style={{ backgroundColor: '#e84118' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('NewLocation')}>
                    <PlatformIonicon
                        name={"add"}
                        size={50} //this doesn't adjust the size...? -- not in a Fab
                        style={{ color: "white" }}
                    />
                </Fab>
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
)(LocationsSettings);