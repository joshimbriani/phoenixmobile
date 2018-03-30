import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, StyleSheet, TouchableHighlight, View } from 'react-native';
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

class RestrictedModeSettings extends React.Component {

/*                      // this keeps the title text level. What's the right way to do this?
    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'Settings',
        headerLeft: <PlatformIonicon
            name="menu"
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.navigate('DrawerOpen')} />
    }) : ({ navigation }) => ({
        title: 'Settings',
        headerStyle: { paddingTop: -22, }
    });*/

    constructor() {
        super();
        this.onValueChange = this.onValueChange.bind(this);
        this.onValueChange2 = this.onValueChange2.bind(this);
        this.onValueChange3 = this.onValueChange3.bind(this);
        this.onValueChange4 = this.onValueChange4.bind(this);
        this.onValueChange5 = this.onValueChange5.bind(this);
        this.onValueChange6 = this.onValueChange6.bind(this);
        this.state = { switchValue: false, switchValue2: false, switchValue3: false, switchValue4: false, switchValue5: false, switchValue6: false };
    }

    render() {
        return (
            <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                    <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                        <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='alert'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            hasSwitch={true}
                            switchState={this.state.switchValue}
                            switchOnValueChange={this.onValueChange}
                            hasNavArrow={false}
                            title='Show Warnings Tags'
                        />
                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='pin'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            hasSwitch={true}
                            switchState={this.state.switchValue2}
                            switchOnValueChange={this.onValueChange2}
                            hasNavArrow={false}
                            title='Restrict High Crime Locations'
                        />
                        <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='quote'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            hasSwitch={true}
                            switchState={this.state.switchValue3}
                            switchOnValueChange={this.onValueChange3}
                            hasNavArrow={false}
                            title='Restrict Language'
                        />
                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='hand'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            hasSwitch={true}
                            switchState={this.state.switchValue4}
                            switchOnValueChange={this.onValueChange4}
                            hasNavArrow={false}
                            title='Restrict Violent Content'
                        />
                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='pint'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            hasSwitch={true}
                            switchState={this.state.switchValue5}
                            switchOnValueChange={this.onValueChange5}
                            hasNavArrow={false}
                            title='Restrict Adult Beverages & Substances'
                        />
                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='outlet'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            hasSwitch={true}
                            switchState={this.state.switchValue6}
                            switchOnValueChange={this.onValueChange6}
                            hasNavArrow={false}
                            title='Restrict Adult Content'
                        />
                    </SettingsList>
                </View>
            </View>
        );
    }
    onValueChange(value) {
        this.setState({ switchValue: value });
    }
    onValueChange2(value) {
        this.setState({ switchValue2: value });
    }
    onValueChange3(value) {
        this.setState({ switchValue3: value });
    }
    onValueChange4(value) {
        this.setState({ switchValue4: value });
    }
    onValueChange5(value) {
        this.setState({ switchValue5: value });
    }
    onValueChange6(value) {
        this.setState({ switchValue6: value });
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
)(RestrictedModeSettings);

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