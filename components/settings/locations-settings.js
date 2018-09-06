import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { PermissionsAndroid, Platform, RefreshControl, StyleSheet, TouchableHighlight, View, FlatList, ListItem } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { styles } from '../../assets/styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

class LocationsSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            coordinates: {
                lat: 28.473802,
                long: -81.465088
            },
            GPSPermission: false
        }

        this.checkUserPermissions = this.checkUserPermissions.bind(this);
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

    render() {
        /*if (settings.state.switchValue3 == false) {
            distUnit = 'mi';
        }
        else {
            distUnit = 'km';
        };

        let data = [{
            value: '10', label: '10 ' + distUnit
        },
        {
            value: '25', label: '25 ' + distUnit
        },
        {
            value: '50', label: '50 ' + distUnit
        }
        ];*/
        console.log(this.props.locations)
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Pin where?"
                        /*onChangeText={(text) => this.changeValue(text)} onSubmitEditing={() => { this.props.navigation.navigate('Search', { query: this.state.searchQuery }) }}*/ />
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>
                <View style={{ flex: 1 }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.eventDetailPlaceMap}
                        region={{
                            latitude: 39.8283,
                            longitude: -98.5795,
                            latitudeDelta: 30,
                            longitudeDelta: 30,
                        }}
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
                        renderItem={(location, index) => {
                            if (location.id !== -1) {
                                return (
                                    <View>
                                        <Text style={styles.titleStyle}>
                                            {location.name}
                                        </Text>
                                    </View>
                                )
                            } else {
                                return null;
                            }
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

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LocationsSettings);