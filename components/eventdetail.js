import React from 'react';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';

const testData = [
    { id: 0, title: "Let's Go Skiing 0!", date: Date.now(), capacity: 4, going: 3, color: 'firebrick' },
    { id: 1, title: "Let's Go Skiing 1!", date: Date.now(), capacity: 4, going: 3, color: 'khaki' },
    { id: 2, title: "Let's Go Skiing 2!", date: Date.now(), capacity: 4, going: 3, color: 'lawngreen' },
    { id: 3, title: "Let's Go Skiing 3!", date: Date.now(), capacity: 4, going: 3, color: 'lightcoral' },
]

class TopicDetail extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Topic Detail",
        headerStyle: { backgroundColor: navigation.state.params.color },
        headerRight: <Ionicons
            name='md-funnel'
            style={{ paddingRight: 10 }}
            size={35}
            onPress={() => navigation.navigate('DrawerOpen')} />
    });

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {
    }

    componentWillMount() {
        
    }

    componentWillUnmount() {
        
    }

    render() {
        return (
            <Text>
                This is the topic detail view.
            </Text>
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
        colorActions: bindActionCreators(colorActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopicDetail);

const styles = StyleSheet.create({
    listitem: {
        alignSelf: 'stretch',
        height: 200,
    },
    itemText: {
        color: 'white',
        fontSize: 40,
        paddingTop: 5,
        textAlign: 'center',
        fontFamily: 'Roboto_medium'
    }

});