import React from 'react';
import { Button, Container, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';
import { getURLForPlatform } from '../utils/networkUtils';
import {KootaListView} from '../utils/listView';

class Suggested extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        headerRight: <PlatformIonicon
            name='funnel'
            style={{ paddingRight: 10 }}
            size={35}
            onPress={() => navigation.navigate('Filter')} />
    });

    constructor(props) {
        super(props);
        this.state = {
            colors: ["ffffff"],
            data: [],
            followed: false,
        }

    }

    componentDidMount() {
        fetch(getURLForPlatform() + "api/v1/events/suggested", {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: responseObj });
            });
    }

    render() {
        if (this.state.data.length > 0) {
            return (
                <Container style={{ flex: 1 }}>
                    <KootaListView data={this.state.data} pressCallback={(item) => this.props.navigation.navigate('SuggestedEventDetail', { event: item.title, id: item.id })} />
                </Container>
            );
        } else {
            return (
                <Container>
                    <Text>No Events found for this topic! Blaze the trail and create an event!</Text>
                </Container>
            )
        }
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
)(Suggested);

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
