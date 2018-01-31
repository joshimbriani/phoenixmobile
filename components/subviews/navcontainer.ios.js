import React from 'react';
import { StyleSheet, Text, FlatList, ScrollView, View } from 'react-native';
import { TabNavigator, StackNavigator, DrawerItems } from 'react-navigation';
import PlatformIonicon from '../utils/platformIonicon';
import Home from '../app/home';
import Topic from '../app/topic';
import NewEvent from '../app/newevent';
import Settings from '../settings/settings';
import ProfileSettings from '../settings/profile-settings';
import LocationsSettings from '../settings/locations-settings';
import PrivacySettings from '../settings/privacy-settings';
import RestrictedModeSettings from '../settings/restricted-mode-settings';
import HelpSettings from '../settings/help-settings';
import LegalSettings from '../settings/legal-settings';
import Search from '../app/search';
import EventDetail from '../app/eventdetail';
import Filter from './filter';
import IDK from '../app/idk';
import Login from '../auth/login';
import Register from '../auth/register';

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

const HomeStack = StackNavigator({
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
    },
    Search: {
        path: '/search?query=:query',
        screen: Search,
    },
    EventDetail: {
        path: '/event/:event',
        screen: EventDetail,
    },
    Filter: {
        path: '/filter',
        screen: Filter,
    },
    IDK: {
        path: '/idk',
        screen: IDK,
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

const MainNavContainer = TabNavigator({
    Home: {
        screen: HomeStack,
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
});

const LoginWrapper = StackNavigator({
    Register: {
        screen: Register,
        navigationOptions: ({ navigation }) => ({
            title: 'Register',
            header: null
        })
    },
    Login: {
        screen: Login,
        navigationOptions: ({ navigation }) => ({
            title: 'Login',
            header: null
        })
    },
    Main: {
        screen: MainNavContainer
    }
}, {
        headerMode: 'none'
    });

export default LoginWrapper;

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
