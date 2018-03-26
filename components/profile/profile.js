import React from 'react';
import { Button, Container, Text } from 'native-base';
import { Alert, Platform, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';
import { getURLForPlatform } from '../utils/networkUtils';
import { KootaListView } from '../utils/listView';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }

    }

    componentDidMount() {
        console.log("Test");
        /*
        fetch(getURLForPlatform("phoenix") + "api/v1/users/me", {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: responseObj });
            });
            */
    }

    render() {
        return (
            <Container style={{ flex: 1 }}>
                <Text>Profile View</Text>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);

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
    },
    followView: {
        flex: -1
    },
    listView: {
        flex: 5
    }
});
