import React from 'react';

import { Content, Form, Item, Label, Button } from 'native-base';
import { ScrollView, View, Picker, ToastAndroid, KeyboardAvoidingView, Platform, PermissionsAndroid, FlatList, TouchableOpacity, Text, TextInput } from 'react-native';

import { styles } from '../../../assets/styles';
import { REACT_SWIPER_BOTTOM_MARGIN } from '../../utils/constants';
import PlatformIonicon from '../../utils/platformIonicon';
import { Dropdown } from 'react-native-material-dropdown';
import Dialog from "react-native-dialog";

export class PeopleNewEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showHelp: false
        }
    }
    render() {
        return (
            <ScrollView style={styles.flex1} keyboardShouldPersistTaps={'handled'}>
                <Dialog.Container visible={this.state.showHelp}>
                    <Dialog.Title>People Screen</Dialog.Title>
                    <Dialog.Description>
                        On this screen you can select how many people you want to join you in your event.
                        Public events can be seen by anyone, private events can only be seen by users you invite and group
                        events are only open to the group of your choice.
                        You can also choose here to only show this events to members of your gender.
                    </Dialog.Description>
                    <Dialog.Button label="Got it!" onPress={() => this.setState({ showHelp: false })} />
                </Dialog.Container>
                <View style={{ backgroundColor: '#03A9F4', flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 20, paddingVertical: 10, alignContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>People</Text>
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
                    <View style={{ margin: 10, padding: 10, backgroundColor: 'white', borderRadius: 5, shadowRadius: 2, shadowOpacity: 1, shadowColor: 'black', elevation: 2 }}>
                        {this.props.errors["eventPrivacy"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Text style={{ color: 'white' }}>{this.props.errors["eventPrivacy"]}</Text>
                        </View>}
                        {this.props.errors["group"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5, flex: 1 }}>
                                <Text style={{ color: 'white' }}>{this.props.errors["group"]}</Text>
                            </View>}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ alignSelf: 'center', flex: 3, paddingTop: 15 }}>
                                <Text style={{ fontSize: 20, color: 'black' }}>This event is set to: </Text>
                            </View>
                            <View style={{ alignSelf: 'center', flex: 2 }}>
                                <Dropdown
                                    label='Event Privacy'
                                    onChangeText={(text) => { this.props.onChange("eventPrivacy", text); if (text !== "group") this.props.onChange("group", {}) }}
                                    value={this.props.eventPrivacy}
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

                        {this.props.eventPrivacy === 'group' && this.props.groups.length > 0 && <View style={{ alignSelf: 'center', width: 300 }}>
                            <Dropdown
                                label='Which Group?'
                                onChangeText={(text) => this.props.onChange("group", text)}
                                data={this.props.groups.map((group) => {
                                    return {
                                        value: group.name,
                                        id: group.id
                                    }
                                })
                                }
                            />
                        </View>}

                        {this.props.eventPrivacy === 'group' && this.props.groups.length <= 0 && <View style={{ alignSelf: 'center', width: 300 }}>
                            <Text>You aren't part of any groups! Try joining or creating one or select a different privacy setting!</Text>
                        </View>}
                    </View>
                    <View style={{ margin: 10, padding: 10, backgroundColor: 'white', borderRadius: 5, shadowRadius: 2, shadowOpacity: 1, shadowColor: 'black', elevation: 2 }}>
                        {this.props.errors["amount"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Text style={{ color: 'white' }}>{this.props.errors["amount"]}</Text>
                        </View>}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 20, color: 'black' }}>There's room for </Text>
                            </View>
                            <View>
                                <TextInput style={{ borderBottomWidth: Platform.OS === 'ios' ? 1 : 1, fontSize: 20, minWidth: 35 }} keyboardType="numeric" name="amount" onChangeText={(text) => this.props.onChange("amount", text ? parseInt(text) : "")} />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ fontSize: 20, color: 'black' }}> people!</Text>
                            </View>
                        </View>
                    </View>

                    {this.props.user.gender !== 'Non-Binary' && <View style={{ flexDirection: 'row', margin: 10, padding: 10, backgroundColor: 'white', borderRadius: 5, shadowRadius: 2, shadowOpacity: 1, shadowColor: 'black', elevation: 2 }}>
                        <View style={{ alignSelf: 'center', flex: 3, paddingTop: 15 }}>
                            <Text style={{ fontSize: 15, color: 'black' }}>Make it a {this.props.user.gender === 'Male' ? "guy" : "girl"}s only event?</Text>
                        </View>
                        <View style={{ alignSelf: 'center', flex: 2 }}>
                            <Dropdown
                                value={this.props.restrictToGender ? "Yes" : "No"}
                                dropdownPosition={this.props.restrictToGender ? 0 : 1}
                                onChangeText={(text) => this.props.onChange("restrictToGender", text === "Yes")}
                                data={[{
                                    value: 'Yes',
                                }, {
                                    value: 'No',
                                }]}
                            />
                        </View>
                    </View>}
                </Form>
                <View style={{ marginBottom: REACT_SWIPER_BOTTOM_MARGIN }}>
                    {this.props.errors["errors"].length > 0 && <View style={{ margin: 10, backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5 }}>
                        <Text style={{ color: 'white' }}>{"There were errors with the following fields in your event: " + this.props.errors["errors"].join(', ')}</Text>
                    </View>}
                    <View style={{ flexDirection: 'row' }}>
                        <Button title="Invite" accessibilityLabel="Invite friends to your event." onPress={() => this.props.inviteFriends()} style={{ marginLeft: 10, marginRight: 10, flex: 1, justifyContent: 'center' }}>
                            <Text style={{ color: 'white' }}>Invite Friends</Text>
                        </Button>
                        <Button title="Create" accessibilityLabel="Press this button to submit your information and create a new event." onPress={() => this.props.submitForm()} style={{ flex: 1, marginRight: 10, marginLeft: 10, justifyContent: 'center' }}>
                            <Text style={{ color: 'white' }}>Submit</Text>
                        </Button>
                    </View>
                </View>
            </ScrollView >
        )
    }
}