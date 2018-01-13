import React from 'react';
import { StyleSheet, Text, FlatList, ScrollView, View } from 'react-native';
import { TabNavigator, StackNavigator, DrawerItems } from 'react-navigation';
import PlatformIonicon from './utils/platformIonicon';
import Home from './home';
import Topic from './topic';
import NewEvent from './newevent';
import Settings from './settings';
import ProfileSettings from './profile-settings';
import LocationsSettings from './locations-settings';
import PrivacySettings from './privacy-settings';
import RestrictedModeSettings from './restricted-mode-settings';
import HelpSettings from './help-settings';
import LegalSettings from './legal-settings';


const ProfileScreen = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Profile Screen</Text>
    </View>
);

const SuggestedScreen = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Suggested Screen</Text>
    </View>
);

const Homestack = StackNavigator({
    Home: {
        screen: Home,
    },
    Topic: {
        path: '/topic/:topic',
        screen: Topic,
    },
    NewEvent: {
        path: '/newevent',
        screen: NewEvent
    }
});

const SuggestedStack = StackNavigator({
    Suggested: {
        screen: SuggestedScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Suggested',
        })
    }
});

const SettingsStack = StackNavigator({
    Settings: {
        screen: Settings,
        navigationOptions: ({ navigation }) => ({
            title: 'Settings',
        })
    },
    LocationsSettings: {
        screen: LocationsSettings,
        navigationOptions: ({ navigation }) => ({
            title: 'Locations Settings',
        })
    },
    ProfileSettings: {
        screen: ProfileSettings,
        navigationOptions: ({ navigation }) => ({
            title: 'Profile Settings',
        })
    },
    PrivacySettings: {
        screen: PrivacySettings,
        navigationOptions: ({ navigation }) => ({
            title: 'Privacy Settings',
        })
    },
    RestrictedModeSettings: {
        screen: RestrictedModeSettings,
        navigationOptions: ({ navigation }) => ({
            title: 'Restricted Mode Settings',
        })
    },
    HelpSettings: {
        screen: HelpSettings,
        navigationOptions: ({ navigation }) => ({
            title: 'Help Settings',
        })
    },
    LegalSettings: {
        screen: LegalSettings,
        navigationOptions: ({ navigation }) => ({
            title: 'Legal Settings',
        })
    }
});

const ProfileStack = StackNavigator({
    Profile: {
        screen: ProfileScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Profile',
        })
    }
});

const NavContainer = TabNavigator({
    Home: {
        screen: Homestack,
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: ({ tintColor, focused }) => (
                <PlatformIonicon
                    name='home'
                    size={20}
                    style={{ color: tintColor }}
                />
            ),
        },
    },
    Suggested: {
        screen: SuggestedStack,
        navigationOptions: {
            tabBarLabel: 'Suggested',
            tabBarIcon: ({ tintColor, focused }) => (
                <PlatformIonicon
                    name='apps'
                    size={20}
                    style={{ color: tintColor }}
                />
            ),
        },
    },
    Profile: {
        screen: ProfileStack,
        navigationOptions: {
            tabBarLabel: 'Profile',
            tabBarIcon: ({ tintColor, focused }) => (
                <PlatformIonicon
                    name='person'
                    size={20}
                    style={{ color: tintColor }}
                />
            ),
        },
    },
    Settings: {
        screen: SettingsStack,
        navigationOptions: {
            tabBarLabel: 'Settings',
            tabBarIcon: ({ tintColor, focused }) => (
                <PlatformIonicon
                    name='settings'
                    size={20}
                    style={{ color: tintColor }}
                />
            ),
        },
    },
}
);

export default NavContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: -22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});
