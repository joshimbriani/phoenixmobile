import React from 'react';
import { StyleSheet, Text, FlatList, ScrollView, View } from 'react-native';
import { DrawerNavigator, StackNavigator, DrawerItems } from 'react-navigation';
import SideDrawer from './sidedrawer';
import PlatformIonicon from '../utils/platformIonicon';
import Home from '../app/home';
import Topic from '../app/topic';
import Settings from '../settings/settings';
import NewEvent from '../app/newevent';
import Search from '../app/search';
import EventDetail from '../app/eventdetail';
import Filter from './filter';
import LocationsSettings from '../settings/locations-settings';
import ProfileSettings from '../settings/profile-settings';
import IDK from '../app/idk';
import Login from '../auth/login';
import Register from '../auth/register';
import Suggested from '../app/suggested';

const HomeStack = StackNavigator({
    Home: {
        screen: Home,
    },
    Topic: {
        path: '/topic/:topic',
        screen: Topic,
    },
    Search: {
        path: '/search?query=:query',
        screen: Search,
    },
    NewEvent: {
        path: '/newevent',
        screen: NewEvent,
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

const SettingsStack = StackNavigator({
    Settings: {
        screen: Settings,
        navigationOptions: ({ navigation }) => ({
            title: 'Settings',
            headerLeft: <PlatformIonicon
                name="menu"
                style={{paddingLeft: 10}}
                size={35}
                onPress={() => navigation.navigate('DrawerOpen')} />
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
    }

});

const SuggestedStack = StackNavigator({
    Suggested: {
        screen: Suggested,
        navigationOptions: ({ navigation }) => ({
            title: 'Suggested',
            headerLeft: <PlatformIonicon
                name="menu"
                style={{paddingLeft: 10}}
                size={35}
                onPress={() => navigation.navigate('DrawerOpen')} />
        })
    },
    SuggestedEventDetail: {
        path: '/event/:event',
        screen: EventDetail,
    },
});

const MainNavContainer = DrawerNavigator({
    
    Home: {
        screen: HomeStack,
        navigationOptions: {
            drawerLabel: 'Home',
            drawerIcon: ({ tintColor, focused }) => (
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
            drawerLabel: 'Suggested',
            drawerIcon: ({ tintColor, focused }) => (
                <PlatformIonicon
                    name='apps'
                    size={20}
                    style={{ color: tintColor }}
                />
            ),
        },
    },
    Settings: {
        screen: SettingsStack,
        navigationOptions: {
            drawerLabel: 'Settings',
            drawerIcon: ({ tintColor, focused }) => (
                <PlatformIonicon
                    name='settings'
                    size={20}
                    style={{ color: tintColor }}
                />
            ),
        },
    },
},
    {
        contentComponent: SideDrawer
    }
);

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
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});
