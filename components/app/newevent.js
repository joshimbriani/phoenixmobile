import React from 'react';
import { Container, Content, Form, Header, Item, Input, Icon, Label, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, ScrollView, StyleSheet, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
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

const ITEMS_TO_VALIDATE = ["title", "description", "place", "datetime"];

// Temp list of topics
const topics = [{id: 1, title: "Test"}, {id: 2, title: "Test1"}, {id: 3, title: "Test2"}, 
                {id: 4, title: "Test3"}, {id: 5, title: "Test4"}, {id: 6, title: "Test5"},
                {id: 7, title: "Test6"}, {id: 8, title: "Test7"}, {id: 9, title: "Test8"},
                {id: 7, title: "Test6"}, {id: 8, title: "Test7"}, {id: 9, title: "Test8"}]

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
            offers: []
        }
        this.onChange = this.onChange.bind(this);
        this.formIsValid = this.formIsValid.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.createTopicList = this.createTopicList.bind(this);
        this.fetchOffersFromTopics = this.fetchOffersFromTopics.bind(this);
    }

    // Todo: Need to decide what to do with objects thst don't exist on the DB. Right now
    // They're returned without an id tag which prevents us from 
    // this.state.topics.map(t => t.id).join(",");
    createTopicList() {
        var returnTopics = "";
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

    componentDidUpdate(nextProps, nextState) {
        if (nextState.topics !== this.state.topics) {
            this.fetchOffersFromTopics();
        }
    }

    fetchOffersFromTopics() {
        fetch(getURLForPlatform("phoenix") + "api/v1/offers/bytopic/?topicIDs=" + this.createTopicList(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
        .then(responseJSON => this.setState({offers: responseJSON["offers"]}))
    }

    fetchTopicsFromDescription() {
        fetch(getURLForPlatform("banksy") + "tags", {
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
        .then(responseJSON => this.setState({topics: responseJSON["topics"]}))
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
        console.log(this.state);
        fetch(getURLForPlatform("phoenix") + "api/v1/events/", {
            method: 'POST',
            Authorization: 'Token ' + this.props.token,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'created': Date.now(),
                'title': this.state.title,
                'description': this.state.description,
                'place': this.state.place,
                'restrictToSameGender': this.state.restrictToGender,
                'capacity': this.state.capacity,
            })
        }).then(response => {
            if (this.response.ok) {
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


    render() {
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
                                        onEndEditing={() => this.fetchTopicsFromDescription()} 
                                        onChangeText={(text) => this.onChange("title", text)} 
                                    />
                                </Item>
                                <Item stackedLabel last>
                                    <Label>Full Description</Label>
                                    <Input
                                        name="description" 
                                        onEndEditing={() => this.fetchTopicsFromDescription()} 
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

                        {this.state.offers && this.state.offers.length < 1 && <Text style={{ margin: 5 }}>There are no offers for your event so far! Add some more detail and see if you can find some!</Text>}
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
                            <View style={styles.topicContainer}>
                                {topics && topics.length > 0 && topics.map((topic, index) => 
                                    <View key={index} style={styles.topicBubble}>
                                        <Text>{topic.title}</Text>
                                    </View>
                                )}
                            </View>
                            <Form>
                                {/*<Item stackedLabel last>
                                    <Label>Add Topic</Label>
                                    <Input name="topic" onChangeText={(text) => this.onChange("title", text)} />
                                </Item>*/}
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
                            <Input name="amount" onChangeText={(text) => this.onChange("amount", text)} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Restrict to the same gender?</Label>
                            <Input name="restrictToGender" onChangeText={(text) => this.onChange("restrictToGender", text)} />
                        </Item>
                        <Button title="Invite" accessibilityLabel="Invite friends to your event." onPress={this.inviteFriends}>
                            <Text>Invite Friends</Text>
                        </Button>
                    </Form>
                    <Button title="Submit" accessibilityLabel="Press this button to submit your information and create a new event." disabled={!this.state.formIsValid} onPress={this.submitForm}>
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

