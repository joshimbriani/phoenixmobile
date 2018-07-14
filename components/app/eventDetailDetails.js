import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { getDayOfWeekFromDayNumber, getMonthNameFromMonthNumber } from '../utils/datetimeUtils';
import { getComplementaryColor } from '../utils/styleutils';
import { styles } from '../../assets/styles';

class EventDetailDetails extends React.Component {
    // TODO: Offer View
    // TODO: Need to handle recursive topic case
    render() {
        if (Object.keys(this.props.event).length > 0) {
            const date = new Date(this.props.event.created)
            return (
                <View style={styles.flex1} >
                    <ScrollView style={{ flex: 1 }}>
                        <View style={[styles.eventDetailHeader, { backgroundColor: getComplementaryColor('#' + this.props.color) }]} >
                            <Text style={styles.eventDetailHeading}>{this.props.event.title}</Text>
                            <Text style={styles.eventDetailSubHeading}>{getDayOfWeekFromDayNumber(date.getDay())} {getMonthNameFromMonthNumber(date.getMonth())} {date.getDate()}, {date.getFullYear()}</Text>
                            <View style={{flexDirection: 'row'}}>
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
                            </View>
                        </View>
                        <View style={styles.eventDetailBody}>
                            <View>
                                <Text style={styles.eventDetailSectionHeader}>Description</Text>
                                <Text>{this.props.event.description}</Text>
                            </View>
                            {this.props.event.offers.length > 0 && <View>
                                <Text style={styles.eventDetailSectionHeader}>Applied Offers</Text>
                                <Text>lorem ipsum</Text>
                            </View>}
                        </View>
                    </ScrollView>
                    <View style={[styles.eventDetailActionButton, {margin: 5}]}>
                        <TouchableOpacity
                            onPress={this.markUserAsInterested}
                            style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E54E2D' }}>
                            <View style={{alignItems: 'center'}}>
                                <Text>I'm</Text>
                                <Text>Interested!</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.markUserAsGoing}
                            style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5, flex: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#CC4528' }}>
                            <View>
                                <Text style={{fontSize: 25}}>I'm Going!</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
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