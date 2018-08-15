import React from 'react';
import { Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import { ScrollView, View, Picker, ToastAndroid, KeyboardAvoidingView, Platform, PermissionsAndroid, FlatList, TouchableOpacity } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { getURLForPlatform } from '../utils/networkUtils';
import { styles } from '../../assets/styles';
import { REACT_SWIPER_BOTTOM_MARGIN } from '../utils/constants';
import { getCurrentLocation } from '../utils/otherUtils';
import { TopicsNewEvent } from './newEvent/topicsNewEvent';
import { TitleDescColorNewEvent } from './newEvent/titleDescColorNewEvent';
import { DatetimeDurationNewEvent } from './newEvent/datetimeDurationNewEvent';
import { PlaceNewEvent } from './newEvent/placeNewEvent';
import { PeopleNewEvent } from './newEvent/peopleNewEvent';
import { OffersNewEvent } from './newEvent/offersNewEvent';

const ITEMS_TO_VALIDATE = ["title", "description", "place", "datetime", "duration", "amount", "eventPrivacy", "group"];

class NewEvent extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'New Event',
        headerLeft: <PlatformIonicon
            name='close'
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.goBack()} />
    });

    constructor(props) {
        super(props);
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        this.state = {
            title: "",
            description: "",
            restrictToGender: false,
            amount: "",
            place: "",
            datetime: "",
            formIsValid: false,
            isDateTimePickerVisible: false,
            topics: [],
            offers: [],
            selectedOffers: [],
            topic: "",
            placePredictions: [],
            lat: -200,
            long: -200,
            placeSearchText: "",
            place: {},
            durationMeasure: "minutes",
            duration: 60,
            color: '#1abc9c',
            session: text,
            eventPrivacy: 'public',
            groups: [],
            group: {},
            invitedUsers: [],
            errors: {
                errors: [],
                amount: "",
                description: "",
                title: "",
                place: "",
                group: "",
                eventPrivacy: "",
                duration: "",
                datetime: ""
            }
        }
        this.onChange = this.onChange.bind(this);
        this.formIsValid = this.formIsValid.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.createTopicList = this.createTopicList.bind(this);
        this.removeTopic = this.removeTopic.bind(this);
        this.addToEvent = this.addToEvent.bind(this);
        this.removeFromEvent = this.removeFromEvent.bind(this);
        this.addTopic = this.addTopic.bind(this);
        this.fetchTopicsFromDescription = this.fetchTopicsFromDescription.bind(this);
        this.inviteFriends = this.inviteFriends.bind(this);
        this.addUsersToInviteLists = this.addUsersToInviteLists.bind(this);
    }

    async componentDidMount() {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted) {
                const coordinates = await getCurrentLocation();
                this.setState({ lat: coordinates.latitude, long: coordinates.longitude });
            }
        } else if (Platform.OS === 'ios') {

        }

        fetch(getURLForPlatform() + "api/v1/groups/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
        })
            .then(response => response.json())
            .then(responseObj => {
                this.setState({ groups: responseObj["groups"] })
            });
    }

    inviteFriends() {
        this.props.navigation.navigate('InviteUsers', { contacts: this.props.user.friends, addUsersToInviteLists: this.addUsersToInviteLists, invitedUsers: this.state.invitedUsers });
    }

    // Actually toggles users
    addUsersToInviteLists(user) {
        var invitedUsers = this.state.invitedUsers.slice();
        if (invitedUsers.indexOf(user) > -1) {
            invitedUsers.splice(invitedUsers.indexOf(user), 1)
        } else {
            invitedUsers.push(user);
        }

        this.setState({ invitedUsers: invitedUsers });
    }

    // Todo: Need to decide what to do with objects thst don't exist on the DB. Right now
    // They're returned without an id tag which prevents us from 
    // this.state.topics.map(t => t.id).join(",");
    createTopicList() {
        var returnTopics = "";
        if (!this.state.topics) {
            return returnTopics;
        }
        for (var i = 0; i < this.state.topics.length; i++) {
            if (this.state.topics[i].id) {
                returnTopics += this.state.topics[i].id;
            }
        }

        return returnTopics
    }

    onChange(component, value) {
        var stateRepresentation = {};
        stateRepresentation[component] = value;
        //stateRepresentation["formIsValid"] = this.formIsValid();
        //console.log(this.formIsValid())
        this.setState(stateRepresentation);
    }

    fetchTopicsFromDescription() {
        fetch(getURLForPlatform() + "api/v1/events/tags/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'description': this.state.description,
                'title': this.state.title
            })
        }).then(response => response.json())
            .then(responseJSON => {
                this.setState({ topics: JSON.parse(responseJSON["tags"]), offers: JSON.parse(responseJSON["offers"]) })
            })
    }

    fetchOffersFromTopics() {
        fetch(getURLForPlatform() + "api/v1/offers/?topicIDs=" + this.state.topics.map((topic) => topic.id).join(","), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Token ' + this.props.token,
            },
        }).then(response => response.json())
            .then(responseJSON => {
                this.setState({ offers: responseJSON });
            })
    }

    formIsValid() {
        var valid = true;
        var errors = Object.assign({}, this.state.errors);
        for (var i = 0; i < ITEMS_TO_VALIDATE.length; i++) {
            if (ITEMS_TO_VALIDATE[i] === "group") {
                if (this.state.eventPrivacy === "group" && Object.keys(this.state.group).length < 1) {
                    this.state.errors["group"] = "If you indicate that this event is limited to groups, you need to add a group!"
                    errors.errors.push("Group")
                    valid = false;
                }
            }
            else if (this.state[ITEMS_TO_VALIDATE[i]] === "" || typeof this.state[ITEMS_TO_VALIDATE[i]] === 'undefined' || ((typeof this.state[ITEMS_TO_VALIDATE[i]] === "object" && !(this.state[ITEMS_TO_VALIDATE[i]] instanceof Date)) && Object.keys(this.state[ITEMS_TO_VALIDATE[i]]).length < 1)) {
                
                if (ITEMS_TO_VALIDATE[i] === 'amount') {
                    errors["amount"] = "You need to have an event capacity!"
                    errors.errors.push("Amount")
                } else if (ITEMS_TO_VALIDATE[i] === 'description') {
                    errors["description"] = "You need to add a description!"
                    errors.errors.push("Description")
                } else if (ITEMS_TO_VALIDATE[i] === 'title') {
                    errors["title"] = "You need to have a title!"
                    errors.errors.push("Title")
                } else if (ITEMS_TO_VALIDATE[i] === 'place') {
                    errors["place"] = "You need to add a place!"
                    errors.errors.push("Place")
                } else if (ITEMS_TO_VALIDATE[i] === 'eventPrivacy') {
                    errors["eventPrivacy"] = "You need to set a privacy level for this event!"
                    errors.errors.push("Event Privacy")
                } else if (ITEMS_TO_VALIDATE[i] === 'duration') {
                    errors["duration"] = "You need to set how long this event will take!"
                    errors.errors.push("Duration")
                } else if (ITEMS_TO_VALIDATE[i] === 'datetime') {
                    errors["datetime"] = "You need to mark when this event is!"
                    errors.errors.push("Event Date & Time")
                }
                

                valid = false;
            } else {
                errors[ITEMS_TO_VALIDATE[i]] = ""
            }
        }
        if (!valid) {
            this.setState({ errors: errors });
            return false;
        }

        this.setState({
            errors: {
                errors: [],
                amount: "",
                description: "",
                title: "",
                place: "",
                group: "",
                eventPrivacy: "",
                duration: "",
                datetime: ""
            }
        })
        return valid;
    }

    submitForm() {
        // TODO: Need to give error messages
        if (this.formIsValid()) {
        //if (false) {
            var duration = this.state.duration;
            if (this.state.durationMeasure === 'hours') {
                duration *= 60;
            } else if (this.state.durationMeasure === 'days') {
                duration = duration * 60 * 24;
            }
            fetch(getURLForPlatform() + "api/v1/events/", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Token ' + this.props.token,
                },
                body: JSON.stringify({
                    'title': this.state.title,
                    'description': this.state.description,
                    'place': this.state.place,
                    'restrictToSameGender': this.state.restrictToGender,
                    'capacity': this.state.amount,
                    'datetime': this.state.datetime,
                    'topics': this.state.topics.map((topic) => topic.id),
                    'offers': this.state.selectedOffers,
                    'duration': duration,
                    'color': this.state.color,
                    'privacy': this.state.eventPrivacy,
                    'privacyGroup': Object.keys(this.state.group).length > 0 ? this.state.group.id : null,
                    'invitedUsers': this.state.invitedUsers
                })
            }).then(response => {
                if (response.ok) {
                    ToastAndroid.show('Event Created', ToastAndroid.SHORT)
                    this.props.navigation.goBack();
                }
            });
        }
    }

    removeTopic(index) {
        var topics = this.state.topics.slice();
        topics.splice(index, 1);
        this.setState({ topics: topics }, this.fetchOffersFromTopics);
    }

    addTopic(topic) {
        if (topic.length < 1) {
            return;
        }

        if (this.state.topics.map((topic) => topic.name.toLowerCase()).indexOf(topic.toLowerCase()) > -1) {
            return;
        }

        fetch(getURLForPlatform() + "api/v1/topics/getorcreate/?word=" + topic, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Token ' + this.props.token,
            },
        }).then(response => response.json())
            .then(responseJSON => {
                var topics = this.state.topics.slice();
                topics.push(responseJSON)
                this.setState({ topics: topics }, this.fetchOffersFromTopics);
            });
    }

    addToEvent(offer) {
        var offers = this.state.selectedOffers.slice();
        if (offers.indexOf(offer.id) === -1) {
            offers.push(offer.id);
            this.setState({ selectedOffers: offers, place: offer.place });
        }
    }

    removeFromEvent(offerID) {
        var offers = this.state.selectedOffers.slice();
        const index = offers.indexOf(offerID);
        if (index !== -1) {
            offers.splice(index, 1);
            this.setState({ selectedOffers: offers, place: {} });
        }
    }

    render() {
        const NewEventArr = [
            {
                name: "Topics",
                component: <TopicsNewEvent topics={this.state.topics} removeTopic={this.removeTopic} onChange={this.onChange} addTopic={this.addTopic} />,
                condition: (args) => true
            },
            {
                name: "Offers",
                component: <OffersNewEvent addToEvent={this.addToEvent} removeFromEvent={this.removeFromEvent} offers={this.state.offers} />,
                condition: (args) => args["offers"].length > 0
            },
            {
                name: "TitleDescColor",
                component: <TitleDescColorNewEvent onChange={this.onChange} fetchTopicsFromDescription={this.fetchTopicsFromDescription} color={this.state.color} errors={this.state.errors} />,
                condition: (args) => true
            },
            {
                name: "Place",
                component: <PlaceNewEvent onChange={this.onChange} lat={this.state.lat} long={this.state.long} place={this.state.place} session={this.state.session} selectedOffers={this.state.selectedOffers} errors={this.state.errors} />,
                condition: (args) => true
            },
            {
                name: "DateTime",
                component: <DatetimeDurationNewEvent onChange={this.onChange} datetime={this.state.datetime} duration={this.state.duration} durationMeasure={this.state.durationMeasure} errors={this.state.errors} />,
                condition: (args) => true
            },
            {
                name: "People",
                component: <PeopleNewEvent onChange={this.onChange} inviteFriends={this.inviteFriends} submitForm={this.submitForm} restrictToGender={this.state.restrictToGender} eventPrivacy={this.state.eventPrivacy} groups={this.state.groups} errors={this.state.errors} />,
                condition: (args) => true
            }
        ]
        var duration = this.state.duration;
        if (this.state.durationMeasure === 'hours') {
            duration *= 60;
        } else if (this.state.durationMeasure === 'days') {
            duration = duration * 60 * 24;
        }
        console.log(this.state)
        return (
            <Swiper nextButton={<Text>&gt;</Text>} buttonWrapperStyle={{ alignItems: 'flex-end' }} prevButton={<Text>&lt;</Text>} style={styles.wrapper} showsButtons={true} loop={false} removeClippedSubviews={false} >
                {NewEventArr.filter((item) => {
                    var args = {};
                    if (item["name"] === "Offers") {
                        args["offers"] = this.state.offers
                    }
                    if (item["condition"](args)) {
                        return true;
                    }
                    return false;
                }).map((item) => {
                    return item["component"]
                })}
            </Swiper>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
        user: state.userReducer.user
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewEvent);

