

import React from 'react';

import { ScrollView, View, Picker, ToastAndroid, KeyboardAvoidingView, Platform, PermissionsAndroid, FlatList, TouchableOpacity, Text } from 'react-native';
import { OfferContainer } from '../offerContainer';
import PlatformIonicon from '../../utils/platformIonicon';
import Dialog from "react-native-dialog";

import { styles } from '../../../assets/styles';

export class OffersNewEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showHelp: false
        }

    }

    render() {
        return (
            <View style={styles.flex1}>
                <Dialog.Container visible={this.state.showHelp}>
                    <Dialog.Title>Topics Screen</Dialog.Title>
                    <Dialog.Description>
                        Do you want to delete this account? You cannot undo this action.
                    </Dialog.Description>
                    <Dialog.Button label="Got it!" onPress={() => this.setState({ showHelp: false })} />
                </Dialog.Container>
                <View style={{ backgroundColor: '#03A9F4', flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingLeft: 20, paddingVertical: 10, alignContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>Offers</Text>
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
                <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", alignSelf: "stretch" }}>
                    <ScrollView style={styles.offerScrollContainer}>
                        {this.props.offers.map((offer, index) => {
                            console.log(offer)
                            return (
                                <OfferContainer index={index} offer={offer} addable={true} addToEvent={this.props.addToEvent} removeFromEvent={this.props.removeFromEvent} />
                            )
                        })}
                    </ScrollView>
                </View>
            </View>
        )
    }
}
