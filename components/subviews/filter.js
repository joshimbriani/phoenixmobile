import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

class Filter extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Filter Events',
    });

    render() {
        return (
            <View>
                <Text>The filter events view will allow users to filter topics for certain attributes including date/time</Text>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        color: state.backgroundColorReducer.color
    };
}

function mapDispatchToProps(dispatch) {
    return {
        
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Filter);
