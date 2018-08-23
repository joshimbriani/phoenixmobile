import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { getDayOfWeekFromDayNumber, getMonthNameFromMonthNumber } from '../utils/datetimeUtils';
import { getComplementaryColor } from '../utils/styleutils';
import { styles } from '../../assets/styles';
import { OfferContainer } from './offerContainer';

class EventDetailDetails extends React.Component {
    // TODO: Offer View
    // TODO: Need to handle recursive topic case
    render() {
        if (Object.keys(this.props.event).length > 0) {
            const date = new Date(this.props.event.datetime)
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
                                            style={{padding: 5}}
                                            onPress={() => { this.routeToTopic(topic)}}>
                                            <View>
                                                <Text>#{topic.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>
                        <View style={styles.eventDetailBody}>
                            <View>
                                <Text style={styles.eventDetailSectionHeader}>Description</Text>
                                <Text>{this.props.event.description}</Text>
                            </View>
                            {this.props.event.offers.length > 0 && <View>
                                <Text style={styles.eventDetailSectionHeader}>Applied Offers</Text>
                                {this.props.event.offers.map((offer, index) => {
                                    return <OfferContainer addable={false} offer={offer} index={index} />
                                })}
                            </View>}
                            {/*this.props.event.privacy === "group" && <View>
                                <Text style={styles.eventDetailSectionHeader}>Group</Text>
                            </View>*/}
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

    markUserAsInterested() {
        return;
    }

    markUserAsGoing() {
        return;
    }

    routeToTopic(topic) {
        this.props.navigation.navigate('Topic', { topic: topic.name, id: topic.id, color: topic.color.substring(0)})
    }
}

EventDetailDetails.propTypes = {
    color: PropTypes.string,
    event: PropTypes.object
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
)(EventDetailDetails);