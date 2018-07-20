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

class NotificationSettings extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Location Settings',
    })

    constructor(props) {
        super(props);
        
        this.state = { 
            suggestedEvents: true, 
            messages: true, 
            yourEvents: false 
        };
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
                            switchState={this.state.suggestedEvents}
                            switchOnValueChange={(value) => this.setState({suggestedEvents: value})}
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
                            switchState={this.state.messages}
                            switchOnValueChange={(value) => this.setState({messages: value})}
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
                            switchState={this.state.yourEvents}
                            switchOnValueChange={(value) => this.setState({yourEvents: value})}
                            hasNavArrow={false}
                            title='Notifications on your Events'
                        />
                    </SettingsList>
                </View>
            </View>
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
)(NotificationSettings);
