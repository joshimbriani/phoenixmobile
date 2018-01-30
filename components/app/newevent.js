import React from 'react';
import { Container, Content, Form, Header, Item, Input, Icon, Label, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';
import Swiper from 'react-native-swiper';

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

    formIsValid() {
        for (var property in ITEMS_TO_VALIDATE) {
            if (this.state[ITEMS_TO_VALIDATE[property]] === "") {
                return false;
            }
        }
        return true;
    }

    submitForm() {
        console.log("Submit Form");
        console.log(this.state);
    }

    render() {
        return (
            <Swiper nextButton={<Text>&gt;</Text>} prevButton={<Text>&lt;</Text>} style={styles.wrapper} showsButtons={true} loop={false} removeClippedSubviews={false} >
                <View>
                    <View style={[styles.header, { backgroundColor: "red" }]}>
                        <Text style={styles.h1}>What?</Text>
                        <Text style={styles.h2}>Give us a short and a longer description of what you want to do!</Text>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>Title</Label>
                            <Input name="title" onChangeText={(text) => this.onChange("title", text)} />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Full Description</Label>
                            <Input style={{
                                width: 200, height: 500
                            }} name="description" multiline={true} onChangeText={(text) => this.onChange("description", text)} />
                        </Item>
                    </Form>
                </View>
                <View>
                    <View style={[styles.header, { backgroundColor: "red" }]}>
                        <Text style={styles.h1}>Standing Offers?</Text>
                        <Text style={styles.h2}>Any of these standing offers from businesses apply? You could save money if you choose one!</Text>
                    </View>
                    <View>
                        <Text>Sub List for standing offers</Text>
                    </View>
                </View>
                <View>
                    <View style={[styles.header, { backgroundColor: "red" }]}>
                        <Text style={styles.h1}>Where?</Text>
                        <Text style={styles.h2}>Where is your event at?</Text>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>Place</Label>
                            <Input name="place" onChangeText={(text) => this.onChange("place", text)} />
                        </Item>
                    </Form>
                </View>
                <View>
                    <View style={[styles.header, { backgroundColor: "red" }]}>
                        <Text style={styles.h1}>When?</Text>
                        <Text style={styles.h2}>When do you wanna have your event?</Text>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>Time</Label>
                            <Input name="datetime" onChangeText={(text) => this.onChange("datetime", text)} />
                        </Item>
                    </Form>
                </View>
                <View>
                    <View style={[styles.header, { backgroundColor: "red" }]}>
                        <Text style={styles.h1}>Who?</Text>
                        <Text style={styles.h2}>How many people are you looking to do your event with?</Text>
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
    wrapper: {
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
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
    }

});
