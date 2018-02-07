import React from 'react';
import { Container, Content, Form, Header, Item, Input, Icon, Label, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';
import Swiper from 'react-native-swiper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import fontBasedOnPlatform from '../utils/fontBasedOnPlatform';
import { getURLForPlatform } from '../utils/networkUtils';

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
            topics: []
        }
        this.onChange = this.onChange.bind(this);
        this.formIsValid = this.formIsValid.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    onChange(component, value) {
        var stateRepresentation = {};
        stateRepresentation[component] = value;
        stateRepresentation["formIsValid"] = this.formIsValid();
        this.setState(stateRepresentation);
    }

    fetchTopicsFromDescription() {
        fetch(getURLForPlatform() + "api/v1/events/topicByDescription/", {
            method: 'POST',
            Authorization: 'Token ' + this.props.token,
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
        fetch(getURLForPlatform() + "api/v1/events", {
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
            <Swiper nextButton={<Text>&gt;</Text>} prevButton={<Text>&lt;</Text>} style={styles.wrapper} showsButtons={true} loop={false} removeClippedSubviews={false} >
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
                                        style={{ height: 330, width: 300 }} 
                                        name="description" 
                                        onEndEditing={() => this.fetchTopicsFromDescription()} 
                                        multiline={true} 
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
                    <View>
                        <Text>Sub List for standing offers</Text>
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

const styles = StyleSheet.create({
    listitem: {
        alignSelf: 'stretch',
        height: 200,
    },
    flex1: {
        flex: 1,
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    itemText: {
        color: 'white',
        fontSize: 40,
        paddingTop: 5,
        textAlign: 'center',
        fontFamily: 'Roboto_medium'
    },
    header: {
        flexDirection: 'row'
    },
    questionHeader: {
        fontFamily: fontBasedOnPlatform(),
        fontSize: 40,
        marginTop: 10,
        marginLeft: 10
    },
    tagline: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 1,
        marginTop: 15,
        marginRight: 20
    },
    taglineText: {
        fontSize: 10,
        fontWeight: '300'
    },
    formContainer: {
        flex: 1,
    }

});
