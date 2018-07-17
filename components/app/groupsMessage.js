import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';
import { Text, View } from 'react-native';
import { Fab } from 'native-base';

import ThreadsView from './messaging/threadsView';
import PlatformIonicon from '../utils/platformIonicon';

class GroupsMessage extends React.Component {
    render() {
        if (Object.keys(this.props.group).length > 0) {
            return (
                <View style={styles.flex1} >
                    <ThreadsView
                        eventName={this.props.group.name}
                        color={this.props.group.color}
                        threads={this.props.group.thread}
                        creator={this.props.event.userBy.username}
                        navigation={this.props.navigation}
                        userGoing={this.props.userGoing}
                        userInterested={this.props.userInterested}
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

GroupsMessage.propTypes = {
    color: PropTypes.string,
    event: PropTypes.object,
    userInterested: PropTypes.bool,
    userGoing: PropTypes.bool
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
)(GroupsMessage);