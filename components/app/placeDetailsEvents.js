import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Text, RefreshControl, View, Button } from 'react-native';

import { getDayOfWeekFromDayNumber, getMonthNameFromMonthNumber } from '../utils/datetimeUtils';
import { getComplementaryColor } from '../utils/styleutils';
import { styles } from '../../assets/styles';
import { OfferContainer } from './offerContainer';
import moment from 'moment';
import PlatformIonicon from '../utils/platformIonicon';

import { EventDisplay } from './eventDisplay';

class PlaceDetailsEvents extends React.Component {
    // TODO: Offer View
    // TODO: Need to handle recursive topic case
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }

        this.userInterestedInEvent = this.userInterestedInEvent.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    userInterestedInEvent(eventID) {
        if (this.props.interestedInEvents) {
            for (var i = 0; i < this.props.interestedInEvents.length; i++) {
                if (eventID === this.props.interestedInEvents[i].id) {
                    return true;
                }
            }
        }
        return false;
    }

    _onRefresh() {
        this.setState({loading: true})
        this.props.loadPlaceEvents();
        this.setState({loading: false})
    }

    render() {
        if (Object.keys(this.props.place).length > 0) {
            if (this.props.events.length > 0) {
                return (
                    <View style={styles.flex1} >
                        <FlatList
                            data={this.props.events}
                            renderItem={({ item }) => (
                                <EventDisplay index={item.id} event={item} interested={this.userInterestedInEvent(item.id)} showButtons={true} username={this.props.details.username} token={this.props.token} goToEvent={() => this.props.navigation.navigate('EventDetailWrapper', { event: item.title, id: item.id, color: item.color, loadEvents: this.props.loadEvents })} />
                            )}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.loading}
                                    onRefresh={this._onRefresh}
                                />
                            }
                        />
                    </View>
                )
            } else {
                return (
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text>No Upcoming Events Exist at this Place!</Text>
                    </View>
                )
            }
            
        } else {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }
    }
}

PlaceDetailsEvents.propTypes = {
    place: PropTypes.object
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        details: state.userReducer.details,
        token: state.tokenReducer.token,
        interestedInEvents: state.userReducer.interestedInEvents
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlaceDetailsEvents);