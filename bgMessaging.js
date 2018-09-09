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
            .android.setChannelId("yourEventUpdates")
            .setData({
                type: message.data["type"],
                event: message.data["event"],
                randomID: message.data["randomID"],
                eventTitle: message.data["eventTitle"]
            });
        } else if (message.data["type"] === 'e') {
            notification.setSubtitle("Event Update")
            .android.setChannelId("eventUpdates")
            .setData({
                type: message.data["type"],
                event: message.data["event"],
                randomID: message.data["randomID"],
                eventTitle: message.data["eventTitle"]
            });
        } else if (message.data["type"] === 'g') {
            notification.setSubtitle("Added to Group")
            .android.setChannelId("group")
            .setData({
                type: message.data["type"],
                groupID: message.data["groupID"],
                randomID: message.data["randomID"]
            });
        } else if (message.data["type"] === 'c') {
            notification.setSubtitle("Contact Request")
            .android.setChannelId("contact")
            .setData({
                type: message.data["type"],
                userFromID: message.data["userFromID"],
                randomID: message.data["randomID"]
            });
        } else if (message.data["type"] === 'i') {
            notification.setSubtitle("Invitation")
                .android.setChannelId("invitation")
                .setData({
                    type: message.data["type"],
                    event: message.data["event"],
                    randomID: message.data["randomID"],
                    eventTitle: message.data["eventTitle"]
                });
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
    } else if (data["type"] === 'y') {
        id += data["userFromID"] + data["updateType"]
    } else if (data["type"] === 'i') {
        id += data["userFromID"] + data["event"]
    } else if (data["type"] === 'c') {
        id += data["userFromID"]
    } else if (data["type"] === 'e') {
        id += data["type"] + data["event"]
    }

    return id;
  }