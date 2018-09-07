import React from 'react';
import { connect } from 'react-redux';
import { Platform, Text, Dimensions, View, TouchableOpacity, ScrollView, Button, ToastAndroid, AlertIOS } from 'react-native';
import { styles } from '../../../assets/styles';
import SettingsList from 'react-native-settings-list';
import PlatformIonicon from '../../utils/platformIonicon';
import SwitchSelector from 'react-native-switch-selector';
import Collapsible from 'react-native-collapsible';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import CheckBox from 'react-native-check-box';
import { bindActionCreators } from 'redux';
import * as userActions from '../../../redux/actions/user';

class FilterHome extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Filter",
    });

    constructor(props) {
        super(props);

        this.state = {
            collapsed: [true, true, true, true],
            datetime: props.filter.datetime || {
                start: -1,
                end: -1
            },
            duration: props.filter.duration || {
                moreThan: 0,
                lessThan: 300
            },
            capacity: props.filter.capacity || 1,
            topics: props.filter.topics || {
                type: 'all',
                topics: []
            },
            isDateTimePickerVisible: false,
            dateType: '',
            checked: props.filter.datetime.endDate !== -1 || false,
            privacy: props.filter.privacy || 'all',
            offer: props.filter.offer || 'all',
            restrictToGender: props.filter.restrictToGender || 'all'
        }

        this._handleDatePicked = this._handleDatePicked.bind(this);
        this._hideDateTimePicker = this._hideDateTimePicker.bind(this);
        this._showDateTimePicker = this._showDateTimePicker.bind(this);
    }

    _showDateTimePicker = (startOrEnd) => this.setState({ isDateTimePickerVisible: true, dateType: startOrEnd });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false, dateType: '' });

    _handleDatePicked = (date) => {
        if (this.state.dateType === 'start') {
            var startDate = date;
            if (this.state.datetime.end !== -1 && this.state.datetime.end - date < 0) {
                //They set an end time earlier than a start time. Error message and return
                if (Platform.OS === 'android') {
                    ToastAndroid.show("Please select a date earlier than the end date.", ToastAndroid.SHORT);
                } else if (Platform.OS === 'ios') {
                    AlertIOS.alert(
                        'Error',
                        'Please select a date earlier than the end date.'
                    );
                }
                this._hideDateTimePicker();
                return;
            }
            if (date - (new Date()) < 0) {
                //They set the start date to today
                startDate = -1
            } else {
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);
            }
            this.setState({ datetime: { start: startDate, end: this.state.datetime.end } });
            this.props.navigation.state.params.setFilter("datetime", { start: startDate, end: this.state.datetime.end })
        } else if (this.state.dateType === 'end') {
            var endDate = date;
            if (this.state.datetime.start !== -1 && date - this.state.datetime.start < 0) {
                //They set an end time earlier than a start time. Error message and return
                if (Platform.OS === 'android') {
                    ToastAndroid.show("Please select a date later than the start date.", ToastAndroid.SHORT);
                } else if (Platform.OS === 'ios') {
                    AlertIOS.alert(
                        'Error',
                        'Please select a date later than the start date.'
                    );
                }
                this._hideDateTimePicker();
                return;
            }
            if (date - (new Date()) < 0) {
                //They set the start date to today
                endDate = -1
            } else {
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);
            }
            
            this.setState({ datetime: { start: this.state.datetime.start, end: endDate } })
            this.props.navigation.state.params.setFilter("datetime", { start: this.state.datetime.start, end: date })
        }
        this._hideDateTimePicker();
    };

    setFiltersAsDefault() {
        this.props.userActions.saveUserFilter({datetime: this.state.datetime, duration: this.state.duration, capacity: this.state.capacity, topics: this.state.topics, privacy: this.state.privacy, offer: this.state.offer, restrictToGender: this.state.restrictToGender})
        this.props.navigation.state.params.loadEvents();
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flexDirection: 'column', backgroundColor: 'white', flex: 1 }}>
                    <View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('FilterTopics', { setFilter: (key, value) => {this.props.navigation.state.params.setFilter(key, value); this.setState({ topics: value })}, customTopics: this.state.topics.topics, topicType: this.state.topics.type })}>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', padding: 20 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>Topic</Text>
                                </View>
                                <View style={{ justifyContent: 'center', marginRight: 10 }}>
                                    <Text>{this.state.topics.type.charAt(0).toUpperCase() + this.state.topics.type.substr(1)}</Text>
                                </View>
                                <View style={{ justifyContent: 'center', marginRight: 20 }}>
                                    <PlatformIonicon
                                        name="arrow-forward"
                                        style={{ color: 'black' }}
                                        size={35}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => this.setState({ collapsed: [this.state.collapsed[0], !this.state.collapsed[1], this.state.collapsed[2], this.state.collapsed[3]] })}>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: this.state.collapsed[1] ? 'black' : 'gray' }}>
                                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', padding: 20 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>Date/Time</Text>
                                </View>
                                <View style={{ justifyContent: 'center', marginRight: 10 }}>
                                    <Text>{this.state.datetime.start === -1 && 'Today'}{this.state.datetime.start !== -1 && moment(this.state.datetime.start).format('MM/DD/YYYY')} {this.state.datetime.end === -1 && 'onward'}{this.state.datetime.end !== -1 && 'to ' + moment(this.state.datetime.end).format('MM/DD/YYYY')}</Text>
                                </View>
                                <View style={{ justifyContent: 'center', marginRight: 20 }}>
                                    <PlatformIonicon
                                        name={this.state.collapsed[1] ? "arrow-forward" : "arrow-down"}
                                        style={{ color: 'black' }}
                                        size={35}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Collapsible collapsed={this.state.collapsed[1]}>
                            <View>
                                <View style={{ alignItems: 'center', flexDirection: 'row', maxWidth: '80%' }}>
                                    <CheckBox
                                        style={{ padding: 10 }}
                                        onClick={() => {
                                            if (this.state.checked) {
                                                // It was checked but now it isn't. So set end datetime to -1
                                                this.setState({ datetime: { start: this.state.datetime.start, end: -1 } })
                                                this.props.navigation.state.params.setFilter("datetime", { start: this.state.datetime.start, end: -1 })
                                            }
                                            this.setState({ checked: !this.state.checked })
                                        }}
                                        isChecked={this.state.checked}
                                    />
                                    <Text>Include a Date Range</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 150, margin: 5 }}>
                                        <Button
                                            onPress={() => this._showDateTimePicker('start')}
                                            title="Select Start Date/Time"
                                            color="#00ABE6"
                                            accessibilityLabel="Set the start time for your filter"
                                        />
                                    </View>
                                    {this.state.checked && <View style={{ width: 150, margin: 5 }}>
                                        <Button
                                            onPress={() => this._showDateTimePicker('end')}
                                            title="Select End Date/Time"
                                            color="#00ABE6"
                                            accessibilityLabel="Set the end time for your filter"
                                        />
                                    </View>}
                                </View>
                            </View>
                        </Collapsible>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => this.setState({ collapsed: [this.state.collapsed[0], this.state.collapsed[1], !this.state.collapsed[2], this.state.collapsed[3]] })}>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: this.state.collapsed[2] ? 'black' : 'gray' }}>
                                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', padding: 20 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>Duration</Text>
                                </View>
                                <View style={{ justifyContent: 'center', marginRight: 10 }}>
                                    <Text>{this.state.duration.moreThan === 0 && this.state.duration.lessThan === 300 && 'Any'}{this.state.duration.moreThan !== 0 && "> " + this.state.duration.moreThan + " minutes"}{this.state.duration.moreThan !== 0 && this.state.duration.lessThan !== 300 && ' & '}{this.state.duration.lessThan !== 300 && "< " + this.state.duration.lessThan + " minutes"}</Text>
                                </View>
                                <View style={{ justifyContent: 'center', marginRight: 20 }}>
                                    <PlatformIonicon
                                        name={this.state.collapsed[2] ? "arrow-forward" : "arrow-down"}
                                        style={{ color: 'black' }}
                                        size={35}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Collapsible collapsed={this.state.collapsed[2]}>
                            <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, height: 50 }}>
                                <MultiSlider
                                    values={[this.state.duration.moreThan, this.state.duration.lessThan]}
                                    sliderLength={280}
                                    onValuesChange={(values) => { this.setState({ duration: { moreThan: values[0], lessThan: values[1] } }); this.props.navigation.state.params.setFilter("duration", { moreThan: values[0], lessThan: values[1] }) }}
                                    min={0}
                                    max={300}
                                    step={15}
                                    allowOverlap
                                    snapped
                                />
                            </View>
                        </Collapsible>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => this.setState({ collapsed: [this.state.collapsed[0], this.state.collapsed[1], this.state.collapsed[2], !this.state.collapsed[3]] })}>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: this.state.collapsed[2] ? 'black' : 'gray' }}>
                                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', padding: 20 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>Capacity</Text>
                                </View>
                                <View style={{ justifyContent: 'center', marginRight: 10 }}>
                                    <Text>{'Room for at least ' + this.state.capacity}</Text>
                                </View>
                                <View style={{ justifyContent: 'center', marginRight: 20 }}>
                                    <PlatformIonicon
                                        name={this.state.collapsed[3] ? "arrow-forward" : "arrow-down"}
                                        style={{ color: 'black' }}
                                        size={35}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Collapsible collapsed={this.state.collapsed[3]}>
                            <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, height: 50 }}>
                                <MultiSlider
                                    values={[this.state.capacity]}
                                    sliderLength={280}
                                    onValuesChange={(values) => { this.setState({ capacity: values[0] }); this.props.navigation.state.params.setFilter("capacity", values[0]) }}
                                    min={1}
                                    max={20}
                                    step={1}
                                    snapped
                                />
                            </View>
                        </Collapsible>
                    </View>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                        <View style={{ alignItems: 'flex-start', justifyContent: 'center', padding: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>Privacy Setting</Text>
                        </View>
                        <View style={{ justifyContent: 'center', marginRight: 20, flex: 1, padding: 5 }}>
                            <SwitchSelector options={[
                                { label: 'All', value: 'all' },
                                { label: 'Private', value: 'private' },
                                { label: 'Group', value: 'group' }
                            ]} hasPadding={true} initial={this.state.privacy === 'all' ? 0 : this.state.privacy === 'private' ? 1 : 2} buttonColor={"#00ABE6"} onPress={value => {this.setState({privacy: value}); this.props.navigation.state.params.setFilter("privacy", value)}} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                        <View style={{ alignItems: 'flex-start', justifyContent: 'center', padding: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>Has Offer</Text>
                        </View>
                        <View style={{ justifyContent: 'center', marginRight: 20, flex: 1, padding: 5 }}>
                            <SwitchSelector options={[
                                { label: 'All', value: 'all' },
                                { label: 'Has Offer', value: 'offer' }
                            ]} initial={this.state.offer === 'all' ? 0 : 1} hasPadding={true} buttonColor={"#00ABE6"} onPress={value => {this.setState({offer: value}); this.props.navigation.state.params.setFilter("offer", value)}} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ alignItems: 'flex-start', justifyContent: 'center', padding: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>Just {this.props.details.gender === 'Male' ? "guys" : "girls"}?</Text>
                        </View>
                        <View style={{ justifyContent: 'center', marginRight: 20, flex: 1, padding: 5 }}>
                            <SwitchSelector options={[
                                { label: 'No', value: 'all' },
                                { label: 'Yes', value: this.props.details.gender }
                            ]} initial={this.state.restrictToGender === 'all' ? 0 : 1} hasPadding={true} buttonColor={"#00ABE6"} onPress={value => {this.setState({restrictToGender: value}); this.props.navigation.state.params.setFilter("restrictToGender", value)}} />
                        </View>
                    </View>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                        minimumDate={new Date()}
                        is24Hour={false}
                        mode="date"
                    />
                </ScrollView>
                <View style={{ backgroundColor: 'white', padding: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' }}>
                        <Button
                            onPress={() => {this.props.navigation.goBack(); this.props.navigation.state.params.loadEvents();}}
                            title="Search With Filters"
                            color="#00ABE6"
                            accessibilityLabel="Search with your currently defined filters"
                        />
                        {this.props.navigation.state.params.default && <Button
                            onPress={() => this.setFiltersAsDefault()}
                            title="Set Filters as Default"
                            color="#00ABE6"
                            accessibilityLabel="Set your currently applied filters as your home screen"
                        />}
                    </View>
                </View>
            </View>

        )
    }
}


function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
        details: state.userReducer.details,
        filter: state.userReducer.filter
    };
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterHome);