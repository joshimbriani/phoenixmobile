import { connect } from 'react-redux';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

class MyEventDetailMessages extends React.Component {
    render() {
        return (
            <View>
                <FlatList
                    data={this.props.messages}
                    renderItem={({item}) => <View>
                            <Text>{item.messageContent}</Text>
                        </View>} />
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        messages: state.eventReducer.selectedEventMessages,
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