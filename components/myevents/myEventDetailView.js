import { connect } from 'react-redux';
import React from 'react';
import { View } from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';

class MyEventDetailView extends React.Component {
    render() {
        const date = new Date(this.props.selectedEvent.datetime);
        return (
            <Container>
                <View>
                    <Text>
                        {this.props.selectedEvent.title}
                    </Text>
                </View>
                <View>
                    <Text>
                        What: {this.props.selectedEvent.description}
                    </Text>
                    <Text>
                        Who: {this.props.selectedEvent.going.length} people
                    </Text>
                    <Text>
                        Where: {this.props.selectedEvent.place}
                    </Text>
                    <Text>
                        When: {date.toDateString()} @ {date.getHours()}:{date.getMinutes()}
                    </Text>
                </View>
            </Container>
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