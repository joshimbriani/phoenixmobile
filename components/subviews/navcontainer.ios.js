import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import PlatformIonicon from '../utils/platformIonicon';
import {HomeStack, MyEventsStack, ProfileStack, SettingsStack} from './navcontainerCommon';
import Login from '../auth/login';
import Register from '../auth/register';

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
    },
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
