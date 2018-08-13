import firebase from 'react-native-firebase'

export default async (message) => {
    // handle your message
    var notification = new firebase.notifications.Notification()
        .android.setAutoCancel(true)
        .android.setColor('#0097E6')
        .android.setSmallIcon('notif')
        .setTitle(message.data["title"])
        .setNotificationId(makeid(message.data))
        .setBody(message.data["body"]);
    
        if (message.data["type"] === 'm') {
            notification.setSubtitle("Message")
            .android.setChannelId("messages")
            .setData({
                type: message.data["type"],
                event: message.data["event"],
                group: message.data["group"],
                threadID: message.data["threadID"],
                randomID: message.data["randomID"]
            });
        } else if (message.data["type"] === 's') {
            notification.setSubtitle("Suggested Event")
            .android.setChannelId("suggestedEvent");
        } else if (message.data["type"] === 'o') {
            notification.setSubtitle("Hot Offer")
            .android.setChannelId("promotedOffer");
        } else if (message.data["type"] === 'y') {
            notification.setSubtitle("Your Event Update")
            .android.setChannelId("yourEventUpdates");
        } else if (message.data["type"] === 'e') {
            notification.setSubtitle("Event Update")
            .android.setChannelId("eventUpdates");
        } else {
            notification.android.setChannelId("default");
        }

    firebase.notifications().displayNotification(notification);

    return Promise.resolve();
}

function makeid(data) {
    var id = data["type"];
    if (data["type"] === 'm') {
        id += data["group"] ? "group" + data["group"] : "event" + data["event"];
    }

    return id;
  }