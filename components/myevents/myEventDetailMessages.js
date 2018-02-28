import { connect } from 'react-redux';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

class MyEventDetailMessages extends React.Component {
    render() {
        return (
            <View>
                <FlatList
                    data={[{messageFrom: "Josh Imbriani", messageTo: "Fake Fake", messages: [{content: "Test", date: "12"}]}]}
                    renderItem={({item}) => <Text>Test</Text>} />
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