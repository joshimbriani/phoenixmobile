import firebase from 'react-native-firebase'

export default async (message) => {
    // handle your message
    var notification = new firebase.notifications.Notification()
        .android.setAutoCancel(true)
        .android.setColor('#0097E6')
        .android.setSmallIcon('notif')
        .setTitle(message.data["title"])
        .setNotificationId(makeid())
        .setBody(message.data["body"]);
    
        if (message.data["type"] === 'm') {
            notification.setSubtitle("Message")
            .android.setChannelId("messages")
            .setData({
                type: message.data["type"],
                event: message.data["event"],
                group: message.data["group"],
                threadID: message.data["threadID"]
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

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }