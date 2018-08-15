import React from 'react';

import { Content, Form, Item, Input, Label, Textarea } from 'native-base';
import { ScrollView, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import PlatformIonicon from '../../utils/platformIonicon';
import ColorPicker from '../../utils/ColorPicker';
import { materialColors } from '../../utils/styleutils';
import Dialog from "react-native-dialog";

import { styles } from '../../../assets/styles';

export class TitleDescColorNewEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topic: "",
            showHelp: false
        }

    }

    render() {
        return (
            <ScrollView style={styles.flex1}>
                <Dialog.Container visible={this.state.showHelp}>
                    <Dialog.Title>Details Screen</Dialog.Title>
                    <Dialog.Description>
                        Give your event a title and a description so that others can know what you want to do! The color you choose here will be what others see so choose carefully!
                    </Dialog.Description>
                    <Dialog.Button label="Got it!" onPress={() => this.setState({ showHelp: false })} />
                </Dialog.Container>
                <View style={{ backgroundColor: '#03A9F4', flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 20, paddingVertical: 10, alignContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>Details</Text>
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
                    <Content style={styles.flex1}>
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
                            <Item stackedLabel>
                                <Label>Event Color</Label>
                                <ColorPicker
                                    colors={materialColors}
                                    selectedColor={this.props.color}
                                    onSelect={(color) => this.props.onChange("color", color)}
                                />
                            </Item>
                            <Item stackedLabel last>
                                {this.props.errors["description"].length > 0 && <View style={{ marginTop: 5, backgroundColor: 'red', paddingHorizontal: 30, paddingVertical: 5 }}>
                                    <Text style={{ color: 'white' }}>{this.props.errors["description"]}</Text>
                                </View>}
                                <Label>Full Description</Label>
                                <Textarea
                                    style={{width: '90%'}}
                                    name="description"
                                    placeholder="Tell us more about what you want to do!"
                                    //onBlur={() => this.props.fetchTopicsFromDescription()}
                                    rowSpan={5}
                                    bordered
                                    onChangeText={(text) => this.props.onChange("description", text)}
                                />
                            </Item>
                        </Form>
                    </Content>
                </View>
            </ScrollView>
        )
    }
}