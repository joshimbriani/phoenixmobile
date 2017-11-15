import React from 'react';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, StyleSheet, TouchableHighlight,View } from 'react-native';
import GridView from 'react-native-super-grid';
import Ionicons from 'react-native-vector-icons/Ionicons';

//TODO: Change this to a server generated list
//TODO: Change the icon to dynamically switch between md- and ios-
const categories = [{ name: 'IDK', hotness: 1.00, icon: 'help', color: 'aquamarine' },
{ name: 'Football', hotness: 0.95, icon: 'football', color: 'blueviolet' },
{ name: 'Rock and Roll', hotness: 0.89, icon: 'microphone', color: 'coral' },
{ name: 'Taylor Swift', hotness: 0.80, icon: 'musical-note', color: 'crimson' },
{ name: 'Pokemon', hotness: 0.70, icon: 'game-controller-a', color: 'darkgoldenrod' },
{ name: 'Programming', hotness: 0.50, icon: 'git-branch', color: 'darkolivegreen' },
{ name: 'Traveling', hotness: 0.45, icon: 'globe', color: 'deeppink' },
{ name: 'Ice Cream', hotness: 0.30, icon: 'ice-cream', color: 'slateblue' }];

export default class Home extends React.Component {

    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="What Do You Wanna Do?" />
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>
                <GridView
                    contentContainerStyle={{ paddingBottom: 10 }}
                    style={styles.gridView}
                    itemWidth={150}
                    items={categories}
                    renderItem={item => (
                        <TouchableHighlight onPress={() => { Alert.alert('You touched the button for ' + item.name + '') }}>
                            <View
                                style={[styles.itemBox, { backgroundColor: item.color }]}
                            >
                                <Ionicons
                                    name={"md-" + item.icon}
                                    size={50}
                                    style={{ color: "white" }}
                                />
                                <Text style={styles.itemText}>{item.name}</Text>
                            </View>
                        </TouchableHighlight>
                    )} />
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
