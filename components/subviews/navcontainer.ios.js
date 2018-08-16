import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import PlatformIonicon from '../utils/platformIonicon';
import {HomeStack, ProfileStack, SettingsStack, GroupStack} from './navcontainerCommon';
import Login from '../auth/login';
import Register from '../auth/register';
import { styles } from '../../assets/styles';
import RegisterDetails from '../auth/registerDetails';

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
    Groups: {
        screen: GroupStack,
        navigationOptions: {
            tabBarLabel: 'Groups',
            tabBarIcon: ({ tintColor, focused }) => (
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
            tabBarLabel: 'My Koota',
            tabBarIcon: ({ tintColor, focused }) => (
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
    Login: {
        screen: Login,
        navigationOptions: ({ navigation }) => ({
            title: 'Login',
            header: null
        })
    },
    Register: {
        screen: Register,
        navigationOptions: ({ navigation }) => ({
            title: 'Register',
            header: null
        })
    },
    RegisterDetails: {
        screen: RegisterDetails
    },
    Main: {
        screen: MainNavContainer
    },
}, {
        headerMode: 'none'
    });

export default LoginWrapper;