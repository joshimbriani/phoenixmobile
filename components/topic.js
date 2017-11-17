import React from 'react';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as colorActions from '../redux/actions/backgroundColor'

const testData = [
    {id: 0, title: "Let's Go Skiing 0!", date: Date.now(), capacity: 4, going: 3, color: 'firebrick'},
    {id: 1, title: "Let's Go Skiing 1!", date: Date.now(), capacity: 4, going: 3, color: 'khaki'},
    {id: 2, title: "Let's Go Skiing 2!", date: Date.now(), capacity: 4, going: 3, color: 'lawngreen'},
    {id: 3, title: "Let's Go Skiing 3!", date: Date.now(), capacity: 4, going: 3, color: 'lightcoral'},
    {id: 4, title: "Let's Go Skiing 4!", date: Date.now(), capacity: 4, going: 3, color: 'magenta'}
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

    componentDidMount() {
        this.props.colorActions.changeColor(this.props.navigation.state.params.color); 
    }

    componentWillUnmount() {
        this.props.colorActions.resetColor();
    }

    render() {
        StatusBar.setBackgroundColor(this.props.navigation.state.params.color);
        return (
            <Container>
                <FlatList
                    data={testData}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => (
                        <View key={item.id} style={[styles.listitem, {backgroundColor: item.color}]}>
                            <Text>{item.title}</Text>
                        </View>
                    )}
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
        marginTop: 5,
        marginBottom: 5
    },
    itemText: {
        color: 'white',
    }

});
