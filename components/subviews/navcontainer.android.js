import React from 'react';
import { StyleSheet, Text, FlatList, ScrollView, View } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import SideDrawer from './sidedrawer';
import PlatformIonicon from '../utils/platformIonicon';
import { HomeStack, ProfileStack, SettingsStack, GroupStack } from './navcontainerCommon';
import Login from '../auth/login';
import Register from '../auth/register';
import RegisterDetails from '../auth/registerDetails';
import Main from '../auth/main';
import { styles } from '../../assets/styles';

const MainNavContainer = createDrawerNavigator({
    
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
    Groups: {
        screen: GroupStack,
        navigationOptions: {
            drawerLabel: 'Groups',
            drawerIcon: ({ tintColor, focused }) => (
                <PlatformIonicon
                    name='people'
                    size={20}
                    style={{ color: tintColor }}
                />
            ),
        },
    },
    Profile: {
        screen: ProfileStack,
        navigationOptions: {
            drawerLabel: 'My Koota',
            drawerIcon: ({ tintColor, focused }) => (
                <PlatformIonicon
                    name='person'
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
        contentComponent: SideDrawer,
        animationEnabled: false,
        swipeEnabled: false,
    }
);

const LoginWrapper = createStackNavigator({
    FrontScreen: {
        screen: Main,
    },
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
    RegisterDetails: {
        screen: RegisterDetails
    },
    Main: {
        screen: MainNavContainer
    }
}, {
    headerMode: 'none',
    animationEnabled: false,
    swipeEnabled: false,
});

export default LoginWrapper;
