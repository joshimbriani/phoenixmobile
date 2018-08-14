import React from 'react';

import { Content, Form, Item, Label, Button } from 'native-base';
import { ScrollView, View, Picker, ToastAndroid, KeyboardAvoidingView, Platform, PermissionsAndroid, FlatList, TouchableOpacity, Text, TextInput } from 'react-native';

import { styles } from '../../../assets/styles';
import { REACT_SWIPER_BOTTOM_MARGIN } from '../../utils/constants';
import PlatformIonicon from '../../utils/platformIonicon';
import { Dropdown } from 'react-native-material-dropdown';

export class PeopleNewEvent extends React.Component {
    render() {
        return (
            <View style={styles.flex1}>
                <View style={{ backgroundColor: '#03A9F4', flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 20, paddingVertical: 10, alignContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>People</Text>
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
                <Form style={{ flex: 1 }}>
                    <View style={{flexDirection: 'row', margin: 10, padding: 10, backgroundColor: 'white', borderRadius: 5, shadowRadius: 2, shadowOpacity: 1, shadowColor: 'black', elevation: 2}}>
                        <View>
                            <Text style={{ fontSize: 20 }}>There's room for </Text> 
                        </View>
                        <View>
                            <TextInput style={{borderBottomWidth: Platform.OS === 'ios' ? 1 : 0}} keyboardType="numeric" name="amount" onChangeText={(text) => this.props.onChange("amount", text ? parseInt(text) : 5)} />
                        </View>
                        <View>
                            <Text style={{ fontSize: 20 }}> people!</Text>
                        </View>
                    </View>  
                    
                    
                    <View style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                        <Text>Restrict to the same gender?</Text>
                        <Dropdown
                            label='Restrict to Gender'
                            value={this.props.restrictToGender ? "Yes" : "No" }
                            dropdownPosition={ this.props.restrictToGender ? 0 : 1 }
                            onChangeText={(text) => this.props.onChange("restrictToGender", text === "Yes")}
                            data={[{
                                value: 'Yes',
                            }, {
                                value: 'No',
                            }]}
                        />
                    </View>
                </Form>
                <View style={{ flexDirection: 'row', marginBottom: REACT_SWIPER_BOTTOM_MARGIN }}>
                    <Button title="Invite" accessibilityLabel="Invite friends to your event." onPress={() => this.props.inviteFriends()} style={{ marginLeft: 10, marginRight: 10, flex: 1, justifyContent: 'center' }}>
                        <Text style={{ color: 'white' }}>Invite Friends</Text>
                    </Button>
                    <Button title="Create" accessibilityLabel="Press this button to submit your information and create a new event." onPress={() => this.props.submitForm()} style={{ flex: 1, marginRight: 10, marginLeft: 10, justifyContent: 'center' }}>
                        <Text style={{ color: 'white' }}>Submit</Text>
                    </Button>
                </View>
            </View>
        )
    }
}