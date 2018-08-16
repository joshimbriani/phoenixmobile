import React from 'react';

import { Content, Form, Item, Input, Label, Button } from 'native-base';
import { ScrollView, View, Picker, ToastAndroid, KeyboardAvoidingView, Platform, PermissionsAndroid, FlatList, TouchableOpacity, Text } from 'react-native';
import { REACT_SWIPER_BOTTOM_MARGIN } from '../../utils/constants';
import PlatformIonicon from '../../utils/platformIonicon';
import Dialog from "react-native-dialog";

import { styles } from '../../../assets/styles';

export class TopicsNewEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topic: "",
            showHelp: false
        }

    }

    render() {
        return (
            <View style={styles.flex1}>
                <Dialog.Container visible={this.state.showHelp}>
                    <Dialog.Title>Topics Screen</Dialog.Title>
                    <Dialog.Description>
                        Topics are Koota's way of organizing events. In this screen, add all of the topics that apply to what you want to do by typing in the box and clicking add topic!
                    </Dialog.Description>
                    <Dialog.Button label="Got it!" onPress={() => this.setState({showHelp: false})} />
                </Dialog.Container>
                <View style={{ backgroundColor: '#03A9F4', flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 20, paddingVertical: 10, alignContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>Topics</Text>
                    </View>
                    <View style={{ padding: 10, alignSelf: 'center' }}>
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
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : null} style={styles.flex1} keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
                    <View style={styles.formContainer}>
                        <ScrollView keyboardShouldPersistTaps={'handled'}>
                            <View style={{ flex: 3 }}>
                                {this.props.topics && this.props.topics.length > 0 && this.props.topics.map((topic, index) =>
                                    <View key={index} style={{ flexDirection: 'row', backgroundColor: '#' + topic.color, marginTop: 10, marginHorizontal: 10, borderRadius: 5 }}>
                                        <View style={{ padding: 5, margin: 10, backgroundColor: 'white', borderRadius: 30, height: 60, width: 60 }}>
                                            <PlatformIonicon
                                                name={topic.icon}
                                                size={50}
                                                style={{ color: "black", justifyContent: 'center', alignSelf: 'center' }}
                                            />
                                        </View>
                                        <View style={{ flex: 1, paddingLeft: 15, alignSelf: 'center' }}>
                                            <Text numberOfLines={1} style={{ color: 'white', fontSize: 20 }}>{topic.name}</Text>
                                        </View>
                                        <View style={{ alignSelf: 'center', paddingRight: 10 }}>
                                            <PlatformIonicon
                                                name={'close-circle'}
                                                size={30}
                                                style={{ color: "white" }}
                                                onPress={() => this.props.removeTopic(index)}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                        <View style={{ paddingBottom: REACT_SWIPER_BOTTOM_MARGIN, backgroundColor: 'white', paddingTop: 5 }}>
                            <Form style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, paddingLeft: 10 }}>
                                    <Input placeholder="Type Extra Topics Here" name="topic" value={this.state.topic} onChangeText={(text) => this.setState({ topic: text })} />
                                </View>
                                <View style={{ paddingRight: 10 }}>
                                    <Button title="Add" style={{ paddingHorizontal: 5 }} accessibilityLabel="Press this button to add a new topic." onPress={() => { this.props.addTopic(this.state.topic.trim()); this.setState({ topic: "" }) }}>
                                        <Text style={{ color: 'white' }}>Add Topic</Text>
                                    </Button>

                                </View>
                            </Form>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        )
    }
}