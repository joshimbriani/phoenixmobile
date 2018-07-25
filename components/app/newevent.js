import React from 'react';
import { Container, Content, Form, Header, Item, Input, Icon, Label, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, ScrollView, StyleSheet, TextInput, TouchableHighlight, TouchableOpacity, View, Picker, ToastAndroid } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';
import Swiper from 'react-native-swiper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import fontBasedOnPlatform from '../utils/fontBasedOnPlatform';
import { getURLForPlatform } from '../utils/networkUtils';
import { styles } from '../../assets/styles';

import { _debouncedSearch } from '../utils/textUtils';

const ITEMS_TO_VALIDATE = ["title", "description", "place", "datetime"];

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
            topic: ""
        }
        this.onChange = this.onChange.bind(this);
        this.formIsValid = this.formIsValid.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.createTopicList = this.createTopicList.bind(this);
        this.removeTopic = this.removeTopic.bind(this);
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
        .then(responseJSON => {console.log(responseJSON["tags"].topics); this.setState({topics: JSON.parse(responseJSON["tags"])["topics"], offers: JSON.parse(responseJSON["offers"])["offers"]})})
    }

    formIsValid() {
        for (var property in ITEMS_TO_VALIDATE) {
            if (this.state[ITEMS_TO_VALIDATE[property]] === "") {
                return false;
            }
        }
        return true;
    }

    submitForm() {
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
                'capacity': this.state.capacity,
                'datetime': this.state.datetime,
                'topics': this.state.topics.map((topic) => topic.id)
            })
        }).then(response => {
            if (response.ok) {
                ToastAndroid.show('Event Created', ToastAndroid.SHORT)
                this.props.navigation.goBack();
            }
        });
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({ datetime: date });
        this._hideDateTimePicker();
    };

    removeTopic(index) {
        var topics = this.state.topics.slice();
        topics.splice(index, 1);
        this.setState({topics: topics});
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
            this.setState({topics: topics, topic: ""});
        });
    }

    render() {
        console.log(this.state.offers)
        return (
            <Swiper nextButton={<Text>&gt;</Text>} buttonWrapperStyle={{alignItems: 'flex-end'}} prevButton={<Text>&lt;</Text>} style={styles.wrapper} showsButtons={true} loop={false} removeClippedSubviews={false} >
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
                    <View style={styles.header}>
                        <Text style={styles.questionHeader}>Offers?</Text>
                        <View style={styles.tagline}>
                            <Text style={styles.taglineText}>Do any of these standing</Text>
                            <Text style={styles.taglineText}>offers apply to your event?</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: "row", flexWrap: "wrap", alignSelf: "stretch"}}>
                        {this.state.offers && this.state.offers.length > 0 && <ScrollView style={styles.offerScrollContainer}>
                            {this.state.offers.map((offer, index) => {
                                return (
                                    <View key={index} style={styles.offerItemContainer}>
                                        <Text>{offer.name}</Text>
                                    </View>
                                )
                            })}
                            </ScrollView>
                        }

                        {this.state.offers && this.state.offers.length < 1 && <Text style={{ margin: 5 }}>There are no offers for your event so far! Either add some more detail or add some extra topics and see if you can find some!</Text>}
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
                            <Input name="place" onChangeText={(text) => this.onChange("place", text)} />
                        </Item>
                    </Form>
                </View>
                <View style={styles.flex1}>
                    <View style={styles.header}>
                        <Text style={styles.questionHeader}>When?</Text>
                        <View style={styles.tagline}>
                            <Text style={styles.taglineText}>When do you want</Text>
                            <Text style={styles.taglineText}>to have your event?</Text>
                        </View>
                    </View>
                    <Form>
                        <Button title="SetDateTime" accessibilityLabel="Press this button to set the date and time of your event!" onPress={this._showDateTimePicker}>
                            <Text>Pick Date and Time</Text>
                        </Button>
                    </Form>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                        mode="datetime"
                    />
                </View>
                <View style={styles.flex1}>
                    <View style={styles.header}>
                        <Text style={styles.questionHeader}>Topics?</Text>
                        <View style={styles.tagline}>
                            <Text style={styles.taglineText}>Which topics does</Text>
                            <Text style={styles.taglineText}>your event fit?</Text>
                        </View>
                    </View>
                    <View style={styles.formContainer}>
                        <Content style={styles.flex1}>
                            <View style={[styles.topicContainer, {flex: 3}]}>
                                {this.state.topics && this.state.topics.length > 0 && this.state.topics.map((topic, index) => 
                                    <View key={index} style={styles.topicBubble}>
                                        <PlatformIonicon
                                            name={'close-circle'}
                                            size={30}
                                            style={{ color: "white" }}
                                            onPress={() => this.removeTopic(index)}
                                        />
                                        <Text style={{color: 'white', paddingLeft: 5}}>{topic.name}</Text>
                                    </View>
                                )}
                            </View>
                            <Form style={{flex: 1}}>
                                <Item stackedLabel last>
                                    <Label>Add Topic</Label>
                                    <Input name="topic" value={this.state.topic} onChangeText={(text) => this.setState({"topic": text})} />
                                </Item>
                                <Button title="Add" accessibilityLabel="Press this button to add a new topic." onPress={() => this.addTopic()}>
                                    <Text>Add</Text>
                                </Button>
                            </Form>
                        </Content>
                    </View>
                </View>
                <View style={styles.flex1}>
                    <View style={styles.header}>
                        <Text style={styles.questionHeader}>Who?</Text>
                        <View style={styles.tagline}>
                            <Text style={styles.taglineText}>How many people are</Text>
                            <Text style={styles.taglineText}>you looking to join you?</Text>
                        </View>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>Amount of People</Label>
                            <Input keyboardType="numeric" name="amount" onChangeText={(text) => this.onChange("amount", text)} />
                        </Item>
                        <Text>Restrict to the same gender?</Text>
                            <Picker
                                selectedValue={this.state.restrictToGender ? "true" : "false"}
                                style={{ height: 50, width: 100 }}
                                onValueChange={(itemValue, itemIndex) => this.setState({restrictToGender: itemValue === "true"})}>
                                <Picker.Item label="Yes" value="true" />
                                <Picker.Item label="No" value="false" />
                            </Picker>
                        <Button title="Invite" accessibilityLabel="Invite friends to your event." onPress={this.inviteFriends}>
                            <Text>Invite Friends</Text>
                        </Button>
                    </Form>
                    <Button title="Create" accessibilityLabel="Press this button to submit your information and create a new event." disabled={!this.state.formIsValid} onPress={this.submitForm}>
                        <Text>Submit</Text>
                    </Button>
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

