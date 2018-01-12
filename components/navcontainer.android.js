import React from 'react';
import { StyleSheet, Text, FlatList, ScrollView, View } from 'react-native';
import { DrawerNavigator, StackNavigator, DrawerItems } from 'react-navigation';
import { SideDrawer } from './sidedrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './home';
import Topic from './topic';
import Settings from './settings';
import NewEvent from './newevent';
import EventDetail from './eventdetail';
import Filter from './filter';

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
    },
    EventDetail: {
        path: '/event/:event',
        screen: EventDetail
    },
    Filter: {
        path: '/filter',
        screen: Filter
    }
});

const SettingsStack = StackNavigator({
    Settings: {
        screen: Settings,
        navigationOptions: ({ navigation }) => ({
            title: 'Settings',
            headerLeft: <Ionicons
                name="md-menu"
                style={{paddingLeft: 10}}
                size={35}
                onPress={() => navigation.navigate('DrawerOpen')} />
        })
    }
});

const SuggestedStack = StackNavigator({
    Suggested: {
        screen: SuggestedScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Suggested',
            headerLeft: <Ionicons
                name="md-menu"
                style={{paddingLeft: 10}}
                size={35}
                onPress={() => navigation.navigate('DrawerOpen')} />
        })
    }
});

const ProfileStack = StackNavigator({
    Profile: {
        screen: ProfileScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Profile',
            headerLeft: <Ionicons
                name="md-menu"
                style={{paddingLeft: 10}}
                size={35}
                onPress={() => navigation.navigate('DrawerOpen')} />
        })
    }
});

const NavContainer = DrawerNavigator({
    
    Home: {
        screen: Homestack,
        navigationOptions: {
            drawerLabel: 'Home',
            drawerIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name='md-home'
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
                <Ionicons
                    name='md-apps'
                    size={20}
                    style={{ color: tintColor }}
                />
            ),
        },
    },
    Profile: {
        screen: ProfileStack,
        navigationOptions: {
            drawerLabel: 'Profile',
            drawerIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name='md-person'
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
                <Ionicons
                    name='md-settings'
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

export default NavContainer;

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
