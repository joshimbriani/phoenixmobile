import React from 'react';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';

class EventDetail extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.event,
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
        fetch("http://10.0.2.2:8000/api/v1/events/" + this.props.navigation.state.params.id + "?format=json").then(response => response.json())
            .then(responseObj => {
                console.log(responseObj);
                this.setState({ data: responseObj });
            })
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
        
    };
}

function mapDispatchToProps(dispatch) {
    return {
        
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventDetail);

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
