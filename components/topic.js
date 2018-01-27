import React from 'react';
import { Button, Container, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import PlatformIonicon from './utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';
import getURLForPlatform from './utils/networkUtils';

class Topic extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.topic,
        headerStyle: { backgroundColor: navigation.state.params.color },
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
            data: []
        }
    }

    componentDidMount() {
        this.props.colorActions.changeColor(this.props.navigation.state.params.color);
        fetch(getURLForPlatform() + "api/v1/events/search?topic=" + this.props.navigation.state.params.id).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: responseObj });
            })
    }

    componentWillMount() {
        var mColors;
        if (this.state.colors && this.state.colors.length === 1 && this.state.colors[0] === "fff") {
            mColors = (new ColorScheme()).from_hex(this.props.navigation.state.params.color.substring(1)).scheme('mono');
            this.setState({ colors: mColors.colors() });
        } else {
            mColors = this.state.colors;
        }
    }

    componentWillUnmount() {
        this.props.colorActions.resetColor();
    }

    followTopic() {
        fetch(getURLForPlatform() + "api/v1/events/search?topic=" + this.props.navigation.state.params.id).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: responseObj });
            })
        this.props.navigation.state.params.id
    }

    render() {
        if (this.state.data.length > 0) {
            return (
                <Container style={{ flex: 1}}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
                        <Button onPress={this.followTopic} style={{justifyContent: "center"}}><Text>Follow</Text></Button>
                    </View>
                    <View style={{ flex:10 }}>
                        <FlatList
                            data={this.state.data}
                            contentContainerStyle={{ paddingTop: 0 }}
                            keyExtractor={(item, index) => index}
                            style={styles.listView}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableHighlight onPress={() => { this.props.navigation.navigate('EventDetail', { event: item.title, id: item.id, color: this.props.navigation.state.params.color }) }}>
                                        <View key={item.id} style={[styles.listitem, { backgroundColor: "#" + this.state.colors[index % this.state.colors.length] }]}>
                                            <Text style={styles.itemText}>{item.title}</Text>
                                        </View>
                                    </TouchableHighlight>
                                )
                            }}
                        />
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
)(Topic);

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
