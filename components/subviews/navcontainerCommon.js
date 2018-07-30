import React from 'react';

import { StackNavigator } from 'react-navigation';

import PlatformIonicon from '../utils/platformIonicon';
import Suggested from '../app/suggested';
import ProfileTabContainer from '../profile/profileTabContainer';
import Home from '../app/home';
import Topic from '../app/topic';
import Settings from '../settings/settings';
import ProfileSettings from '../settings/profile-settings';
import LocationsSettings from '../settings/locations-settings';
import PrivacySettings from '../settings/privacy-settings';
import RestrictedModeSettings from '../settings/restricted-mode-settings';
import HelpSettings from '../settings/help-settings';
import LegalSettings from '../settings/legal-settings';
import AboutKootaSettings from '../settings/about-koota-settings';
import NotificationSettings from '../settings/notificationSettings';
import BlockedUserSettings from '../settings/blockedSettings';
import NewEvent from '../app/newevent';
import Search from '../app/search';
import EventDetailWrapper from '../app/eventDetailWrapper';
import Filter from './filter';
import IDK from '../app/idk';
import MyEvents from '../profile/myEvents';
import ConversationView from '../app/messaging/conversationView';
import NewMessage from '../app/messaging/newMessage';
import GroupWrapper from '../app/groupWrapper';
import GroupsList from '../app/groupsList';
import NewGroup from '../app/newGroup';
import AddFriends from '../profile/addFriends';
import { styles } from '../../assets/styles';

export const HomeStack = StackNavigator({
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
    EventDetailWrapper: {
        path: '/event/:event',
        screen: EventDetailWrapper,
    },
    Filter: {
        path: '/filter',
        screen: Filter,
    },
    IDK: {
        path: '/idk',
        screen: IDK,
    },
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
    ConversationView: {
        path: '/thread/:threadid',
        screen: ConversationView
    },
    NewMessage: {
        path: '/thread/new',
        screen: NewMessage
    }
});

export const SettingsStack = StackNavigator({
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
    },
        AboutKootaSettings: {
        screen: AboutKootaSettings,
        navigationOptions: ({ navigation }) => ({
            title: 'About Koota Settings',
        })
    },
    NotificationSettings: {
        screen: NotificationSettings,

    },
    BlockedUserSettings: {
        screen: BlockedUserSettings
    }
});

export const ProfileStack = StackNavigator({
    ProfileTabContainer: {
        screen: ProfileTabContainer,
        path: '/profile',
        navigationOptions: ({ navigation }) => ({
            title: 'Profile'
        })
    },
    EventDetailWrapper: {
        screen: EventDetailWrapper,
        path: '/event/:id'
    },
    ConversationView: {
        path: '/thread/:threadid',
        screen: ConversationView
    },
    NewMessage: {
        path: '/thread/new',
        screen: NewMessage
    },
    AddFriends: {
        path: '/addfriends',
        screen: AddFriends
    }
});

export const GroupStack = StackNavigator({
    GroupsList: {
        path: '/groups/',
        screen: GroupsList
    },
    GroupWrapper: {
        path: '/groups/:id',
        screen: GroupWrapper
    },
    ConversationView: {
        path: '/thread/:threadid',
        screen: ConversationView
    },
    NewGroup: {
        path: '/groups/news',
        screen: NewGroup
    },
    NewMessage: {
        path: '/thread/new',
        screen: NewMessage
    }
})