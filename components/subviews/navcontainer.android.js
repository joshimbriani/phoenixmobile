import React from 'react';
import { StyleSheet, Text, FlatList, ScrollView, View } from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import SideDrawer from './sidedrawer';
import PlatformIonicon from '../utils/platformIonicon';
import { HomeStack, ProfileStack, SettingsStack, MyEventsStack } from './navcontainerCommon';
import Login from '../auth/login';
import Register from '../auth/register';

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
    MyEvents: {
        screen: MyEventsStack,
        navigationOptions: {
            drawerLabel: 'My Events',
            drawerIcon: ({ tintColor, focused }) => (
                <PlatformIonicon
                    name='calendar'
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
                    name='person-add'
                    size={20}
                    style={{ color: tintColor }}
                />
            ),
        }
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
