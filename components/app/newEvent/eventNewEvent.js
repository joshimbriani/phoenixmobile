import React from 'react';

import { Content, Form, Item, Input, Label, Textarea } from 'native-base';
import { ScrollView, View, Dimensions, Text, TouchableOpacity, Button } from 'react-native';
import PlatformIonicon from '../../utils/platformIonicon';
import ColorPicker from '../../utils/ColorPicker';
import { materialColors } from '../../utils/styleutils';
import Dialog from "react-native-dialog";
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { connect } from 'react-redux';

import { styles } from '../../../assets/styles';

class EventNewEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showHelp: false,
            isDateTimePickerVisible: false
        }

        this._handleDatePicked = this._handleDatePicked.bind(this);
        this._hideDateTimePicker = this._hideDateTimePicker.bind(this);
        this._showDateTimePicker = this._showDateTimePicker.bind(this);

    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        if (date - (new Date()) < 0) {
            // They picked a time in the past
            // Probably want to give an error message
            // TODO: Error message
        } else {
            this.props.onChange("datetime", date)
        }
        this._hideDateTimePicker();
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.flex1} keyboardShouldPersistTaps={'handled'}>
                    <Dialog.Container visible={this.state.showHelp}>
                        <Dialog.Title>Create an Event</Dialog.Title>
                        <Dialog.Description>
                            Events are meant for goings-on that you aren't planning on going to or don't want to be responsible for a group.
                            Adding events that are happening in your area increases your points and helps out other Koota users in your area!
                    </Dialog.Description>
                        <Dialog.Button label="Got it!" onPress={() => this.setState({ showHelp: false })} />
                    </Dialog.Container>
                    <View style={{ backgroundColor: '#03A9F4', flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingLeft: 20, paddingVertical: 10, alignContent: 'center', alignSelf: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>New Event</Text>
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
                    <View style={styles.formContainer}>
                        <View style={{ margin: 10, padding: 10, backgroundColor: 'white', borderRadius: 5, shadowRadius: 2, shadowOpacity: 1, shadowColor: 'black', elevation: 2 }}>
                            <Content style={styles.flex1} keyboardShouldPersistTaps={'handled'}>
                                <Form>
                                    <Item stackedLabel>
                                        {this.props.errors["title"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 30, paddingVertical: 5 }}>
                                            <Text style={{ color: 'white' }}>{this.props.errors["title"]}</Text>
                                        </View>}
                                        <Label>Title</Label>
                                        <Input
                                            name="title"
                                            //onBlur={() => this.props.fetchTopicsFromDescription()}
                                            onChangeText={(text) => this.props.onChange("title", text)}
                                        />
                                    </Item>
                                    <Item stackedLabel last>
                                        {this.props.errors["description"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 30, paddingVertical: 5 }}>
                                            <Text style={{ color: 'white' }}>{this.props.errors["description"]}</Text>
                                        </View>}
                                        <Label>Full Description</Label>
                                        <Textarea
                                            style={{ width: '90%' }}
                                            name="description"
                                            placeholder="Tell us more about what you want to do!"
                                            //onBlur={() => this.props.fetchTopicsFromDescription()}
                                            rowSpan={5}
                                            bordered
                                            onChangeText={(text) => this.props.onChange("description", text)}
                                        />
                                    </Item>
                                    <View style={{ padding: 15 }}>
                                        {this.props.errors["place"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 30, paddingVertical: 5 }}>
                                            <Text style={{ color: 'white' }}>{this.props.errors["place"]}</Text>
                                        </View>}
                                        <Text>Place</Text>
                                        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', paddingBottom: 20, paddingTop: 5 }}>
                                            {Object.keys(this.props.place).length > 0 && <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'black' }}>{this.props.place.structured_formatting.main_text}</Text>}
                                            {Object.keys(this.props.place).length <= 0 && <Text style={{ color: 'black' }}>No Place Selected</Text>}
                                        </View>
                                        <View style={{ padding: 20 }}>
                                            <Button
                                                onPress={() => this.props.navigation.navigate('NewEventPlaceStandalone', { place: this.props.place, onChange: this.props.onChange, lat: this.props.lat, long: this.props.long })}
                                                title="Choose Place"
                                                color="#03A9F4"
                                                accessibilityLabel="Choose a place by clicking this button"
                                            />
                                        </View>
                                    </View>
                                    <View style={{ padding: 15 }}>
                                        {this.props.errors["datetime"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 30, paddingVertical: 5 }}>
                                            <Text style={{ color: 'white' }}>{this.props.errors["datetime"]}</Text>
                                        </View>}
                                        <Text>Date/Time</Text>
                                        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', paddingBottom: 20, paddingTop: 5 }}>
                                            {typeof this.props.datetime !== "string" && <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'black' }}>{moment(this.props.datetime.toISOString(), moment.ISO_8601).format('dddd MMMM Do YYYY, h:mm:ss a')}</Text>}
                                            {typeof this.props.datetime === "string" && <Text style={{ color: 'black' }}>No Date Selected</Text>}
                                        </View>
                                        <View style={{ padding: 20 }}>
                                            <Button
                                                onPress={() => this._showDateTimePicker()}
                                                title="Choose Date/Time"
                                                color="#03A9F4"
                                                accessibilityLabel="Choose a date/time by clicking this button"
                                            />
                                        </View>
                                    </View>
                                </Form>
                            </Content>
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
                </ScrollView>
                <View>
                    <Button
                        onPress={() => this.props.createEvent()}
                        title="Create Event"
                        color="#03A9F4"
                        accessibilityLabel="Create an event by clicking this button"
                    />
                </View>
            </View>
        )
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
)(EventNewEvent);