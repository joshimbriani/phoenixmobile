import { AppRegistry, AsyncStorage } from 'react-native';
import App from './App';
import bgMessaging from './bgMessaging';

import firebase from 'react-native-firebase'

const mchannel = new firebase.notifications.Android.Channel('messages', 'Messages Channel', firebase.notifications.Android.Importance.Max).setDescription('Message Channel')
const schannel = new firebase.notifications.Android.Channel('suggestedEvent', 'Suggested Event Channel', firebase.notifications.Android.Importance.Max).setDescription('Suggested Event Channel')
const ochannel = new firebase.notifications.Android.Channel('promotedOffer', 'Promoted Offer Channel', firebase.notifications.Android.Importance.Max).setDescription('Promoted Offer Channel')
const ychannel = new firebase.notifications.Android.Channel('yourEventUpdates', 'Your Event Updates Channel', firebase.notifications.Android.Importance.Max).setDescription('Your Event Updates Channel')
const echannel = new firebase.notifications.Android.Channel('eventUpdates', 'Event Updates Channel', firebase.notifications.Android.Importance.Max).setDescription('Event Updates Channel')
const gchannel = new firebase.notifications.Android.Channel('group', 'Added to Group Channel', firebase.notifications.Android.Importance.Max).setDescription('Added To Group Channel')
const cchannel = new firebase.notifications.Android.Channel('contact', 'Contact Request Channel', firebase.notifications.Android.Importance.Max).setDescription('Contact Request Channel')
const dchannel = new firebase.notifications.Android.Channel('default', 'Default Channel', firebase.notifications.Android.Importance.Max).setDescription('Default Channel')

firebase.notifications().android.createChannel(mchannel);
firebase.notifications().android.createChannel(schannel);
firebase.notifications().android.createChannel(ochannel);
firebase.notifications().android.createChannel(ychannel);
firebase.notifications().android.createChannel(echannel);
firebase.notifications().android.createChannel(gchannel);
firebase.notifications().android.createChannel(cchannel);
firebase.notifications().android.createChannel(dchannel);

AppRegistry.registerComponent('phoenixmobile', () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);