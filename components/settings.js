// this is home with "settings" instead of "home" & the settings list from evetstech pasted in under "class..."

import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, StyleSheet, TouchableHighlight, View } from 'react-native';
import GridView from 'react-native-super-grid';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../redux/actions/backgroundColor';
import randomMC from 'random-material-color';
import SettingsList from 'react-native-settings-list';

class Settings extends React.Component {
    constructor() {
        super();
        this.onValueChange = this.onValueChange.bind(this);
        this.state = { switchValue: false };
    }
    render() {
        var bgColor = '#DCE3F4';
        return (
            <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                    <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                        <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                        <SettingsList.Item
                            icon={
                                <Ionicons
                                    name='md-settings'
                                    size={20}
                                    style={{}}
                                />
                            }
                            hasSwitch={true}
                            switchState={this.state.switchValue}
                            switchOnValueChange={this.onValueChange}
                            hasNavArrow={false}
                            title='Airplane Mode'
                        />
                        <SettingsList.Item
                            icon={
                                <Ionicons
                                    name='md-settings'
                                    size={20}
                                    style={{}}
                                />
                            }
                            title='Wi-Fi'
                            titleInfo='Bill Wi The Science Fi'
                            titleInfoStyle={styles.titleInfoStyle}
                            onPress={() => Alert.alert('Route to Wifi Page')}
                        />
                        <SettingsList.Item
                            icon={<Ionicons
                                name='md-settings'
                                size={20}
                                style={{}}
                            />
                            }
                            title='Blutooth'
                            titleInfo='Off'
                            titleInfoStyle={styles.titleInfoStyle}
                            onPress={() => Alert.alert('Route to Blutooth Page')}
                        />
                        <SettingsList.Item
                            icon={<Ionicons
                                name='md-settings'
                                size={20}
                                style={{}}
                            />}
                            title='Cellular'
                            onPress={() => Alert.alert('Route To Cellular Page')}
                        />
                        <SettingsList.Item
                            icon={<Ionicons
                                name='md-settings'
                                size={20}
                                style={{}}
                            />}
                            title='Personal Hotspot'
                            titleInfo='Off'
                            titleInfoStyle={styles.titleInfoStyle}
                            onPress={() => Alert.alert('Route To Hotspot Page')}
                        />
                        <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                        <SettingsList.Item
                            icon={<Ionicons
                                name='md-settings'
                                size={20}
                                style={{}}
                            />}
                            title='Notifications'
                            onPress={() => Alert.alert('Route To Notifications Page')}
                        />
                        <SettingsList.Item
                            icon={<Ionicons
                                name='md-settings'
                                size={20}
                                style={{}}
                            />}
                            title='Control Center'
                            onPress={() => Alert.alert('Route To Control Center Page')}
                        />
                        <SettingsList.Item
                            icon={<Ionicons
                                name='md-settings'
                                size={20}
                                style={{}}
                            />}
                            title='Do Not Disturb'
                            onPress={() => Alert.alert('Route To Do Not Disturb Page')}
                        />
                        <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                        <SettingsList.Item
                            icon={<Ionicons
                                name='md-settings'
                                size={20}
                                style={{}}
                            />}
                            title='General'
                            onPress={() => Alert.alert('Route To General Page')}
                        />
                        <SettingsList.Item
                            icon={<Ionicons
                                name='md-settings'
                                size={20}
                                style={{}}
                            />}
                            title='Display & Brightness'
                            onPress={() => Alert.alert('Route To Display Page')}
                        />
                    </SettingsList>
                </View>
            </View>
        );
    }
    onValueChange(value) {
        this.setState({ switchValue: value });
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
)(Settings);

const styles = StyleSheet.create({
    gridView: {
        flex: 1,
    },
    itemBox: {
        height: 150,
        backgroundColor: '#1abc9c',
        borderRadius: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        color: 'white',
    }

});