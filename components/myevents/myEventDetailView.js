import { connect } from 'react-redux';
import React from 'react';
import { Text, View } from 'react-native';

class MyEventDetailView extends React.Component {
    render() {
        console.log(this.props.selectedEvent);
        return (
            <View>
                <Text>{this.props.selectedEvent.name}</Text>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        selectedEvent: state.eventReducer.selectedEvent,
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