import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';
import { Text, View } from 'react-native';

import ThreadsView from './messaging/threadsView';

class EventDetailMessages extends React.Component {
    render() {
        if (Object.keys(this.props.event).length > 0) {
            return (
                <View style={styles.flex1} >
                    <ThreadsView
                        eventName={this.props.event.title}
                        color={this.props.color}
                        threads={this.props.event.threads} 
                        creator={this.props.event.userBy} 
                        navigation={this.props.navigation}
                        />
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

EventDetailMessages.propTypes = {
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
)(EventDetailMessages);