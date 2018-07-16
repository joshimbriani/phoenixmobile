import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';
import { Text, View } from 'react-native';
import { Fab } from 'native-base';

import ThreadsView from './messaging/threadsView';
import PlatformIonicon from '../utils/platformIonicon';

class EventDetailMessages extends React.Component {
    render() {
        if (Object.keys(this.props.event).length > 0) {
            return (
                <View style={styles.flex1} >
                    <ThreadsView
                        eventName={this.props.event.title}
                        color={this.props.color}
                        threads={this.props.event.threads}
                        creator={this.props.event.userBy.username}
                        navigation={this.props.navigation}
                        userGoing={this.props.userGoing}
                        userInterested={this.props.userInterested}
                    />
                    <Fab
                        active={true}
                        containerStyle={{}}
                        style={{ backgroundColor: '#e84118' }}
                        position="bottomRight"
                        onPress={() => this.props.navigation.navigate('NewMessage', { threads: this.props.event.threads, creator: this.props.event.userBy, interested: this.props.event.interested, going: this.props.event.going, eventName: this.props.event.title, eventID: this.props.event.id })}>
                            <PlatformIonicon
                                name={"add"}
                                size={50} //this doesn't adjust the size...?
                                style={{ color: "white" }}
                            />
                    </Fab>
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
)(EventDetailMessages);