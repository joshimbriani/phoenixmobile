import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, RefreshControl, StyleSheet, TouchableHighlight, View, FlatList, ListItem } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { styles } from '../../assets/styles'

class locationPoint {
    constructor(title, latitude, longitude, radius) {
        if (typeof title === 'string') {
            this._title = title;
        }
        else {
            this._title = "Name this pin!"
        };
        this._title = title;
        this._latitude = latitude;
        this._longitude = longitude;
        this._radius = radius;
    };
    set title(aTitle) {
        if (typeof aTitle === 'string') {
            this._title = aTitle
        }
        else{
            this._title = "Name this pin!"
        }
    }
    set latitude(latitude) {
        if (typeof latitude === 'number') {
            this._latitude = latitude;
        }
    }
    set longitude(longitude) {
        if (typeof longitude === 'number') {
            this._longitude = longitude;
        }
    }
    set radius(radius) {
        if (typeof radius === 'number') {
            this._radius = radius;
        }
    };

};

const firstLocation = new locationPoint('Norman', 35.2226, 97.4395, 50);
const secondLocation = new locationPoint();
secondLocation.title = "Orlando";
secondLocation.latitude = 12;
secondLocation.longitude = 12;
secondLocation.radius = 12;

const thirdLocation = new locationPoint();
thirdLocation.title = "Dubai";
thirdLocation.latitude = 0;
thirdLocation.longitude = 100;
thirdLocation.radius = 1000;

const locationList = [firstLocation, secondLocation, thirdLocation];

class LocationsSettings extends React.Component {
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

                <FlatList
                    data={locationList}
                    contentContainerStyle={{ paddingTop: 0 }}
                    keyExtractor={(item, index) => index}
                    style={styles.listView}
                    renderItem={({ item, index }) => {
                        return(
                            <View>
                                <Text style = {styles.titleStyle}>
                                    {item._title}
                                </Text>
                                <Text style = {styles.bodyStyle}>
                                    Radius: {item._radius}
                                </Text>
                                <Text style = {styles.bodyStyle}>
                                    Latitude: {item._latitude}
                                </Text>
                                <Text style = {styles.bodyStyle}>
                                    Longitude: {item._longitude}
                                </Text>
                                <Text>
                                </Text>
                            </View>
                            )
                    }}
                />

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