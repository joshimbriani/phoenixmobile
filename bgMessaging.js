import firebase from 'react-native-firebase'

export default async (message) => {
    // handle your message
    const notification = new firebase.notifications.Notification()
        .android.setBigText("Test")
        .android.setChannelId("messaging")
        .setNotificationId("notificationID")
        .setBody("Testing 123")

    return Promise.resolve();
}