import React from 'react';
import { Platform, View, TouchableOpacity, Text } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../../redux/actions/user';
import * as settingsActions from '../../redux/actions/settings';
import SettingsList from 'react-native-settings-list';
import { StackActions, NavigationActions } from 'react-navigation';
import { styles } from '../../assets/styles';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';
import { getURLForPlatform } from '../utils/networkUtils';

class Settings extends React.Component {

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'Settings',
        headerLeft: <Icon
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.openDrawer()}
            name="md-menu"
        />
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
            this.resetNavigation('FrontScreen');
        }
    }

    render() {

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

                        {/*<SettingsList.Header headerStyle={{ marginTop: 15 }} />
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
                        />*/}


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
        fetch(getURLForPlatform() + "api/v1/user/" + this.props.user + "/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
            body: JSON.stringify({
                'FCMToken': ''
            }),
            method: 'PUT'
        }).then(response => response.json())
            .then(responseObj => {
                if (!responseObj["update"]) {
                    console.log("Bad Update")
                } else {
                    this.props.userActions.logout(this.props.token);
                }
            })
        
    }

    resetNavigation(targetRoute) {
        const resetAction = StackActions.reset({
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