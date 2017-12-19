import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, StyleSheet, TouchableHighlight, View } from 'react-native';
import GridView from 'react-native-super-grid';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../redux/actions/backgroundColor';
import randomMC from 'random-material-color';

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

class Home extends React.Component {
    state = {
        active: false,
        data: []
    };

    componentDidMount() {
        this.props.colorActions.resetColor();
        fetch("http://10.0.2.2:8000/topics/?format=json").then(response => response.json())
            .then(responseObj => {
                this.setState({ data: [{name:"IDK", color: "#0000ff", icon: "help"}].concat(responseObj) });
            })
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Phoenix',
        headerLeft: <Ionicons
            name="md-menu"
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.navigate('DrawerOpen')} />
    });

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
                    enableEmptySections
                    items={this.state.data}
                    renderItem={item => {
                        return (
                            <TouchableHighlight onPress={() => { this.props.navigation.navigate('Topic', { topic: item.name, color: item.color.substring(0) }) }}>
                                <View
                                    style={[styles.itemBox, { backgroundColor: item.color }]}
                                >
                                    <Ionicons
                                        name={"md-" + (item.icon || 'add')}
                                        size={50}
                                        style={{ color: "white" }}
                                    />
                                    <Text style={styles.itemText}>{item.name}</Text>
                                </View>
                            </TouchableHighlight>
                        )
                    }} />
                <Fab
                    active={this.state.active}
                    containerStyle={{}}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('NewEvent', { topic: "" })}>
                    <Ionicons
                        name={"md-add"}
                        size={50}
                        style={{ color: "white" }}
                    />
                </Fab>
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
)(Home);

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
