import React from 'react';
import { Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import { ScrollView, View, Picker, ToastAndroid, KeyboardAvoidingView, Platform, PermissionsAndroid, FlatList, TouchableOpacity } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { getURLForPlatform } from '../utils/networkUtils';
import { styles } from '../../assets/styles';
import { OfferContainer } from './offerContainer';
import { REACT_SWIPER_BOTTOM_MARGIN } from '../utils/constants';
import moment from 'moment';
import debounce from 'lodash/debounce';
import RNGooglePlaces from 'react-native-google-places';
import { getCurrentLocation } from '../utils/otherUtils';

const ITEMS_TO_VALIDATE = ["title", "description", "place", "datetime", "duration", "place"];

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
            place: {}
        }
        this.onChange = this.onChange.bind(this);
        this.formIsValid = this.formIsValid.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.createTopicList = this.createTopicList.bind(this);
        this.removeTopic = this.removeTopic.bind(this);
        this.addToEvent = this.addToEvent.bind(this);
        this.removeFromEvent = this.removeFromEvent.bind(this);
        this.placeDisplay = this.placeDisplay.bind(this);
    }

    async componentDidMount() {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted) {
            const coordinates = await getCurrentLocation();
            this.setState({ lat: coordinates.latitude, long: coordinates.longitude });
        }
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
        stateRepresentation["formIsValid"] = this.formIsValid();
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
        for (var property in ITEMS_TO_VALIDATE) {
            if (this.state[ITEMS_TO_VALIDATE[property]] === "" || this.state[ITEMS_TO_VALIDATE[property]] === {}) {
                return false;
            }
        }
        return true;
    }

    submitForm() {
        // TODO: Need to give error messages
        if (this.state.formIsValid) {
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
                    'offers': this.state.selectedOffers
                })
            }).then(response => {
                if (response.ok) {
                    ToastAndroid.show('Event Created', ToastAndroid.SHORT)
                    this.props.navigation.goBack();
                }
            });
        }
    }

    getPlaces = debounce((text) => {
        var optionsItem = {
            country: 'US'
        }

        if (this.state.lat > -200 && this.state.long > -200) {
            optionsItem["latitude"] = this.state.lat;
            optionsItem["longitude"] = this.state.long;
            optionsItem["radius"] = 25;
        }

        RNGooglePlaces.getAutocompletePredictions(text, optionsItem)
            .then((results) => { console.log(results); this.setState({ placePredictions: results }) })
            .catch((error) => console.log(error.message));
    }, 250);

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        if (date - (new Date()) < 0) {
            // They picked a time in the past
            // Probably want to give an error message
            // TODO: Error message
        } else {
            this.setState({ datetime: date });
        }
        this._hideDateTimePicker();
    };

    _keyExtractor = (item, index) => item.placeID;

    _renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.setState({place: item, placePredictions: [], placeSearchText: "" })}>
            <View id={item.placeID} style={{borderBottomColor: '#333', borderBottomWidth: 1}}>
                <Text style={{padding: 5}}>{item.primaryText}</Text>
                <Text style={{padding: 5}}>{item.secondaryText}</Text>
            </View>
        </TouchableOpacity>
    );


    removeTopic(index) {
        var topics = this.state.topics.slice();
        topics.splice(index, 1);
        this.setState({ topics: topics }, this.fetchOffersFromTopics);
    }

    addTopic() {
        if (this.state.topic.length < 1) {
            return;
        }

        fetch(getURLForPlatform() + "api/v1/topics/getorcreate/?word=" + this.state.topic, {
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
                this.setState({ topics: topics, topic: "" }, this.fetchOffersFromTopics);
            });
    }

    addToEvent(offerID) {
        var offers = this.state.selectedOffers.slice();
        if (offers.indexOf(offerID) === -1) {
            offers.push(offerID);
            this.setState({ selectedOffers: offers });
        }
    }

    removeFromEvent(offerID) {
        var offers = this.state.selectedOffers.slice();
        const index = offers.indexOf(offerID)
        if (index !== -1) {
            offers.splice(index, 1);
            this.setState({ selectedOffers: offers });
        }
    }

    placeDisplay() {
        if (Object.keys(this.state.place).length > 0 && this.state.place.primaryText) {
            return this.state.place.primaryText;
        } else {
            return this.state.placeSearchText;
        }
    }

    render() {
        return (
            <Swiper nextButton={<Text>&gt;</Text>} buttonWrapperStyle={{ alignItems: 'flex-end' }} prevButton={<Text>&lt;</Text>} style={styles.wrapper} showsButtons={true} loop={false} removeClippedSubviews={false} >
                <View style={styles.flex1}>
                    <View style={styles.header}>
                        <Text style={styles.questionHeader}>What?</Text>
                        <View style={styles.tagline}>
                            <Text style={styles.taglineText}>Give us a short and a longer</Text>
                            <Text style={styles.taglineText}>description of what you want to do!</Text>
                        </View>
                    </View>
                    <View style={styles.formContainer}>
                        <Content style={styles.flex1}>
                            <Form>
                                <Item stackedLabel>
                                    <Label>Title</Label>
                                    <Input
                                        name="title"
                                        onBlur={() => this.fetchTopicsFromDescription()}
                                        onChangeText={(text) => this.onChange("title", text)}
                                    />
                                </Item>
                                <Item stackedLabel last>
                                    <Label>Full Description</Label>
                                    <Input
                                        name="description"
                                        onBlur={() => this.fetchTopicsFromDescription()}
                                        multiline={true}
                                        numberOfLines={5}
                                        onChangeText={(text) => this.onChange("description", text)}
                                    />
                                </Item>
                            </Form>
                        </Content>
                    </View>
                </View>
                <View style={styles.flex1}>
                    <KeyboardAvoidingView keyboardVerticalOffset={this.props.navigation ? 35 : 80} behavior="padding" style={styles.flex1}>
                        <View style={styles.header}>
                            <Text style={styles.questionHeader}>Topics?</Text>
                            <View style={styles.tagline}>
                                <Text style={styles.taglineText}>Which topics does</Text>
                                <Text style={styles.taglineText}>your event fit?</Text>
                            </View>
                        </View>
                        <View style={styles.formContainer}>
                            <ScrollView>
                                <View style={[styles.topicContainer, { flex: 3 }]}>
                                    {this.state.topics && this.state.topics.length > 0 && this.state.topics.map((topic, index) =>
                                        <View key={index} style={styles.topicBubble}>
                                            <PlatformIonicon
                                                name={'close-circle'}
                                                size={30}
                                                style={{ color: "white" }}
                                                onPress={() => this.removeTopic(index)}
                                            />
                                            <Text style={{ color: 'white', paddingLeft: 5 }}>{topic.name}</Text>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                            <View style={{ marginBottom: REACT_SWIPER_BOTTOM_MARGIN }}>
                                <Form style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, paddingLeft: 10 }}>
                                        <Input placeholder="Add Extra Topics Here" name="topic" value={this.state.topic} onChangeText={(text) => this.setState({ "topic": text })} />
                                    </View>
                                    <View style={{ paddingRight: 10 }}>
                                        <Button title="Add" accessibilityLabel="Press this button to add a new topic." onPress={() => this.addTopic()}>
                                            <Text>Add</Text>
                                        </Button>
                                    </View>
                                </Form>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
                <View style={styles.flex1}>
                    <View style={styles.header}>
                        <Text style={styles.questionHeader}>Offers?</Text>
                        <View style={styles.tagline}>
                            <Text style={styles.taglineText}>Do any of these standing</Text>
                            <Text style={styles.taglineText}>offers apply to your event?</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", alignSelf: "stretch" }}>
                        {this.state.offers && this.state.offers.length > 0 && <ScrollView style={styles.offerScrollContainer}>
                            {this.state.offers.map((offer, index) => {
                                return (
                                    <OfferContainer index={index} offer={offer} addable={true} addToEvent={this.addToEvent} removeFromEvent={this.removeFromEvent} />
                                )
                            })}
                        </ScrollView>
                        }

                        {this.state.offers && this.state.offers.length < 1 && <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', padding: 10 }}><Text>There are no offers for your event so far! Either add some more detail or add some extra topics and see if you can find some!</Text></View>}
                    </View>
                </View>
                <View style={styles.flex1}>
                    <View style={styles.header}>
                        <Text style={styles.questionHeader}>Where?</Text>
                        <View style={styles.tagline}>
                            <Text style={styles.taglineText}>Where is</Text>
                            <Text style={styles.taglineText}>your event at?</Text>
                        </View>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>Place</Label>
                            <Input name="place" value={this.placeDisplay()} onChangeText={(text) => { this.setState({ placeSearchText: text, place: {} }); this.getPlaces(text) }} />
                        </Item>
                    </Form>
                    <View style={{marginBottom: REACT_SWIPER_BOTTOM_MARGIN, flex: 1, backgroundColor: 'white'}}>
                        <FlatList
                            data={this.state.placePredictions}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                        />
                    </View>
                </View>
                <View style={styles.flex1}>
                    <View style={styles.header}>
                        <Text style={styles.questionHeader}>When?</Text>
                        <View style={styles.tagline}>
                            <Text style={styles.taglineText}>When do you want to have</Text>
                            <Text style={styles.taglineText}>your event and how long</Text>
                            <Text style={styles.taglineText}>will it last?</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {typeof this.state.datetime !== "string" && <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{moment(this.state.datetime.toISOString(), moment.ISO_8601).format('MMMM Do YYYY, h:mm:ss a')}</Text>}
                            {this.state.datetime.length <= 0 && <Text>No Date Selected</Text>}
                        </View>
                        <Form style={{ marginBottom: REACT_SWIPER_BOTTOM_MARGIN, paddingLeft: 10 }}>
                            <Button title="SetDateTime" accessibilityLabel="Press this button to set the date and time of your event!" onPress={this._showDateTimePicker}>
                                <Text>Pick Date and Time</Text>
                            </Button>
                        </Form>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Form>
                            <Item floatingLabel>
                                <Label>Duration</Label>
                                <Input name="place" onChangeText={(text) => this.onChange("duration", text)} />
                            </Item>
                        </Form>
                    </View>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                        minimumDate={new Date()}
                        is24Hour={false}
                        mode="datetime"
                    />
                </View>
                <View style={styles.flex1}>
                    <View style={styles.header}>
                        <Text style={styles.questionHeader}>Who?</Text>
                        <View style={styles.tagline}>
                            <Text style={styles.taglineText}>How many people are</Text>
                            <Text style={styles.taglineText}>you looking to join you?</Text>
                        </View>
                    </View>
                    <Form style={{ flex: 1 }}>
                        <Item floatingLabel>
                            <Label>Amount of People</Label>
                            <Input keyboardType="numeric" name="amount" onChangeText={(text) => this.onChange("amount", text)} />
                        </Item>
                        <View style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                            <Text>Restrict to the same gender?</Text>
                            <Picker
                                selectedValue={this.state.restrictToGender ? "true" : "false"}
                                style={{ height: 50, width: 100 }}
                                onValueChange={(itemValue, itemIndex) => this.setState({ restrictToGender: itemValue === "true" })}>
                                <Picker.Item label="Yes" value="true" />
                                <Picker.Item label="No" value="false" />
                            </Picker>
                        </View>
                    </Form>
                    <View style={{ flexDirection: 'row', marginBottom: REACT_SWIPER_BOTTOM_MARGIN }}>
                        <Button title="Invite" accessibilityLabel="Invite friends to your event." onPress={this.inviteFriends} style={{ marginLeft: 10, marginRight: 10 }}>
                            <Text>Invite Friends</Text>
                        </Button>
                        <Button title="Create" accessibilityLabel="Press this button to submit your information and create a new event." onPress={this.submitForm}>
                            <Text>Submit</Text>
                        </Button>
                    </View>
                </View>
            </Swiper>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
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

