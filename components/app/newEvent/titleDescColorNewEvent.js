import React from 'react';

import { Content, Form, Item, Input, Label, Button } from 'native-base';
import { ScrollView, View, Picker, ToastAndroid, KeyboardAvoidingView, Platform, PermissionsAndroid, FlatList, TouchableOpacity, Text } from 'react-native';
import PlatformIonicon from '../../utils/platformIonicon';
import ColorPicker from '../../utils/ColorPicker';
import { materialColors } from '../../utils/styleutils';

import { styles } from '../../../assets/styles';

export class TitleDescColorNewEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topic: ""
        }

    }

    render() {
        return (
            <View style={styles.flex1}>
                <View style={{ backgroundColor: '#03A9F4', flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 20, paddingVertical: 10, alignContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>Details</Text>
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
                <View style={styles.formContainer}>
                    <Content style={styles.flex1}>
                        <Form>
                            <Item stackedLabel>
                                <Label>Title</Label>
                                <Input
                                    name="title"
                                    onBlur={() => this.props.fetchTopicsFromDescription()}
                                    onChangeText={(text) => this.props.onChange("title", text)}
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>Event Color</Label>
                                <ColorPicker
                                    colors={materialColors}
                                    selectedColor={this.props.color}
                                    onSelect={(color) => this.props.onChange("color", color) }
                                />
                            </Item>
                            <Item stackedLabel last>
                                <Label>Full Description</Label>
                                <Input
                                    name="description"
                                    placeholder="Tell us more about what you want to do!"
                                    onBlur={() => this.props.fetchTopicsFromDescription()}
                                    multiline={true}
                                    numberOfLines={5}
                                    onChangeText={(text) => this.props.onChange("description", text)}
                                />
                            </Item>
                        </Form>
                    </Content>
                </View>
            </View>
        )
    }
}