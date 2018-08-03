import React from 'react';
import { Platform, View, TouchableOpacity, Text } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../../redux/actions/user';
import * as settingsActions from '../../redux/actions/settings';
import SettingsList from 'react-native-settings-list';
import { NavigationActions } from 'react-navigation';
import { styles } from '../../assets/styles';
import Modal from "react-native-modal";

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
    });

    constructor(props) {
        super(props);
        this.state = { 
            distMeasureModalVisible: false 
        };

        this.logout = this.logout.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.token === "") {
            this.resetNavigation('Register');
        }
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

                        <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                        <SettingsList.Item
                            icon={
                                <PlatformIonicon
                                    name='swap'
                                    size={30}
                                    style={{ paddingTop: 10, paddingLeft: 5 }}
                                />
                            }
                            hasSwitch={false}
                            hasNavArrow={true}
                            title='Distance Measure'
                            onPress={() => this.setState({ distMeasureModalVisible: true })}
                        />
                        <Modal
                            isVisible={this.state.distMeasureModalVisible}
                            backdropOpacity={0.5}
                            onBackButtonPress={() => this.setState({ distMeasureModalVisible: false })}
                            onBackdropPress={() => this.setState({ distMeasureModalVisible: false })}>
                            <View style={{
                                borderColor: "rgba(0, 0, 0, 0.1)",
                                backgroundColor: "white",
                            }}>
                                <View style={{
                                    width: 324,
                                    height: 100
                                }}>
                                    <TouchableOpacity onPress={() => this.props.settingsActions.saveDistanceMeasure('mi')}>
                                        <View style={{ height: 50, width: 324, borderBottomWidth: 1, borderBottomColor: '#000', justifyContent: 'flex-start', paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            {this.props.distanceMeasure === 'mi' && <PlatformIonicon
                                                name='checkmark'
                                                size={30}
                                                style={{ paddingRight: 10, paddingLeft: 10 }}
                                            />}
                                            <Text>Miles</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.props.settingsActions.saveDistanceMeasure('km')}>
                                        <View style={{ height: 50, width: 324, justifyContent: 'flex-start', paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            {this.props.distanceMeasure === 'km' && <PlatformIonicon
                                                name='checkmark'
                                                size={30}
                                                style={{ paddingRight: 10, paddingLeft: 10 }}
                                            />}
                                            <Text>Kilometers</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

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
                                name='notifications'
                                size={30}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                            />}
                            title='Blocked Users'
                            onPress={() => this.props.navigation.navigate("BlockedUserSettings", {})}
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

    logout() {
        this.props.userActions.logout(this.props.token);
    }

    resetNavigation(targetRoute) {
        const resetAction = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: targetRoute }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        token: state.tokenReducer.token,
        distanceMeasure: state.settingsReducer.distanceMeasure
    };
}

function mapDispatchToProps(dispatch) {
    return {
        settingsActions: bindActionCreators(settingsActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);