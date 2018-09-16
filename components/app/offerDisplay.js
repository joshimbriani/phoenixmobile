import React from 'react';
import { View, Share, Text, Dimensions, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { CachedImage } from 'react-native-cached-image';
import { getDayOfWeekFromDayNumber, getMonthNameFromMonthNumber } from '../utils/datetimeUtils';
import ProgressBar from 'react-native-progress/Bar';
import { getURLForPlatform } from '../utils/networkUtils';

import PlatformIonicon from '../utils/platformIonicon';

export class OfferDisplay extends React.Component {

    constructor(props) {
        super(props);

        this.shareOffer = this.shareOffer.bind(this);
    }
    
    shareEvent() {
        Share.share({
            message: "It's " + this.props.username + " and I think you'd really like this offer - " + this.props.offer.name + ". Check it out on Koota! https://kootasocial.com/",
            url: 'http://kootasocial.com',
            title: "I think you'd like this offer on Koota!"
        }, {
                // Android only:
                dialogTitle: 'Share this awesome offer!',
            })

    }

    render() {
        if (Object.keys(this.props.offer).length > 0) {
            const date = new Date(this.props.offer.endTime)
            return (
                <View key={this.props.index} style={{
                    backgroundColor: '#FFFFFF', flex: 1, margin: 5,
                    ...Platform.select({
                        ios: {
                            shadowColor: 'rgba(0,0,0, .2)',
                            shadowOffset: { height: 0, width: 0 },
                            shadowOpacity: 1,
                            shadowRadius: 1,
                        },
                        android: {
                            elevation: 1,
                        },
                    }),
                }}>
                    <TouchableOpacity onPress={() => this.props.goToEvent()}>
                        <View style={{ flexDirection: 'row', paddingTop: 10, paddingHorizontal: 10, paddingBottom: 5 }}>
                            <View style={{ paddingRight: 5 }}>
                                <CachedImage
                                    style={{ width: 50, height: 50, borderRadius: 25 }}
                                    source={{ uri: this.props.offer.icon }}
                                    ttl={60 * 60 * 24 * 3}
                                    fallbackSource={require('../../assets/images/KootaK.png')}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} style={{ fontSize: 20, fontWeight: 'bold', color: 'black', maxWidth: 275 }}>{this.props.offer.name}</Text>
                                <Text numberOfLines={1} style={{ fontSize: 9 }}>{getDayOfWeekFromDayNumber(date.getDay())} {getMonthNameFromMonthNumber(date.getMonth())} {date.getDate()}, {date.getFullYear()} @ {(date.getHours() % 12) + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + (date.getHours() < 12 ? 'AM' : 'PM')}  </Text>
                                <Text numberOfLines={1} style={{ fontSize: 9 }}>{this.props.offer.place.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', marginTop: 10, borderTopWidth: 1, borderTopColor: '#A8A8A8' }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('NewEvent', {offer: item})}}>
                            <View style={{ flexDirection: 'row', flex: 1, margin: 5, borderRightWidth: 1, borderRightColor: '#A8A8A8' }}>
                                <PlatformIonicon
                                    name={"calendar"}
                                    size={25} //this doesn't adjust the size...?
                                    style={{ color: "#e84118" }}
                                />
                                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                    <Text>Create Hangout with Offer</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.shareEvent()} style={{ flexDirection: 'row', flex: 1, margin: 5 }}>
                            <View style={{ flexDirection: 'row', flex: 1, margin: 5 }}>
                                <PlatformIonicon
                                    name={"share"}
                                    size={25} //this doesn't adjust the size...?
                                    style={{ color: "green" }}
                                />
                                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                    <Text>Share With Friends</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    }
}

EventDisplay.propTypes = {
    event: PropTypes.object.isRequired,
    showButtons: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    goToEvent: PropTypes.func.isRequired,
    username: PropTypes.string
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
        justifyContent: 'flex-start',
        margin: 5,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0, .2)',
                shadowOffset: { height: 0, width: 0 },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
            android: {
                elevation: 1,
            },
        }),
    },
}) 