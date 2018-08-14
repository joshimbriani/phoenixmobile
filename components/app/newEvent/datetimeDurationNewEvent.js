import React from 'react';

import { Content, Form, Item, Input, Label, Button } from 'native-base';
import { ScrollView, View, Picker, ToastAndroid, KeyboardAvoidingView, Platform, PermissionsAndroid, FlatList, TouchableOpacity, Text } from 'react-native';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { REACT_SWIPER_BOTTOM_MARGIN } from '../../utils/constants';
import PlatformIonicon from '../../utils/platformIonicon';

import { styles } from '../../../assets/styles';

export class DatetimeDurationNewEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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

            <View style={styles.flex1}>
                <View style={{ backgroundColor: '#03A9F4', flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 20, paddingVertical: 10, alignContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>When</Text>
                    </View>
                    <View style={{ alignSelf: 'center', padding: 10 }}>
                        <View style={{ backgroundColor: 'white', height: 35, width: 35, borderRadius: 20 }}>
                            <PlatformIonicon
                                name={"help"}
                                size={30} //this doesn't adjust the size...?
                                style={{ color: "#607D8B", justifyContent: 'center', alignSelf: 'center' }}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                        {typeof this.props.datetime !== "string" && <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{moment(this.props.datetime.toISOString(), moment.ISO_8601).format('dddd MMMM Do YYYY, h:mm:ss a')}</Text>}
                        {this.props.datetime.length <= 0 && <Text>No Date Selected</Text>}
                    </View>
                    <Form style={{ marginBottom: REACT_SWIPER_BOTTOM_MARGIN, alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <Button title="SetDateTime" style={{ paddingHorizontal: 5 }} accessibilityLabel="Press this button to set the date and time of your event!" onPress={() => this._showDateTimePicker()}>
                            <Text style={{ color: 'white' }}>Pick Date and Time</Text>
                        </Button>
                    </Form>
                </View>
                <View style={{ flex: 1, marginBottom: REACT_SWIPER_BOTTOM_MARGIN }}>
                    <View style={{padding: 10, backgroundColor: '#03A9F4'}}>
                        <Text style={{fontSize: 20, color: 'white'}}>How long do you think this event will last?</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{ flex: 3, paddingTop: 5 }}>
                            <Form>
                                <Item>
                                    <Input name="duration" placeholder={"How many" + this.props.durationMeasure + '?'} keyboardType="numeric" value={this.props.duration.toString()} onChangeText={(text) => this.props.onChange("duration", parseInt(text))} />
                                </Item>
                            </Form>
                        </View>
                        <View style={{ flex: 2, marginTop: Platform.OS === 'ios' ? -60 : 15 }}>
                            <Picker mode="dropdown" selectedValue={this.props.durationMeasure} onValueChange={(item) => this.props.onChange("durationMeasure", item)}>
                                <Picker.Item label="Minutes" value="minutes" />
                                <Picker.Item label="Hours" value="hours" />
                                <Picker.Item label="Days" value="days" />
                            </Picker>
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
            </View>
        )
    }
}