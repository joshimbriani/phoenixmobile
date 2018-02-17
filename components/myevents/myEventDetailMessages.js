import { connect } from 'react-redux';
import React from 'react';
import { Text, View } from 'react-native';

class MyEventDetailMessages extends React.Component {
    render() {
        return (
            <View>
                <Text>Messages View</Text>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyEventDetailMessages);