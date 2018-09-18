import React from 'react';
import { Alert, Platform, StyleSheet, TouchableHighlight, View } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import SettingsList from 'react-native-settings-list';
import * as settingsActions from '../../redux/actions/settings';
import { getURLForPlatform } from '../utils/networkUtils';
import { bindActionCreators } from 'redux';


class NotificationSettings extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Notification Settings',
    })

    constructor(props) {
        super(props);

        this.state = {
            notificationUserActions: true, 
            notificationRecommendedEvents: true, 
            notificationRecommendedEventsFrequency: true,
            notificationMessages: true,
            notificationInterestedEvents: true,
            notificationGoingEvents: true,
            notificationInvitedEvents: false
        };

        this.syncNotificationSettingsChanges = this.syncNotificationSettingsChanges.bind(this);
    }

    componentDidMount() {
        this.setState({
            notificationUserActions: this.props.notificationSettings.notificationUserActions,
            notificationRecommendedEvents: this.props.notificationSettings.notificationRecommendedEvents,
            notificationRecommendedEventsFrequency: this.props.notificationSettings.notificationRecommendedEventsFrequency,
            notificationMessages: this.props.notificationSettings.notificationMessages,
            notificationInterestedEvents: this.props.notificationSettings.notificationInterestedEvents,
            notificationGoingEvents: this.props.notificationSettings.notificationGoingEvents,
            notificationInvitedEvents: this.props.notificationSettings.notificationInvitedEvents
        })
    }

    render() {

        return (
            <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                    <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                        <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                        <SettingsList.Item
                            icon={
                                <PlatformIonicon
                                    name='notifications'
                                    size={30}
                                    style={{ paddingTop: 10, paddingLeft: 5 }}
                                />
                            }
                            hasSwitch={true}
                            switchState={this.state.notificationUserActions}
                            switchOnValueChange={(value) => this.syncNotificationSettingsChanges("notificationUserActions", value )}
                            hasNavArrow={false}
                            title='Notifications for Actions on your Events'
                        />
                        <SettingsList.Item
                            icon={
                                <PlatformIonicon
                                    name='notifications'
                                    size={30}
                                    style={{ paddingTop: 10, paddingLeft: 5 }}
                                />
                            }
                            hasSwitch={true}
                            switchState={this.state.notificationMessages}
                            switchOnValueChange={(value) => this.syncNotificationSettingsChanges("notificationMessages", value )}
                            hasNavArrow={false}
                            title='Notifications for Messages'
                        />
                        <SettingsList.Item
                            icon={
                                <PlatformIonicon
                                    name='notifications'
                                    size={30}
                                    style={{ paddingTop: 10, paddingLeft: 5 }}
                                />
                            }
                            hasSwitch={true}
                            switchState={this.state.notificationRecommendedEvents}
                            switchOnValueChange={(value) => this.syncNotificationSettingsChanges("notificationRecommendedEvents", value )}
                            hasNavArrow={false}
                            title='Notifications for Suggested Events'
                        />
                        <SettingsList.Item
                            icon={
                                <PlatformIonicon
                                    name='notifications'
                                    size={30}
                                    style={{ paddingTop: 10, paddingLeft: 5 }}
                                />
                            }
                            hasSwitch={true}
                            switchState={this.state.notificationInterestedEvents}
                            switchOnValueChange={(value) => this.syncNotificationSettingsChanges("notificationInterestedEvents", value )}
                            hasNavArrow={false}
                            title="Notifications for Events you're Interested in"
                        />
                        <SettingsList.Item
                            icon={
                                <PlatformIonicon
                                    name='notifications'
                                    size={30}
                                    style={{ paddingTop: 10, paddingLeft: 5 }}
                                />
                            }
                            hasSwitch={true}
                            switchState={this.state.notificationGoingEvents}
                            switchOnValueChange={(value) => this.syncNotificationSettingsChanges("notificationGoingEvents", value )}
                            hasNavArrow={false}
                            title="Notifications for Events you're Going to"
                        />
                        <SettingsList.Item
                            icon={
                                <PlatformIonicon
                                    name='notifications'
                                    size={30}
                                    style={{ paddingTop: 10, paddingLeft: 5 }}
                                />
                            }
                            hasSwitch={true}
                            switchState={this.state.notificationInvitedEvents}
                            switchOnValueChange={(value) => this.syncNotificationSettingsChanges("notificationInvitedEvents", value )}
                            hasNavArrow={false}
                            title="Notifications for Events you're invited to"
                        />
                    </SettingsList>
                </View>
            </View>
        );
    }

    syncNotificationSettingsChanges(field, value) {

        var notificationSettings = {
            notificationUserActions: this.state.notificationUserActions,
            notificationRecommendedEvents: this.state.notificationRecommendedEvents,
            notificationRecommendedEventsFrequency: this.state.notificationRecommendedEventsFrequency,
            notificationMessages: this.state.notificationMessages,
            notificationInterestedEvents: this.state.notificationInterestedEvents,
            notificationGoingEvents: this.state.notificationGoingEvents,
            notificationInvitedEvents: this.state.notificationInvitedEvents
        }

        notificationSettings[field] = value;
        body = {};
        body[field] = value;

        fetch(getURLForPlatform() + "api/v1/user/" + this.props.user + "/settings/", {
            method: 'PUT',
            headers: {
                Authorization: "Token " + this.props.token
            },
            body: JSON.stringify(body)
        }).then(response => {
            if (response.status < 400) {
                this.props.settingsActions.saveNotificationSettings(notificationSettings);

                if (field === "notificationInvitedEvents") {
                    this.setState({ "notificationInvitedEvents": value });
                }
                if (field === "notificationUserActions") {
                    this.setState({ "notificationUserActions": value });
                }
                if (field === "notificationRecommendedEvents") {
                    this.setState({ "notificationRecommendedEvents": value });
                }
                if (field === "notificationRecommendedEventsFrequency") {
                    this.setState({ "notificationRecommendedEventsFrequency": value });
                }
                if (field === "notificationMessages") {
                    this.setState({ "notificationMessages": value });
                }
                if (field === "notificationInterestedEvents") {
                    this.setState({ "notificationInterestedEvents": value });
                }
                if (field === "notificationGoingEvents") {
                    this.setState({ "notificationGoingEvents": value });
                }
            }
        })
    }
}


function mapStateToProps(state) {
    return {
        notificationSettings: state.settingsReducer.notifications,
        user: state.userReducer.user,
        token: state.tokenReducer.token
    };
}

function mapDispatchToProps(dispatch) {
    return {
        settingsActions: bindActionCreators(settingsActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationSettings);
