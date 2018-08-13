import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';
import { Text, View } from 'react-native';
import { generateUserToString } from '../utils/textUtils';

import ConversationView from './messaging/conversationView';
import PlatformIonicon from '../utils/platformIonicon';


class GroupsMessage extends React.Component {
    render() {
        if (Object.keys(this.props.group).length > 0) {
            return (
                <View style={styles.flex1} >
                    <ConversationView
                        newConvo={false}
                        thread={this.props.group.thread}
                        eventName={this.props.group.name}
                        color={this.props.group.color}
                        userString={generateUserToString(this.props.user.id, this.props.group.users, null)}
                        navigation={this.props.navigation}
                        groupID={this.props.group.id}
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
)(GroupsMessage);