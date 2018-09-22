import React from 'react';
import { Alert, Platform, Linking, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor';
import moment from 'moment';
import { styles } from '../../assets/styles';
import { getComplementaryColor } from '../utils/styleutils';
import Color from 'color';
import ParsedText from 'react-native-parsed-text';

class OfferDetails extends React.Component {

    constructor(props) {
        super(props);

        this.shareOffer = this.shareOffer.bind(this);
    }

    shareOffer(offer) {
        Share.share({
            message: "It's " + this.props.details.username + " and I think you'd really like this offer - " + offer.name + ". Check it out on Koota! https://kootasocial.com/",
            url: 'http://kootasocial.com',
            title: "I think you'd like this event on Koota!"
        }, {
                // Android only:
                dialogTitle: 'Share this awesome event!',
            })

    }

    render() {
        if (Object.keys(this.props.offer).length > 0) {
            const offer = this.props.offer;
            const startTime = moment(offer.startTime);
            const endTime = moment(offer.startTime);
            return (
                <View style={styles.flex1} >
                    <ScrollView style={{ flex: 1 }}>
                        <View style={[styles.eventDetailHeader, { backgroundColor: getComplementaryColor(offer.color) }]} >
                            <Text style={[styles.eventDetailHeading, {color: Color(getComplementaryColor(offer.color)).isDark() ? 'white' : 'black'}]}>{offer.name}</Text>
                            <Text style={[styles.eventDetailSubHeading, {color: Color(getComplementaryColor(offer.color)).isDark() ? 'white' : 'black'}]}>Runs from {startTime.format('dddd, MMMM Do, YYYY @ h:mm a')} to {endTime.format('dddd, MMMM Do, YYYY @ h:mm a')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#A8A8A8' }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('NewEvent', { offer: offer }) }} style={{ flexDirection: 'row', flex: 1, margin: 5 }}>
                                <View style={{ flexDirection: 'row', flex: 1, padding: 5, borderRightWidth: 1, borderRightColor: '#A8A8A8' }}>
                                    <PlatformIonicon
                                        name={this.props.userGoing ? "checkbox" : "checkbox-outline"}
                                        size={25} //this doesn't adjust the size...?
                                        style={{ color: "green", margin: 5 }}
                                    />
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                        <Text>Create Event with Offer</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.shareEvent()} style={{ flexDirection: 'row', flex: 1, margin: 5 }}>
                                <View style={{ flexDirection: 'row', flex: 1, padding: 5 }}>
                                    <PlatformIonicon
                                        name={"share"}
                                        size={25} //this doesn't adjust the size...?
                                        style={{ color: "blue", margin: 5 }}
                                    />
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                        <Text>Share With Friends</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.eventDetailBody}>
                            <View>
                                <Text style={styles.eventDetailSectionHeader}>Description</Text>
                                <ParsedText
                                    style={{ fontSize: 17, overflow: 'hidden' }}
                                    parse={
                                        [
                                            { type: 'url', style: { color: 'blue', textDecorationLine: 'underline' }, onPress: (url) => Linking.openURL(url) },
                                            { type: 'phone', style: { color: 'blue', textDecorationLine: 'underline' }, onPress: (phone) => Linking.openURL('tel:' + phone) },
                                            { type: 'email', style: { color: 'blue', textDecorationLine: 'underline'}, onPress: (email) => Linking.openURL('mailto:' + email) },
                                            { pattern: /[-a-zA-Z0-9:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b/, style: { color: 'blue', textDecorationLine: 'underline' }, onPress: (url) => Linking.openURL('https://' + url) },
                                        ]
                                    }
                                >
                                    {offer.description}
                                </ParsedText>
                            </View>
                            {offer.recurrences.length > 0 && <View style={{ flex: 1 }}>
                                <Text style={styles.eventDetailSectionHeader}>Valid On</Text>
                                {offer.recurrences.map((recurrence, index) => {
                                    return (
                                        <View>
                                            <Text>{recurrence.dayOfWeek.toUpperCase()} from {moment(recurrence.startTime, 'HH:mm:ss').format('h:mm a')} to {moment(recurrence.endTime, 'HH:mm:ss').format('h:mm a')}</Text>
                                        </View>
                                    )
                                })}
                            </View>}
                        </View>
                    </ScrollView>
                </View>
            )
        } else {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }
    }
}

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OfferDetails);
