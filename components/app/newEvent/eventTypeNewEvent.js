import React from 'react';

import { Content, Form, Item, Input, Label, Textarea } from 'native-base';
import { ScrollView, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import PlatformIonicon from '../../utils/platformIonicon';
import ColorPicker from '../../utils/ColorPicker';
import { materialColors } from '../../utils/styleutils';
import Dialog from "react-native-dialog";

import { styles } from '../../../assets/styles';

export class EventTypeNewEvent extends React.Component {
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
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.onChange("eventType", "hangout")}>
                    <View style={{ flex: 1, padding: 20, backgroundColor: '#006083', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ marginBottom: 5 }}>
                            <PlatformIonicon
                                name={"people"}
                                size={50} //this doesn't adjust the size...?
                                style={{ color: "white", justifyContent: 'center', alignSelf: 'center' }}
                            />
                        </View>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={{ color: 'white', fontSize: 40 }}>Hangout</Text>
                        </View>
                        <View>
                            <Text style={{ color: 'white', fontSize: 10 }}>Hangouts are things that you yourself want to do with a group</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.onChange("eventType", "event")}>
                    <View style={{ flex: 1, padding: 20, backgroundColor: '#A5DEF5', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ marginBottom: 5 }}>
                            <PlatformIonicon
                                name={"calendar"}
                                size={50} //this doesn't adjust the size...?
                                style={{ color: "white", justifyContent: 'center', alignSelf: 'center' }}
                            />
                        </View>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={{ color: 'white', fontSize: 40 }}>Event</Text>
                        </View>
                        <View>
                            <Text style={{ color: 'white', fontSize: 10 }}>
                                Events are things that you want to report but you yourself aren't ncessarily interested in going with a group to.
                                Contributing events gives you points!
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}