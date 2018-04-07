import React from 'react';
import { Button, Container, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';
import { getURLForPlatform } from '../utils/networkUtils';
import { KootaListView } from '../utils/listView';
import { styles } from '../../assets/styles';

class Topic extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.topic,
        headerStyle: { backgroundColor: '#' + navigation.state.params.color },
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

        this.followTopic = this.followTopic.bind(this);
    }

    componentDidMount() {
        this.props.colorActions.changeColor(this.props.navigation.state.params.color);
        fetch(getURLForPlatform("phoenix") + "api/v1/events/search?topic=" + this.props.navigation.state.params.id, {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: responseObj });
            });

        fetch(getURLForPlatform("phoenix") + "api/v1/topics/" + this.props.navigation.state.params.id + "/follow/", {
            method: 'GET',
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseJSON => {
                this.setState({ followed: responseJSON["followedByUser"] });
            })
    }

    componentWillMount() {
        var mColors;
        if (this.state.colors && this.state.colors.length === 1 && this.state.colors[0] === "ffffff") {
            mColors = (new ColorScheme()).from_hex(this.props.navigation.state.params.color).scheme('mono');
            this.setState({ colors: mColors.colors() });
        } else {
            mColors = this.state.colors;
        }
    }

    componentWillUnmount() {
        this.props.colorActions.resetColor();
    }

    followTopic() {
        fetch(getURLForPlatform("phoenix") + "api/v1/topics/" + this.props.navigation.state.params.id + "/follow/", {
            method: 'POST',
            headers: {
                Authorization: "Token " + this.props.token
            },
            body: JSON.stringify({
                topic: this.props.navigation.state.params.id
            }),
        }).then(response => response.json())
            .then(responseJSON => {
                if ("followed" in responseJSON) {
                    this.setState({ followed: true });
                } else {
                    this.setState({ followed: false });
                }
            })
    }

    render() {
        if (this.state.data.length > 0) {
            return (
                <Container style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
                        <Button onPress={this.followTopic} style={{ justifyContent: "center" }}><Text>{this.state.followed && 'Unfollow'}{!this.state.followed && 'Follow'}</Text></Button>
                    </View>
                    <View style={{ flex: 10 }}>
                        <KootaListView data={this.state.data} pressCallback={(item) => this.props.navigation.navigate('EventDetail', { event: item.title, id: item.id })} />
                    </View>
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
        color: state.backgroundColorReducer.color,
        token: state.tokenReducer.token,
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
)(Topic);

