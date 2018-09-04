import React from 'react';
import { Button, Container, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View, Platform } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { getURLForPlatform } from '../utils/networkUtils';
import {KootaListView} from '../utils/listView';
import Icon from 'react-native-vector-icons/Ionicons';

class Suggested extends React.Component {

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        headerRight: <Icon
            name='md-funnel'
            style={{ paddingRight: 10 }}
            size={35}
            onPress={() => navigation.navigate('Filter')} />

    }) : ({ navigation }) => ({
        headerRight: <Icon
            name='ios-funnel'
            style={{ paddingRight: 10 }}
            size={35}
            onPress={() => navigation.navigate('Filter')} />
    });

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }

    }

    componentDidMount() {
        fetch(getURLForPlatform() + "api/v1/user/" + this.props.user.id + "/recommendations/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: responseObj });
            });
    }

    // TODO: Probably need to switch this from a "SuggestedEventDetailView to the generic EventDetailView"
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
        user: state.userReducer.user,
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
