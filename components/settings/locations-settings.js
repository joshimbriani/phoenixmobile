import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, RefreshControl, StyleSheet, TouchableHighlight, View } from 'react-native';
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
    constructor(title, latitude, longitude, radius){
        if(typeof title === 'string'){
            this._title = title;
        }
        else{
            this._title = "Name this pin!"
        };
        this._latitude = latitude;
        this._longitude = longitude;
        this._radius = radius;
    };
    /*set title(aTitle) {
        if(typeof aTitle === 'string'){
            this._title = aTitle
        }
    }
    set latitude(latitude) {
        if(typeof latitude === 'number'){
            this._latitude = latitude;
        }
    }
    set longitude(longitude) {
        if(typeof longitude === 'number'){
            this._longitude = longitude;
        }
    }
    set radius(radius) {
        if(typeof radius === 'number'){
            this._radius = radius;
        }
    };*/

};
//why aren't my setters working?????
// make class for locationPoints, allow user to create new ones, & to edit existing ones, use same drop-down for radius???

const firstLocation = new locationPoint('Norman', 35.2226, 97.4395, 50);


class LocationsSettings extends React.Component {
    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Where do you want a pin?" /*onChangeText={(text) => this.changeValue(text)} onSubmitEditing={() => { this.props.navigation.navigate('Search', { query: this.state.searchQuery }) }}*/ />
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>

                <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                <SettingsList.Header headerStyle={{ marginTop: 15 }} />


                <SettingsList.Item
                    icon={<PlatformIonicon
                        name='pin'
                        size={30}
                        style={{ paddingTop: 10, paddingLeft: 5 }}
                    />}
                    title= {'Title: ' + firstLocation._title}
                />
                <SettingsList.Item
                    icon={<PlatformIonicon
                        name='locate'
                        size={30}
                        style={{ paddingTop: 10, paddingLeft: 5 }}
                    />}
                    title= {'Latitude: ' + firstLocation._latitude}
                />
                <SettingsList.Item
                    icon={<PlatformIonicon
                        name='locate'
                        size={30}
                        style={{ paddingTop: 10, paddingLeft: 5 }}
                    />}
                    title= {'Longitude: ' + firstLocation._longitude}
                />
                <SettingsList.Item
                    icon={<PlatformIonicon
                        name='locate'
                        size={30}
                        style={{ paddingTop: 10, paddingLeft: 5 }}
                    />}
                    title= {'Radius: ' + firstLocation._radius}
                />
                <SettingsList.Header headerStyle={{ marginTop: 15 }} />


                </SettingsList>

            <Fab
                //active={this.state.active}
                containerStyle={{}}
                style={{ backgroundColor: '#e84118' }}
                position="bottomRight"
                onPress={() => this.props.navigation.navigate('LocationsSettings')}>
                <PlatformIonicon
                    name={"add"}
                    size={50} //this doesn't adjust the size...?
                    style={{ color: "white" }}
                />
            </Fab>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        color: state.backgroundColorReducer.color
    };
}

function mapDispatchToProps(dispatch) {
    return {
        colorActions: bindActionCreators(colorActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LocationsSettings);

const styles = StyleSheet.create({
    listitem: {
        alignSelf: 'stretch',
        height: 200,
    },
    itemText: {
        color: 'white',
        fontSize: 40,
        paddingTop: 5,
        textAlign: 'center',
        fontFamily: 'Roboto_medium'
    }

});