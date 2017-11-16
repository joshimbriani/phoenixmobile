import React from 'react';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const testData = [
    {id: 0, title: "Let's Go Skiing 0!", date: Date.now(), capacity: 4, going: 3},
    {id: 1, title: "Let's Go Skiing 1!", date: Date.now(), capacity: 4, going: 3},
    {id: 2, title: "Let's Go Skiing 2!", date: Date.now(), capacity: 4, going: 3},
    {id: 3, title: "Let's Go Skiing 3!", date: Date.now(), capacity: 4, going: 3},
    {id: 4, title: "Let's Go Skiing 4!", date: Date.now(), capacity: 4, going: 3}
]

export default class Home extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.topic,
        headerStyle: { backgroundColor: navigation.state.params.color },
        headerRight: <Ionicons
            name='md-funnel'
            style={{ paddingRight: 10 }}
            size={35}
            onPress={() => navigation.navigate('DrawerOpen')} />
    });

    render() {
        StatusBar.setBackgroundColor(this.props.navigation.state.params.color);
        return (
            <Container>
                <FlatList
                    data={testData}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => (
                        <View key={item.id}>
                            <Text>{item.title}</Text>
                        </View>
                    )}
                />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    gridView: {
        flex: 1,
    },
    itemBox: {
        height: 150,
        backgroundColor: '#1abc9c',
        borderRadius: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        color: 'white',
    }

});
