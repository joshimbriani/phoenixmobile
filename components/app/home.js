import React from 'react';
import { Container, Fab, Header, Item, Input, Button, Text } from 'native-base';
import { Platform, RefreshControl, TouchableOpacity, View, SectionList, PermissionsAndroid, AsyncStorage, ActivityIndicator, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor';
import * as userActions from '../../redux/actions/user';
import * as locationActions from '../../redux/actions/location';
import PlatformIonicon from '../utils/platformIonicon';
import { getURLForPlatform } from '../utils/networkUtils';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import { EventDisplay } from './eventDisplay';
import Permissions from 'react-native-permissions';
import moment from 'moment';

import { LocationHeader } from './locationHeader';

import { StackActions, NavigationActions } from 'react-navigation';
import { generateUserToString } from '../utils/textUtils';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            searchQuery: "",
            refreshing: false,
            GPSPermission: false,
            notificationsAllowed: false,
            loading: true,
            feed: [],
            coordinates: {},
            latestDate: null,
            loadingMore: false,
            events: [],
            endOfResults: false,
            filters: {
                changed: false,
                privacy: "all",
                restrictToGender: "all",
                offer: "all",
                datetime: {
                    start: -1,
                    end: -1
                },
                duration: {
                    moreThan: 0,
                    lessThan: 300
                },
                capacity: 1,
                topics: {
                    type: 'all',
                    topics: []
                }
            }
        };

        this.onEndReachedCalledDuringMomentum = true;

        this.changeValue = this.changeValue.bind(this);
        this.checkUserPermissions = this.checkUserPermissions.bind(this);
        this.reactToNotification = this.reactToNotification.bind(this);
        this.userInterestedInEvent = this.userInterestedInEvent.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.loadEvents = this.loadEvents.bind(this);
        this.setSelectedLocation = this.setSelectedLocation.bind(this);
        this.resetEvents = this.resetEvents.bind(this);

        this.props.navigation.setParams({ setFilter: this.setFilter, loadEvents: () => {this.resetEvents(); this.loadEvents()}, locations: props.locations, selected: props.selected, setSelectedLocation: this.setSelectedLocation });
    }

    getPosition(options) {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    async setSelectedLocation(item) {
        if (item === -2) {
            this.props.navigation.navigate('NewLocation');
            await this.props.locationActions.setSelectedLocation(this.props.selected);
        } else {
            this.resetEvents();
            await this.props.locationActions.setSelectedLocation(item);
        }
    }

    async componentDidMount() {
        await this.props.userActions.loadUser(this.props.token);
        await this.props.userActions.loadUserDetails(this.props.token, this.props.user);
        await this.props.userActions.loadInterested(this.props.token, this.props.user);
        this.props.colorActions.resetColor();

        await this.checkUserPermissions();

        if (this.props.FCMToken !== this.props.details.FCMToken) {
            fetch(getURLForPlatform() + "api/v1/user/" + this.props.user + "/", {
                headers: {
                    Authorization: "Token " + this.props.token
                },
                body: JSON.stringify({
                    'FCMToken': this.props.FCMToken
                }),
                method: 'PUT'
            }).then(response => response.json())
                .then(responseObj => {
                    if (!responseObj["update"]) {
                        console.log("Bad Update")
                    }
                })
        }

        try {
            let position = await this.getPosition(Platform.OS === 'ios' ? { enableHighAccuracy: true, timeout: 20000 } : { timeout: 50000 });
            this.setState({ coordinates: { lat: position.coords.latitude, long: position.coords.longitude } })
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }

        firebase.messaging().requestPermission()
            .then(() => {
                // User has authorised  
                console.log("User has permission")
                this.setState({ notificationsAllowed: true })
            })
            .catch(error => {
                // User has rejected permissions  
                console.log("User rejected notification")
            });

        firebase.notifications().getInitialNotification().then(async (notification) => {
            console.log("Got notification")
            const not = await AsyncStorage.getItem("notification")
            if (notification && notification.notification.data["randomID"] !== not) {
                const not = notification;

                var data = {}
                data["type"] = notification.notification.data["type"]
                data["event"] = notification.notification.data["event"]
                data["group"] = notification.notification.data["group"]
                data["threadID"] = notification.notification.data["threadID"]
                data["groupID"] = notification.notification.data["groupID"]

                await AsyncStorage.setItem('notification', notification.notification.data["randomID"]);
                this.reactToNotification(data);
            }
        })

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            console.log("On notifiaction displayed")
        });

        this.notificationListener = firebase.notifications().onNotification((notification) => {
            // Process your notification as required
            const displaynotification = new firebase.notifications.Notification()
                .setNotificationId('notificationId')
                .setTitle(notification._body)
                .setBody('My notification body')
                .android.setChannelId('messages')
                .setData(notification.data);

            firebase.notifications().displayNotification(displaynotification);
        });

        this.openNotification = firebase.notifications().onNotificationOpened(async (notification) => {
            console.log("Got notification")
            var data = {}
            data["type"] = notification.notification.data["type"]
            data["event"] = notification.notification.data["event"]
            data["group"] = notification.notification.data["group"]
            data["threadID"] = notification.notification.data["threadID"]
            data["groupID"] = notification.notification.data["groupID"]
            data["eventTitle"] = notification.notification.data["eventTitle"]
            const not = await AsyncStorage.getItem("notificationOpened");
            if (not !== notification.notification.data["randomID"]) {
                await AsyncStorage.setItem('notificationOpened', notification.notification.data["randomID"]);
                this.reactToNotification(data)
            }

        });

        this.messageListener = firebase.messaging().onMessage(async (message) => {
            var notification = new firebase.notifications.Notification()
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
                        group: message.data["groupID"]
                    });
            } else if (message.data["type"] === 'c') {
                notification.setSubtitle("Contact Request")
                    .android.setChannelId("contact");
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
        })

        this.setState({ loading: true })
        this.loadEvents();

    }

    componentDidUpdate(prevProps) {
        if (prevProps.locations !== this.props.locations) {
            this.props.navigation.setParams({ locations: this.props.locations });
        }
    }

    setFilter(key, value) {
        var filters = Object.assign({}, this.state.filters);
        filters[key] = value;
        filters["changed"] = true;
        this.setState({ filters: filters });
        // datetime start or end can come back with a -1. Need to handle it. Start = current date, end = no end range
    }

    componentWillUnmount() {
        //this.notificationDisplayedListener();
        //this.notificationListener();
        //this.notificationOnStartup();
        //this.openNotification();
        //this.messageListener();
    }

    reactToNotification(data) {
        console.log("Notification being acted on")
        const type = data["type"];
        if (type === "m") {
            const event = data["event"];
            const group = data["group"];
            if (event) {
                fetch(getURLForPlatform() + "api/v1/events/" + event + "/", {
                    headers: {
                        Authorization: "Token " + this.props.token
                    }
                }).then(response => response.json())
                    .then(responseObj => {
                        var thread = {};
                        const threadID = parseInt(data["threadID"]);
                        for (var i = 0; i < responseObj["threads"].length; i++) {
                            if (responseObj["threads"][i].id === threadID) {
                                thread = responseObj["threads"][i]
                            }
                        }
                        const resetAction = StackActions.reset({
                            index: 2,
                            key: this.props.navigation.dangerouslyGetParent().state.key,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Home' }),
                                StackActions.push({ routeName: 'EventDetailWrapper', params: { event: responseObj["title"], id: responseObj["id"], goToMessages: true } }),
                                StackActions.push({ routeName: 'ConversationView', params: { newConvo: false, eventName: responseObj["title"], thread: thread, color: '#ffffff', userString: generateUserToString(this.props.user, thread.users, responseObj["userBy"]["username"]) } })
                            ]
                        })
                        this.props.navigation.dispatch(resetAction);
                    })
            } else if (group) {

                const resetAction = StackActions.reset({
                    index: 0,
                    key: null,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Main', action: StackActions.push({ routeName: 'GroupWrapper', params: { groupID: group, goToMessages: true } }), }),
                    ]
                })
                this.props.navigation.dispatch(resetAction);
            }
        } else if (type === "s") {
            // Suggested Event
            const event = data["event"];
            const resetAction = StackActions.reset({
                index: 1,
                key: this.props.navigation.dangerouslyGetParent().state.key,
                actions: [
                    NavigationActions.navigate({ routeName: 'Home' }),
                    StackActions.push({ routeName: 'EventDetailWrapper', params: { id: event } }),
                ]
            })
            this.props.navigation.dispatch(resetAction);

        } else if (type === "o") {
            // Promoted Offer

        } else if (type === "y") {
            // Updates on your events
            const event = data["event"];
            const resetAction = StackActions.reset({
                index: 1,
                key: this.props.navigation.dangerouslyGetParent().state.key,
                actions: [
                    NavigationActions.navigate({ routeName: 'Home' }),
                    StackActions.push({ routeName: 'EventDetailWrapper', params: { id: event, event: data["eventTitle"] } }),
                ]
            })
            this.props.navigation.dispatch(resetAction);

        } else if (type === "e") {
            // Updates on events you're going to/interested in
            const event = data["event"];
            const resetAction = StackActions.reset({
                index: 1,
                key: this.props.navigation.dangerouslyGetParent().state.key,
                actions: [
                    NavigationActions.navigate({ routeName: 'Home' }),
                    StackActions.push({ routeName: 'EventDetailWrapper', params: { id: event, event: data["eventTitle"] } }),
                ]
            })
            this.props.navigation.dispatch(resetAction);
        } else if (type === "g") {
            // Notification for joining a group
            const resetAction = StackActions.reset({
                index: 0,
                key: null,
                actions: [
                    NavigationActions.navigate({ routeName: 'Main', action: StackActions.push({ routeName: 'GroupWrapper', params: { groupID: data["groupID"] } }), }),
                ]
            })
            this.props.navigation.dispatch(resetAction);
        } else if (type === "c") {
            // Notifications for new contact request
            const resetAction = StackActions.reset({
                index: 0,
                key: null,
                actions: [
                    NavigationActions.navigate({ routeName: 'Main', action: StackActions.push({ routeName: 'ProfileTabContainer' }), }),
                ]
            })
            this.props.navigation.dispatch(resetAction);
        } else if (type === "i") {
            // Notifications for new event invitation
            const event = data["event"];
            const resetAction = StackActions.reset({
                index: 1,
                key: this.props.navigation.dangerouslyGetParent().state.key,
                actions: [
                    NavigationActions.navigate({ routeName: 'Home' }),
                    StackActions.push({ routeName: 'EventDetailWrapper', params: { id: event, event: data["eventTitle"] } }),
                ]
            })
            this.props.navigation.dispatch(resetAction);
        }
    }

    async checkUserPermissions() {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

                if (granted) {
                    this.setState({ GPSPermission: true })
                } else {
                    const grantedNow = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            'title': 'Koota',
                            'message': 'Koota needs access to your GPS location ' +
                                'so you can find awesome things happening around you.'
                        }
                    )
                    if (grantedNow === PermissionsAndroid.RESULTS.GRANTED) {
                        console.warn("You can use the camera")
                        this.setState({ GPSPermission: true })
                    }
                }

            } catch (err) {
                console.warn(err)
            }
        } else if (Platform.OS === 'ios') {
            navigator.geolocation.requestAuthorization();
            this.setState({ GPSPermission: true })
        }
    }

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => {
        const { params = {} } = navigation.state;
        return ({
            title: 'Home',
            headerLeft: <Icon
                style={{ paddingLeft: 10 }}
                size={35}
                onPress={() => navigation.openDrawer()}
                name="md-menu"
            />,
            headerRight: <Icon
                name="md-funnel"
                size={35}
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('FilterHome', { setFilter: navigation.state.params.setFilter, loadEvents: navigation.state.params.loadEvents, default: true })}
            />,
            headerTitle: <LocationHeader locations={params ? params.locations : []} selectedLocation={params ? params.selected : []} setCurrentLocation={async (location) => { await params.setSelectedLocation(location); params.loadEvents() }} />,

        })
    } : ({ navigation }) => {
        const { params = {} } = navigation.state;
        return ({
            title: 'Home',
            headerStyle: { paddingTop: -22, },
            headerTitle: <LocationHeader locations={params ? params.locations : []} selectedLocation={params ? params.selected : []} setCurrentLocation={async (location) => { await params.setSelectedLocation(location); params.loadEvents() }} />,
            headerRight: <Icon
                name="ios-funnel"
                size={35}
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('FilterHome', { setFilter: navigation.state.params.setFilter, loadEvents: navigation.state.params.loadEvents, default: true })}
            />
        })
    };

    changeValue(text) {
        this.setState({ searchQuery: text });
    }

    // TODO: Does IDK need to route to a special IDK page or just to the suggested page?
    routeToTopic(item) {
        if (item.id === -1) {
            this.props.navigation.navigate('IDK', {});
        } else {
            this.props.navigation.navigate('Topic', { topic: item.name, id: item.id, color: item.color.substring(0) })
        }
    }

    _onRefresh() {
        this.props.userActions.loadInterested(this.props.token, this.props.user);
        this.setState({ events: [], feed: [] })
        this.loadEvents(null, false);
    }

    loadEvents(latestDate = null, loadingMore = false, append = true) {
        if (loadingMore) {
            this.setState({ loadingMore: true })
        } else {
            this.setState({ loading: true })
        }

        this.setState({ endOfResults: false })

        var filterProps = {};
        if (this.props.filter) {
            Object.assign(filterProps, this.props.filter);
        }

        if (this.state.filters.changed === true) {
            Object.assign(filterProps, this.state.filters);
        }

        if (this.state.GPSPermission) {
            if (this.props.selected === -1) {
                filterProps["lat"] = this.state.coordinates.lat
                filterProps["long"] = this.state.coordinates.long
            } else {
                var index = this.props.locations.map((location) => location.id).indexOf(this.props.selected);
                filterProps["lat"] = this.props.locations[index].lat;
                filterProps["long"] = this.props.locations[index].long;
            }

        }

        const filterString = this.generateFilterURLString(filterProps, latestDate);

        fetch(getURLForPlatform() + 'api/v1/user/feed/' + filterString, {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseJSON => {
                if (responseJSON["events"]) {
                    var defaultFilter = Object.assign({}, this.props.filter);
                    defaultFilter["changed"] = false;
                    var feed = this.state.feed.slice();
                    var events = this.state.events.slice();
                    events = events.concat(responseJSON["events"])
                    feed = this.generateFeed(events, responseJSON["offers"])
                    this.setState({ feed: feed, loading: false, filters: defaultFilter, events: events })
                    if (responseJSON["events"].length > 0) {
                        this.setState({ latestDate: responseJSON["events"][responseJSON["events"].length - 1].datetime })
                    } else {
                        this.setState({ endOfResults: true })
                    }
                }

            })
    }

    resetEvents() {
        this.setState({events: []})
    }

    generateFeed(events, offers) {
        var feed = [];
        for (var i = 0; i < events.length; i++) {
            var datestring = moment(events[i].datetime).format('MM-DD-YYYY');
            var item = feed.find((date) => date.datestring === datestring);
            if (item) {
                item.data.push(events[i])
            } else {
                feed.push({ datestring: datestring, data: [events[i]], offers: [] })
            }
        }
        var latestDay = Math.max.apply(null, events.map((event) => new Date(event.datetime)));
        const startDate = moment()
        const endDate = moment(latestDay)
        for (var m = moment(startDate).seconds(0).minutes(0).hours(0); m.isBefore(endDate); m.add(1, 'days')) {
            var offersForDate = offers.filter((offer) => {
                var isOngoingOffer = moment(offer.startTime).isSameOrBefore(m) && moment(offer.endTime).isSameOrAfter(m);
                if (offer.recurrences.length > 0) {
                    const matchingRecurrences = offer.recurrences.filter((recurrence) => m.format('dddd').toLowerCase() === recurrence.dayOfWeek);
                    return matchingRecurrences.length > 0;
                }

                return isOngoingOffer
            });

            if (offersForDate && offersForDate.length > 0) {
                var item = feed.find((date) => date.datestring === m.format('MM-DD-YYYY'));
                if (item) {
                    shuffleArray(offersForDate)
                    item.offers = offersForDate
                } else {
                    shuffleArray(offersForDate)
                    feed.push({ datestring: m.format('MM-DD-YYYY'), data: [], offers: offersForDate })
                }
            }
        }

        feed.sort((a, b) => {
            var aMoment = moment(a.datestring, 'MM-DD-YYYY');
            var bMoment = moment(b.datestring, 'MM-DD-YYYY');

            if (aMoment.isBefore(bMoment)) {
                return -1
            } else if (aMoment.isAfter(bMoment)) {
                return 1
            } else {
                return 0
            }
        })

        return feed
    }

    generateFilterURLString(filterPropsObject, latestDate) {
        var filterString = "?";
        filterString += ("includeForks=false")
        filterString += ("&privacy=" + filterPropsObject.privacy)
        filterString += ("&restrictToGender=" + (filterPropsObject.restrictToGender === 'all' ? 'false' : 'true'))
        filterString += ("&offer=" + filterPropsObject.offer)
        filterString += ("&datetimegt=" + (filterPropsObject.datetime.start === -1 ? 'now' : (typeof filterPropsObject.datetime.start === 'string' ? filterPropsObject.datetime.start : filterPropsObject.datetime.start.toISOString())))
        if (filterPropsObject.datetime.end !== -1) {
            filterString += ("&datetimelt=" + (typeof filterPropsObject.datetime.end === 'string' ? filterPropsObject.datetime.end : filterPropsObject.datetime.end.toISOString()))
        }
        filterString += ("&durationgt=" + (filterPropsObject.duration.moreThan === 0 ? 'all' : filterPropsObject.duration.moreThan))
        filterString += ("&durationlt=" + (filterPropsObject.duration.lessThan === 300 ? 'all' : filterPropsObject.duration.lessThan))
        filterString += ("&capacity=" + filterPropsObject.capacity)
        filterString += ("&topicsType=" + filterPropsObject.topics.type)
        if (filterPropsObject.topics.type === 'custom') {
            filterString += ("&topics=" + filterPropsObject.topics.topics.map(topic => topic.id).join(","))
        }
        if (filterPropsObject["lat"] && filterPropsObject["long"]) {
            filterString += ("&lat=" + filterPropsObject.lat)
            filterString += ("&long=" + filterPropsObject.long)
        }
        if (latestDate) {
            filterString += ("&startDate=" + latestDate)
        }

        return filterString;
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = (item) => (
        <EventDisplay index={item.id} event={item} interested={this.userInterestedInEvent(item.id)} showButtons={true} username={this.props.details.username} token={this.props.token} goToEvent={() => this.props.navigation.navigate('EventDetailWrapper', { event: item.title, id: item.id, color: item.color, loadEvents: () => {this.resetEvents(); this.loadEvents()} })} />
    );

    userInterestedInEvent(eventID) {
        if (this.props.interestedInEvents) {
            for (var i = 0; i < this.props.interestedInEvents.length; i++) {
                if (eventID === this.props.interestedInEvents[i].id) {
                    return true;
                }
            }
        }
        return false;
    }

    render() {
        return (
            <Container style={{ backgroundColor: '#D3D3D3' }}>
                <Header searchBar rounded>
                    <Item>
                        <PlatformIonicon name="search" size={30} style={{ marginLeft: 5 }} />
                        <Input
                            placeholder="What Do You Wanna Do?"
                            onChangeText={(text) => this.changeValue(text)}
                            value={this.state.searchQuery}
                            onSubmitEditing={() => {
                                if (this.state.searchQuery.length > 0) {
                                    const query = this.state.searchQuery;
                                    this.setState({ searchQuery: "" });
                                    this.props.navigation.navigate('Search', { query: query });
                                }
                            }} />
                    </Item>
                    <Button transparent onPress={() => {
                        if (this.state.searchQuery.length > 0) {
                            const query = this.state.searchQuery;
                            this.setState({ searchQuery: "" });
                            this.props.navigation.navigate('Search', { query: query })
                        }
                    }
                    }>
                        <Text>Search</Text>
                    </Button>
                </Header>
                {this.state.loading && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>}
                {!this.state.loading && this.state.feed.length > 0 &&
                    <SectionList
                        renderItem={({ item, index, section }) => {
                            return this._renderItem(item)
                        }}
                        stickySectionHeadersEnabled={false}
                        renderSectionHeader={({ section }) => {
                            return (
                                <View>
                                    <View style={{ alignItems: 'center', marginTop: 5 }}>
                                        <Text style={{ fontSize: 7 }}>{moment(section.datestring, 'MM-DD-YYYY').format('dddd, MMMM Do YYYY')}</Text>
                                    </View>
                                    {section.offers && section.offers.length > 0 && <View style={{ alignItems: 'center', marginTop: 5 }}>
                                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Offers</Text>
                                    </View>}
                                    <FlatList
                                        data={section.offers}
                                        horizontal={true}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('OfferWrapper', { offer: item, date: section.datestring })}>
                                                <View key={this.props.index} style={{
                                                    backgroundColor: '#BFF2BD', flex: 1, margin: 5, padding: 5,
                                                    ...Platform.select({
                                                        ios: {
                                                            shadowColor: 'rgba(0,0,0, .2)',
                                                            shadowOffset: { height: 0, width: 0 },
                                                            shadowOpacity: 1,
                                                            shadowRadius: 1,
                                                        },
                                                        android: {
                                                            elevation: 1,
                                                        },
                                                    }),
                                                }}>
                                                    <View>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.name}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={{ fontSize: 10 }}>{item.recurrences.length === 0 && "All Day"}{item.recurrences.length > 0 && (moment(item.recurrences.find((recurrence) => moment(section.datestring, 'MM-DD-YYYY').format('dddd').toLowerCase() === recurrence.dayOfWeek).startTime, 'HH:mm:ss').format('h:mm a') + ' - ' + moment(item.recurrences.find((recurrence) => moment(section.datestring, 'MM-DD-YYYY').format('dddd').toLowerCase() === recurrence.dayOfWeek).endTime, 'HH:mm:ss').format('h:mm a'))}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <PlatformIonicon name="pin" size={12} style={{ marginHorizontal: 5 }} />
                                                        <Text style={{ fontSize: 10 }}>{item.place.name}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                                    {section.data && section.data.length > 0 && <View style={{ alignItems: 'center', marginTop: 5 }}>
                                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Events</Text>
                                    </View>}
                                </View>

                            )
                        }}
                        sections={this.state.feed}
                        keyExtractor={(item, index) => item + index}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.loading}
                                onRefresh={this._onRefresh}
                            />
                        }
                        onEndReached={() => {
                            if (!this.state.endOfResults) {
                                this.loadEvents(this.state.latestDate, true, true);
                            }
                        }
                        }
                        ListFooterComponent={() => {
                            return (
                                <View style={{ flex: 1 }}>
                                    {this.state.loadingMore && !this.state.endOfResults && <ActivityIndicator size="small" color="#0000ff" />}
                                </View>
                            )
                        }}

                        onEndReachedThreshold={0.3}
                    />}
                {!this.state.loading && this.state.feed.length <= 0 && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                        <Text>No Events Found. Try Reloading!</Text>
                        <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: 15 }}>
                            <Button onPress={() => { this.setState({ loading: true }); this.loadEvents() }}>
                                <Text>Reload Events</Text>
                            </Button>
                        </View>
                    </View>
                </View>}
                <Fab
                    active={this.state.active}
                    containerStyle={{}}
                    style={{ backgroundColor: '#e84118' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('NewEvent', { topic: "" })}>
                    <PlatformIonicon
                        name={"add"}
                        size={50} //this doesn't adjust the size...?
                        style={{ color: "white" }}
                    />
                </Fab>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        color: state.backgroundColorReducer.color,
        token: state.tokenReducer.token,
        FCMToken: state.tokenReducer.FCMToken,
        user: state.userReducer.user,
        filter: state.userReducer.filter,
        interestedInEvents: state.userReducer.interestedInEvents,
        details: state.userReducer.details,
        locations: state.locationReducer.locations,
        selected: state.locationReducer.selected
    };
}

function mapDispatchToProps(dispatch) {
    return {
        colorActions: bindActionCreators(colorActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
        locationActions: bindActionCreators(locationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
    }
}
