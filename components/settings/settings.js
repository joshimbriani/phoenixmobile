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
import { styles } from '../../assets/styles';

let distUnit = 'km';

class Settings extends React.Component {

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
    });

    constructor() {
        super();
        this.onValueChange = this.onValueChange.bind(this);
        this.onValueChange2 = this.onValueChange2.bind(this);
        this.onValueChange3 = this.onValueChange3.bind(this);
        this.logout = this.logout.bind(this);
        this.state = { switchValue: false, switchValue2: false, switchValue3: false };
    }

    render() {
        if (this.state.switchValue3 == false) {
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
        ];

        return (
            <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                    <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                        <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                        <SettingsList.Item
                            hasSwitch={false}
                            hasNavArrow={false}
                            title='Logout'
                            onPress={() => this.logout()}
                        />
                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='notifications'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            title='Notifications'
                            onPress={() => this.props.navigation.navigate("NotificationSettings", {})}
                        />
                        <SettingsList.Item
                            icon={
                                <PlatformIonicon
                                    name='sunny'
                                    size={30}
                                    style={{ paddingTop: 10, paddingLeft: 5 }}
                                />
                            }
                            hasSwitch={true}
                            switchState={this.state.switchValue2}
                            switchOnValueChange={this.onValueChange2}
                            hasNavArrow={false}
                            title='Night Mode'
                        />
                        <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                        <SettingsList.Item
                            icon={
                                <PlatformIonicon
                                    name='swap'
                                    size={30}
                                    style={{ paddingTop: 10, paddingLeft: 5 }}
                                />
                            }
                            hasSwitch={true}
                            switchState={this.state.switchValue3}
                            switchOnValueChange={this.onValueChange3}
                            hasNavArrow={false}
                            title='Standard / Metric'
                        />
                        <SettingsList.Item
                            icon={
                                <PlatformIonicon
                                    name='locate'
                                    size={30}
                                    style={{ paddingTop: 10, paddingLeft: 5 }}
                                />
                            }
                            hasNavArrow={false}
                            title='Radius'

                            arrowIcon={
                                <Dropdown
                                    label='Distance'
                                    value='yup'
                                    //width={10000}
                                    //itemTextSize={100}
                                    fontSize={15} //this changes to default size after the dropdown has been used
                                    marginLeft={100}
                                    data={data}
                                />
                            }
                            titleInfoStyle={styles.titleInfoStyle}
                        />

                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='pin'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            title='Locations'
                            onPress={() => this.props.navigation.navigate("LocationsSettings", {})}
                        />
                        <SettingsList.Header headerStyle={{ marginTop: 15 }} />

                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='lock'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            title='Privacy'
                            onPress={() => this.props.navigation.navigate("PrivacySettings", {})}
                        />
                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='hand'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            title='Restrictions & Alerts'
                            onPress={() => this.props.navigation.navigate("RestrictedModeSettings", {})}
                        />
                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='help-circle'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            title='Help'
                            onPress={() => this.props.navigation.navigate("HelpSettings", {})}
                        />
                        
                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='folder'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            title='Legal'
                            onPress={() => this.props.navigation.navigate("LegalSettings", {})}
                        />
                        <SettingsList.Item
                            icon={<PlatformIonicon
                                name='text'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            title='About Koota'
                            onPress={() => this.props.navigation.navigate("AboutKootaSettings", {})}
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

    logout() {
        this.props.userActions.logout(this.props.token);
    }
}

function mapStateToProps(state) {
    return {
        color: state.backgroundColorReducer.color,
        user: state.userReducer.user,
        token: state.tokenReducer.token,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        colorActions: bindActionCreators(colorActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);