import React from 'react';

import { createStackNavigator } from 'react-navigation';

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
import AddToGroup from '../app/addToGroup';
import InviteUsers from '../app/newEvent/inviteUsers';
import FilterHome from '../app/filter/filterHome';
import FilterTopics from '../app/filter/filterTopics';
import NewEventFork from '../app/newEvent/newEventFork';
import FindSubEvents from '../app/newEvent/findSubEvents';
import NewEventPlaceStandalone from '../app/newEvent/newEventPlaceStandalone';
import NewLocation from '../settings/newLocation';
import OfferWrapper from '../app/offerDetailWrapper';
import PlaceDetailsWrapper from '../app/placeDetailsWrapper';
import { styles } from '../../assets/styles';

export const HomeStack = createStackNavigator({
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
                onPress={() => navigation.openDrawer()} />
        })
    },
    ConversationView: {
        path: '/thread/:threadid',
        screen: ConversationView
    },
    NewMessage: {
        path: '/thread/new',
        screen: NewMessage
    },
    InviteUsers: {
        path: '/newevent/inviteUsers',
        screen: InviteUsers
    },
    FilterHome: {
        path: '/filter',
        screen: FilterHome
    },
    FilterTopics: {
        path: '/filter/topics',
        screen: FilterTopics
    },
    NewEventFork: {
        path: '/newevent/fork',
        screen: NewEventFork
    },
    FindSubEvents: {
        path: '/newevent/findsubevents',
        screen: FindSubEvents
    },
    NewEventPlaceStandalone: {
        path: '/newevent/place',
        screen: NewEventPlaceStandalone
    },
    NewLocation: {
        screen: NewLocation
    },
    OfferWrapper: {
        path: '/offer/:id',
        screen: OfferWrapper
    },
    PlaceDetailsWrapper: {
        path: '/place/:id',
        screen: PlaceDetailsWrapper
    }
}, {
    animationEnabled: false,
    swipeEnabled: false,
});

export const SettingsStack = createStackNavigator({
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
            title: 'Privacy Policy',
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
            title: 'Help',
        })
    },
    LegalSettings: {
        screen: LegalSettings,
        navigationOptions: ({ navigation }) => ({
            title: 'Legal',
        })
    },
        AboutKootaSettings: {
        screen: AboutKootaSettings,
        navigationOptions: ({ navigation }) => ({
            title: 'About Koota',
        })
    },
    NotificationSettings: {
        screen: NotificationSettings,

    },
    BlockedUserSettings: {
        screen: BlockedUserSettings
    },
    NewLocation: {
        screen: NewLocation
    }
}, {
    animationEnabled: false,
    swipeEnabled: false,
});

export const ProfileStack = createStackNavigator({
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
}, {
    animationEnabled: false,
    swipeEnabled: false,
});

export const GroupStack = createStackNavigator({
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
    },
    AddToGroup: {
        path: '/groups/:id/add',
        screen: AddToGroup
    },
},
{
    animationEnabled: false,
    swipeEnabled: false,
})