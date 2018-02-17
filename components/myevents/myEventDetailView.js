import { connect } from 'react-redux';
import React from 'react';
import { Text, View } from 'react-native';

class MyEventDetailView extends React.Component {
    render() {
        return (
            <View>
                <Text>Detail View</Text>
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
)(MyEventDetailView);