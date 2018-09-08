import React from 'react';
import { Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import { ToastAndroid, Platform, PermissionsAndroid, Keyboard, ScrollView, View, TouchableOpacity, TextInput } from 'react-native';
import PlatformIonicon from '../../utils/platformIonicon';
import { connect } from 'react-redux';
import { getURLForPlatform } from '../../utils/networkUtils';
import { styles } from '../../../assets/styles';
import { getCurrentLocation } from '../../utils/otherUtils';

import { Dropdown } from 'react-native-material-dropdown';
import Dialog from "react-native-dialog";
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';

const ITEMS_TO_VALIDATE = ["datetime", "duration", "amount", "eventPrivacy", "group"];

class NewEventFork extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Create a Forked Event',

    });

    constructor(props) {
        super(props);

        this.state = {
            restrictToGender: false,
            amount: props.navigation.state.params.event.capacity === -1 ? 1 : props.navigation.state.params.event.capacity,
            datetime: props.navigation.state.params.event.datetime,
            formIsValid: false,
            isDateTimePickerVisible: false,
            durationMeasure: "minutes",
            duration: props.navigation.state.params.event.duration,
            eventPrivacy: props.navigation.state.params.event.privacy,
            lat: "",
            long: "",
            groups: [],
            group: {},
            invitedUsers: [],
            showHelp: false,
            errors: {
                errors: [],
                amount: "",
                group: "",
                eventPrivacy: "",
                duration: "",
                datetime: ""
            }
        }
        this.onChange = this.onChange.bind(this);
        this.formIsValid = this.formIsValid.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.inviteFriends = this.inviteFriends.bind(this);
        this.addUsersToInviteLists = this.addUsersToInviteLists.bind(this);
        this._handleDatePicked = this._handleDatePicked.bind(this);
        this._hideDateTimePicker = this._hideDateTimePicker.bind(this);
        this._showDateTimePicker = this._showDateTimePicker.bind(this);
    }

    async componentDidMount() {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted) {
                const coordinates = await getCurrentLocation();
                this.setState({ lat: coordinates.latitude, long: coordinates.longitude });
            }
        } else if (Platform.OS === 'ios') {
            // TODO: Eventually want to check permissions here
            const coordinates = await getCurrentLocation();
            this.setState({ lat: coordinates.latitude, long: coordinates.longitude });
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
        this.props.navigation.navigate('InviteUsers', { contacts: this.props.contacts, addUsersToInviteLists: this.addUsersToInviteLists, invitedUsers: this.state.invitedUsers });
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

    onChange(component, value) {
        var stateRepresentation = {};
        stateRepresentation[component] = value;
        this.setState(stateRepresentation);
    }

    formIsValid() {
        var valid = true;
        var errors = Object.assign({}, this.state.errors);
        for (var i = 0; i < ITEMS_TO_VALIDATE.length; i++) {
            if (ITEMS_TO_VALIDATE[i] === "group") {
                if (this.state.eventPrivacy === "group" && Object.keys(this.state.group).length < 1) {
                    errors["group"] = "If you indicate that this event is limited to groups, you need to add a group! If you don't have any groups created, make a new one or change the privacy setting!"
                    if (errors.errors.indexOf("Group") === -1) {
                        errors.errors.push("Group")
                    }

                    valid = false;
                }
            } else if (this.state[ITEMS_TO_VALIDATE[i]] === "" || typeof this.state[ITEMS_TO_VALIDATE[i]] === 'undefined' || ((typeof this.state[ITEMS_TO_VALIDATE[i]] === "object" && !(this.state[ITEMS_TO_VALIDATE[i]] instanceof Date)) && Object.keys(this.state[ITEMS_TO_VALIDATE[i]]).length < 1)) {

                if (ITEMS_TO_VALIDATE[i] === 'amount') {
                    errors["amount"] = "You need to have an event capacity!"
                    if (errors.errors.indexOf("Amount") === -1) {
                        errors.errors.push("Amount")
                    }
                } else if (ITEMS_TO_VALIDATE[i] === 'eventPrivacy') {
                    errors["eventPrivacy"] = "You need to set a privacy level for this event!"
                    if (errors.errors.indexOf("Event Privacy") === -1) {
                        errors.errors.push("Event Privacy")
                    }
                } else if (ITEMS_TO_VALIDATE[i] === 'duration') {
                    errors["duration"] = "You need to set how long this event will take!"
                    if (errors.errors.indexOf("Duration") === -1) {
                        errors.errors.push("Duration")
                    }
                } else if (ITEMS_TO_VALIDATE[i] === 'datetime') {
                    errors["datetime"] = "You need to mark when this event is!"
                    if (errors.errors.indexOf("Event Date & Time") === -1) {
                        errors.errors.push("Event Date & Time")
                    }
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
                    'title': this.props.navigation.state.params.event.title,
                    'description': this.props.navigation.state.params.event.description,
                    'place': this.props.navigation.state.params.event.place,
                    'restrictToSameGender': this.state.restrictToGender,
                    'capacity': this.state.amount,
                    'datetime': this.state.datetime,
                    'topics': this.props.navigation.state.params.event.topics.map((topic) => topic.id),
                    'offers': this.props.navigation.state.params.event.offers.map((offer) => offer.id),
                    'duration': duration,
                    'color': this.state.color,
                    'privacy': this.state.eventPrivacy,
                    'privacyGroup': Object.keys(this.state.group).length > 0 ? this.state.group.id : null,
                    'invitedUsers': this.state.invitedUsers,
                    'owned': true,
                    'forkedFrom': this.props.navigation.state.params.event.id
                })
            }).then(response => {
                if (response.ok) {
                    ToastAndroid.show('Event Created', ToastAndroid.SHORT)
                    this.props.navigation.goBack();
                }
            });
        }
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        if (date - (new Date()) < 0) {
            // They picked a time in the past
            // Probably want to give an error message
            // TODO: Error message
        } else {
            this.onChange("datetime", date)
        }
        this._hideDateTimePicker();
    };

    render() {
        var duration = this.state.duration;
        if (this.state.durationMeasure === 'hours') {
            duration *= 60;
        } else if (this.state.durationMeasure === 'days') {
            duration = duration * 60 * 24;
        }
        return (
            <ScrollView style={styles.flex1} keyboardShouldPersistTaps={'handled'}>
                <Dialog.Container visible={this.state.showHelp}>
                    <Dialog.Title>Forking an Event</Dialog.Title>
                    <Dialog.Description>
                        If you see an event that you want to go to but you want to change some parameters (increase amount of people that can go, change the date/time etc),
                        then fork the event! Forking the event will create a new event for the same event with the same parameters
                        but now you can make changes and invite your contacts like normal! 
                    </Dialog.Description>
                    <Dialog.Button label="Got it!" onPress={() => this.setState({ showHelp: false })} />
                </Dialog.Container>
                <View style={{ backgroundColor: '#03A9F4', flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 20, paddingVertical: 10, alignContent: 'center', alignSelf: 'center' }}>
                        <Text numberOfLines={1} style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>Fork {this.props.navigation.state.params.event.title}</Text>
                    </View>
                    <View style={{ alignSelf: 'center', padding: 10 }}>
                        <View style={{ backgroundColor: 'white', height: 35, width: 35, borderRadius: 20 }}>
                            <TouchableOpacity onPress={() => this.setState({ showHelp: true })}>
                                <PlatformIonicon
                                    name={"help"}
                                    size={30} //this doesn't adjust the size...?
                                    style={{ color: "#607D8B", justifyContent: 'center', alignSelf: 'center' }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Form style={{ flex: 1 }}>
                    <View style={{ marginTop: 10, marginHorizontal: 10, padding: 10, backgroundColor: 'white', borderRadius: 5, shadowRadius: 2, shadowOpacity: 1, shadowColor: 'black', elevation: 2 }}>
                        {this.state.errors["eventPrivacy"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Text style={{ color: 'white' }}>{this.state.errors["eventPrivacy"]}</Text>
                        </View>}
                        {this.state.errors["group"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5, flex: 1 }}>
                            <Text style={{ color: 'white' }}>{this.state.errors["group"]}</Text>
                        </View>}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ alignSelf: 'center', flex: 3, paddingTop: 15 }}>
                                <Text style={{ fontSize: 20, color: 'black' }}>This event is set to: </Text>
                            </View>
                            <View style={{ alignSelf: 'center', flex: 2 }}>
                                <Dropdown
                                    label='Event Privacy'
                                    onChangeText={(text) => { this.onChange("eventPrivacy", text); if (text !== "group") this.onChange("group", {}) }}
                                    value={this.state.eventPrivacy}
                                    data={[{
                                        value: 'public',
                                    }, {
                                        value: 'private',
                                    }, {
                                        value: 'group'
                                    }]}
                                />
                            </View>
                        </View>

                        {this.state.eventPrivacy === 'group' && this.state.groups.length > 0 && <View style={{ alignSelf: 'center', width: 300 }}>
                            <Dropdown
                                label='Which Group?'
                                onChangeText={(text) => this.onChange("group", text)}
                                data={this.state.groups.map((group) => {
                                    return {
                                        value: group.name,
                                        id: group.id
                                    }
                                })
                                }
                            />
                        </View>}

                        {this.state.eventPrivacy === 'group' && this.state.groups.length <= 0 && <View style={{ alignSelf: 'center', width: 300 }}>
                            <Text>You aren't part of any groups! Try joining or creating one or select a different privacy setting!</Text>
                        </View>}
                    </View>
                    <View style={{ marginTop: 10, marginHorizontal: 10, padding: 10, backgroundColor: 'white', borderRadius: 5, shadowRadius: 2, shadowOpacity: 1, shadowColor: 'black', elevation: 2 }}>
                        {this.state.errors["amount"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Text style={{ color: 'white' }}>{this.state.errors["amount"]}</Text>
                        </View>}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 20, color: 'black' }}>There's room for </Text>
                            </View>
                            <View>
                                <TextInput style={{ borderBottomWidth: Platform.OS === 'ios' ? 1 : 0, fontSize: 20, minWidth: 35 }} keyboardType="numeric" name="amount" value={this.state.amount.toString()} onChangeText={(text) => this.onChange("amount", text ? parseInt(text) : "")} />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 20, color: 'black' }}> people!</Text>
                            </View>
                        </View>
                    </View>

                    {this.props.details.gender !== 'Non-Binary' && <View style={{ flexDirection: 'row', margin: 10, padding: 10, backgroundColor: 'white', borderRadius: 5, shadowRadius: 2, shadowOpacity: 1, shadowColor: 'black', elevation: 2 }}>
                        <View style={{ alignSelf: 'center', flex: 3, paddingTop: 15 }}>
                            <Text style={{ fontSize: 15, color: 'black' }}>Make it a {this.props.details.gender === 'Male' ? "guy" : "girl"}s only event?</Text>
                        </View>
                        <View style={{ alignSelf: 'center', flex: 2 }}>
                            <Dropdown
                                value={this.state.restrictToGender ? "Yes" : "No"}
                                dropdownPosition={this.state.restrictToGender ? 0 : 1}
                                onChangeText={(text) => this.onChange("restrictToGender", text === "Yes")}
                                data={[{
                                    value: 'Yes',
                                }, {
                                    value: 'No',
                                }]}
                            />
                        </View>
                    </View>}
                </Form>
                <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: 'white', margin: 10, borderRadius: 5, paddingTop: 20, paddingBottom: 15, shadowRadius: 2, shadowOpacity: 1, shadowColor: 'black', elevation: 2 }}>
                        {this.state.errors["datetime"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5, marginHorizontal: 30 }}>
                            <Text style={{ color: 'white' }}>{this.state.errors["datetime"]}</Text>
                        </View>}
                        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', paddingBottom: 20, paddingTop: 5 }}>
                            {typeof this.state.datetime !== "string" && <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'black' }}>{moment(this.state.datetime.toISOString(), moment.ISO_8601).format('dddd MMMM Do YYYY, h:mm:ss a')}</Text>}
                            {this.state.datetime.length > 0 && <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'black' }}>{moment(this.state.datetime).format('dddd MMMM Do YYYY, h:mm:ss a')}</Text>}
                            {this.state.datetime.length <= 0 && <Text style={{ color: 'black' }}>No Date Selected</Text>}
                        </View>
                        <Form style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', flex: 1, paddingTop: 20 }}>
                            <Button title="SetDateTime" style={{ paddingHorizontal: 5 }} accessibilityLabel="Press this button to set the date and time of your event!" onPress={() => this._showDateTimePicker()}>
                                <Text style={{ color: 'white' }}>Pick Date and Time</Text>
                            </Button>
                        </Form>
                    </View>
                </View>
                <View style={{ flex: 1, marginHorizontal: 10, backgroundColor: 'white', borderRadius: 5, padding: 20, shadowRadius: 2, shadowOpacity: 1, shadowColor: 'black', elevation: 2 }}>
                    {this.state.errors["duration"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5 }}>
                        <Text style={{ color: 'white' }}>{this.state.errors["duration"]}</Text>
                    </View>}
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontSize: 15, color: 'black' }}>How long do you think this event will last?</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 2, paddingTop: 5 }}>
                            <Form>
                                <Item>
                                    <Input name="duration" keyboardType="numeric" value={this.state.duration.toString()} onChangeText={(text) => this.onChange("duration", parseInt(text))} />
                                </Item>
                            </Form>
                        </View>
                        <View style={{ flex: 2, marginTop: -6, marginLeft: 5 }}>
                            <Dropdown
                                value={this.state.durationMeasure}
                                onChangeText={(text) => this.onChange("durationMeasure", text)}
                                data={[{
                                    value: 'minutes',
                                }, {
                                    value: 'hours',
                                }, {
                                    value: 'days'
                                }]}
                            />
                        </View>
                    </View>
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    minimumDate={new Date()}
                    is24Hour={false}
                    mode="datetime"
                />
                <View style={{marginVertical: 10}}>
                    {this.state.errors["errors"].length > 0 && <View style={{ margin: 10, backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5 }}>
                        <Text style={{ color: 'white' }}>{"There were errors with the following fields in your event: " + this.state.errors["errors"].join(', ')}</Text>
                    </View>}
                    <View style={{ flexDirection: 'row' }}>
                        <Button title="Invite" accessibilityLabel="Invite friends to your event." onPress={() => this.inviteFriends()} style={{ marginLeft: 10, marginRight: 10, flex: 1, justifyContent: 'center' }}>
                            <Text style={{ color: 'white' }}>Invite Friends</Text>
                        </Button>
                        <Button title="Create" accessibilityLabel="Press this button to submit your information and create a new event." onPress={() => this.submitForm()} style={{ flex: 1, marginRight: 10, marginLeft: 10, justifyContent: 'center' }}>
                            <Text style={{ color: 'white' }}>Submit</Text>
                        </Button>
                    </View>
                </View>
            </ScrollView >
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
        user: state.userReducer.user,
        contacts: state.userReducer.contacts,
        details: state.userReducer.details
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewEventFork);

