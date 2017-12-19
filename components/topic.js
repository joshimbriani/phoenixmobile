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

class Topic extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.topic,
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
            colors: ["fff"]
        }
    }

    componentDidMount() {
        this.props.colorActions.changeColor(this.props.navigation.state.params.color);
        fetch("http://10.0.2.2:8000/events/?format=json").then(response => response.json())
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

    render() {
        return (
            <Container>
                <FlatList
                    data={this.state.data}
                    contentContainerStyle={{ paddingTop: 10 }}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => {
                        return (
                            <View key={item.id} style={[styles.listitem, { backgroundColor: "#" + this.state.colors[index % this.state.colors.length] }]}>
                                <Text style={styles.itemText}>{item.title}</Text>
                            </View>
                        )
                    }}
                />
            </Container>
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
    }

});
