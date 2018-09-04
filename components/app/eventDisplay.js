import React from 'react';
import { View, Share, Text, Dimensions, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { CachedImage } from 'react-native-cached-image';
import { getDayOfWeekFromDayNumber, getMonthNameFromMonthNumber } from '../utils/datetimeUtils';
import ProgressBar from 'react-native-progress/Bar';
import { getURLForPlatform } from '../utils/networkUtils';

import PlatformIonicon from '../utils/platformIonicon';

export class EventDisplay extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            interested: false
        }

        this.shareEvent = this.shareEvent.bind(this);
        this.markUserAsInterested = this.markUserAsInterested.bind(this);
    }

    componentDidMount() {
        this.setState({interested: this.props.interested})
    }

    componentDidUpdate(prevProps) {
        if (prevProps.interested !== this.props.interested) {
            this.setState({interested: this.props.interested})
        }
    }

    markUserAsInterested(eventID) {
        fetch(getURLForPlatform() + "api/v1/events/" + eventID + "/interested/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
        })
            .then(response => response.json())
            .then(responseObj => {
                if (responseObj["success"] !== true) {
                    console.log("Bad interested.")
                } else {
                    if (responseObj["action"] === "added") {
                        this.setState({interested: true})
                    } else if (responseObj["action"] === "removed") {
                        this.setState({interested: false})
                    }
                    
                }
            });
    }
    
    shareEvent() {
        Share.share({
            message: "It's " + this.props.username + " and I think you'd really like this event - " + this.props.event.title + ". Check it out on Koota! https://kootasocial.com/",
            url: 'http://kootasocial.com',
            title: "I think you'd like this event on Koota!"
        }, {
                // Android only:
                dialogTitle: 'Share this awesome event!',
            })

    }

    render() {
        if (Object.keys(this.props.event).length > 0) {
            const date = new Date(this.props.event.datetime)
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
                                    source={{ uri: this.props.event.userBy.profilePicture }}
                                    ttl={60 * 60 * 24 * 3}
                                    fallbackSource={require('../../assets/images/KootaK.png')}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} style={{ fontSize: 20, fontWeight: 'bold', color: 'black', maxWidth: this.props.event.offers.length > 0 ? 230 : 275 }}>{this.props.event.title}</Text>
                                <Text numberOfLines={1} style={{ fontSize: 9 }}>{getDayOfWeekFromDayNumber(date.getDay())} {getMonthNameFromMonthNumber(date.getMonth())} {date.getDate()}, {date.getFullYear()} @ {(date.getHours() % 12) + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + (date.getHours() < 12 ? 'AM' : 'PM')}  </Text>
                                <Text numberOfLines={1} style={{ fontSize: 9 }}>{this.props.event.place.name}</Text>
                            </View>
                            {this.props.event.offers.length > 0 && <View style={{ width: 30, height: 30, borderRadius: 13, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center' }}>
                                <PlatformIonicon
                                    name={"cash"}
                                    size={25} //this doesn't adjust the size...?
                                    style={{ color: "white" }}
                                />
                            </View>}
                        </View>
                        <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
                            {this.props.event.topics.length > 0 && <View style={{ paddingBottom: 5 }}>
                                <Text numberOfLines={1}>{'#' + this.props.event.topics.map(topic => topic.name).join('  #')}</Text>
                            </View>}
                            {this.props.event.owned && <View>
                                <ProgressBar style={{ marginTop: 'auto' }} progress={this.props.event.going && this.props.event.capacity && (this.props.event.going.length / this.props.event.capacity)} width={Dimensions.get('window').width - 30} />
                            </View>}
                        </View>
                    </TouchableOpacity>
                    {this.props.showButtons && <View style={{ flexDirection: 'row', marginTop: 10, borderTopWidth: 1, borderTopColor: '#A8A8A8' }}>
                        <TouchableOpacity onPress={() => this.markUserAsInterested(this.props.event.id)} style={{ flexDirection: 'row', flex: 1, margin: 5 }}>
                            <View style={{ flexDirection: 'row', flex: 1, margin: 5, borderRightWidth: 1, borderRightColor: '#A8A8A8' }}>
                                <PlatformIonicon
                                    name={this.state.interested ? "heart" : "heart-empty"}
                                    size={25} //this doesn't adjust the size...?
                                    style={{ color: "#e84118" }}
                                />
                                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                    <Text>I'm Interested!</Text>
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
                    </View>}
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