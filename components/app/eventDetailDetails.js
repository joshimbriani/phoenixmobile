import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, TouchableOpacity, View, Button } from 'react-native';

import { getDayOfWeekFromDayNumber, getMonthNameFromMonthNumber } from '../utils/datetimeUtils';
import { getComplementaryColor } from '../utils/styleutils';
import { styles } from '../../assets/styles';
import { OfferContainer } from './offerContainer';
import moment from 'moment';
import PlatformIonicon from '../utils/platformIonicon';

class EventDetailDetails extends React.Component {
    // TODO: Offer View
    // TODO: Need to handle recursive topic case
    render() {
        if (Object.keys(this.props.event).length > 0) {
            const date = new Date(this.props.event.datetime);
            const now = moment();
            return (
                <View style={styles.flex1} >
                    <ScrollView style={{ flex: 1 }}>
                        <View style={[styles.eventDetailHeader, { backgroundColor: getComplementaryColor(this.props.color) }]} >
                            <Text style={styles.eventDetailHeading}>{this.props.event.title}</Text>
                            <Text style={styles.eventDetailSubHeading}>{getDayOfWeekFromDayNumber(date.getDay())} {getMonthNameFromMonthNumber(date.getMonth())} {date.getDate()}, {date.getFullYear()} @ {(date.getHours() % 12) + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + (date.getHours() < 12 ? 'AM' : 'PM')}</Text>
                            <ScrollView horizontal={true}>
                                {this.props.event.topics && this.props.event.topics.map((topic, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={{ padding: 5 }}
                                            onPress={() => { this.routeToTopic(topic) }}>
                                            <View>
                                                <Text>#{topic.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#A8A8A8' }}>
                            { !this.props.userGoing && <TouchableOpacity onPress={() => this.props.markUserAsInterested(this.props.event.id)} style={{ flexDirection: 'row', flex: 1, margin: 5 }}>
                                <View style={{ flexDirection: 'row', flex: 1, padding: 5, borderRightWidth: 1, borderRightColor: '#A8A8A8' }}>
                                    <PlatformIonicon
                                        name={this.props.userInterested ? "heart" : "heart-empty"}
                                        size={25} //this doesn't adjust the size...?
                                        style={{ color: "#e84118", margin: 5 }}
                                    />
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                        <Text>I'm Interested!</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>}
                            <TouchableOpacity onPress={() => this.props.markUserAsGoing(this.props.event.id)} style={{ flexDirection: 'row', flex: 1, margin: 5 }}>
                                <View style={{ flexDirection: 'row', flex: 1, padding: 5, borderRightWidth: 1, borderRightColor: '#A8A8A8' }}>
                                    <PlatformIonicon
                                        name={this.props.userGoing ? "checkbox" : "checkbox-outline"}
                                        size={25} //this doesn't adjust the size...?
                                        style={{ color: "green", margin: 5 }}
                                    />
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                        <Text>I'm Going!</Text>
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
                                <Text>{this.props.event.description}</Text>
                            </View>
                            {this.props.event.offers.length > 0 && <View style={{ flex: 1 }}>
                                <Text style={styles.eventDetailSectionHeader}>Applied Offers</Text>
                                {this.props.event.offers.map((offer, index) => {
                                    return <OfferContainer addable={false} offer={offer} index={index} />
                                })}
                            </View>}
                            {/*this.props.event.privacy === "group" && <View>
                                <Text style={styles.eventDetailSectionHeader}>Group</Text>
                            </View>*/}
                            {this.props.user.id === this.props.event.userBy.id && now.isAfter(moment(date).subtract(1, 'hour')) &&
                                <View style={{ marginTop: 20 }}>
                                    <Button disabled={this.props.event.redeemed || now.isAfter(moment(date).add(1, 'hour'))} title={this.props.event.redeemed ? "Redeemed!" : "Redeem Now"} color='#8BC34A' accessibilityLabel="Redeem Offer Button" onPress={this.props.redeemOffer} />
                                </View>
                            }
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

    routeToTopic(topic) {
        this.props.navigation.navigate('Topic', { topic: topic.name, id: topic.id, color: topic.color.substring(0) })
    }
}

EventDetailDetails.propTypes = {
    color: PropTypes.string,
    event: PropTypes.object
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventDetailDetails);