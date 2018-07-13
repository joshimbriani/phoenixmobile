import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';
import { Text, View } from 'react-native';

class EventDetailPlace extends React.Component {
    // TODO: Replace place with place.name or address
    // TODO: Put maps into application - https://github.com/react-community/react-native-maps
    render() { 
        if (Object.keys(this.props.event).length > 0) {
            return (
                <View style={styles.flex1} >
                    <View style={styles.eventDetailPlaceBody}>
                        <View>
                            <Text style={styles.eventDetailSectionHeader}>Place</Text>
                            {this.props.event.place && <View>
                                <Text>{this.props.event.place.name}</Text>
                                <Text>{this.props.event.place.addressStreet}</Text>
                                {this.props.event.place.addressUnit && <Text>{this.props.event.place.addressUnit}</Text>}
                                <Text>{this.props.event.place.addressState}</Text>
                            </View>}
                            {!this.props.event.place && <View>
                                <Text>Islands of Adventure</Text>
                                <Text>6000 Universal Blvd</Text>
                                <Text>Attn Forbidden Journey</Text>
                                <Text>ORlando, FL 32819</Text>
                            </View>}
                        </View>
                    </View>
                    <View style={styles.eventDetailPlaceMap}>
                        <Text>Map</Text>
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
}

EventDetailPlace.propTypes = {
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
)(EventDetailPlace);