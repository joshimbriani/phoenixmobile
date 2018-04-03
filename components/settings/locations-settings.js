import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, RefreshControl, StyleSheet, TouchableHighlight, View, FlatList, ListItem } from 'react-native';
import GridView from 'react-native-super-grid';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor';
import * as userActions from '../../redux/actions/user';
import randomMC from 'random-material-color';
import SettingsList from 'react-native-settings-list';
import { Dropdown } from 'react-native-material-dropdown';
import { NavigationActions } from 'react-navigation';

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
//why aren't my setters working?????
// make class for locationPoints, allow user to create new ones, & to edit existing ones, use same drop-down for radius???


//Format to look like settings list, with the 4 parameters; allow users to edit, add, and delete pins; integerate search function


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

const stylesAlso = StyleSheet.create({
  titleStyle: {
    backgroundColor: 'white',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 10,
  },
  bodyStyle: {
    backgroundColor: 'white',
    color: 'grey',
    fontSize: 15,
    paddingLeft: 30,
  },
});

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
                                <Text style = {stylesAlso.titleStyle}>
                                    {item._title}
                                </Text>
                                <Text style = {stylesAlso.bodyStyle}>
                                    Radius: {item._radius}
                                </Text>
                                <Text style = {stylesAlso.bodyStyle}>
                                    Latitude: {item._latitude}
                                </Text>
                                <Text style = {stylesAlso.bodyStyle}>
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
                    onPress={() => this.props.navigation.navigate('LocationsSettings')}>
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

const styles = StyleSheet.create({
    listitem: {
    },
    itemText: {
    },
    settingsGroup: {

    }
});