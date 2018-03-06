import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, RefreshControl,StyleSheet, TouchableHighlight, View } from 'react-native';
import GridView from 'react-native-super-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor';
import * as userActions from '../../redux/actions/user';
import PlatformIonicon from '../utils/platformIonicon';
import randomMC from 'random-material-color';
import { getURLForPlatform } from '../utils/networkUtils';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            data: [],
            searchQuery: "",
            refreshing: false,
        };

        this.changeValue = this.changeValue.bind(this);
    }

    componentDidMount() {
        this.props.userActions.loadUser(this.props.token);
        this.props.colorActions.resetColor();
        fetch(getURLForPlatform() + "api/v1/users/topics/?format=json", {
            Authorization: "Token " + this.props.token
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: [{ id: -1, name: "IDK", color: "0097e6", icon: "help" }].concat(responseObj) });
            })
    }

    componentWillReceiveProps() {
        // Not sure why I have this. Do I want it to be auto refreshed?
        /*fetch(getURLForPlatform() + "api/v1/users/topics/?format=json", {
            Authorization: "Token " + this.props.token
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: [{ id: -1, name: "IDK", color: "0000ff", icon: "help" }].concat(responseObj) });
            })*/
    }

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'Home',
        headerLeft: <PlatformIonicon
            name="menu"
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.navigate('DrawerOpen')} />
    }) : ({ navigation }) => ({
        title: 'Home',
        headerStyle: { paddingTop: -22, }
    });

    changeValue(text) {
        this.setState({ searchQuery: text });
    }

    routeToTopic(item) {
        if (item.id === -1) {
            this.props.navigation.navigate('IDK', {});
        } else {
            this.props.navigation.navigate('Topic', { topic: item.name, id: item.id, color: item.color.substring(0) })
        }
    }

    _onRefresh() {
        fetch(getURLForPlatform() + "api/v1/users/topics/?format=json", {
            Authorization: "Token " + this.props.token
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ refreshing: false, data: [{ id: -1, name: "IDK", color: "#0097e6", icon: "help" }].concat(responseObj) });
            })
    }

    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="What Do You Wanna Do?" onChangeText={(text) => this.changeValue(text)} onSubmitEditing={() => { this.props.navigation.navigate('Search', { query: this.state.searchQuery }) }} />
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>
                <GridView
                    contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}
                    style={styles.gridView}
                    itemWidth={150}
                    enableEmptySections
                    items={this.state.data}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    renderItem={item => {
                        return (
                            <TouchableHighlight onPress={() => { this.routeToTopic(item) }}>
                                <View
                                    style={[styles.itemBox, { backgroundColor: '#' + item.color }]}
                                >
                                    <PlatformIonicon
                                        name={item.icon || 'aperture'}
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
                    style={{ backgroundColor: '#e84118' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('NewEvent', { topic: "" })}>
                    <PlatformIonicon
                        name={"add"}
                        size={50} //this doesn't adjust the size...?
                        style={{ color: "white" }}
                    />
                </Fab>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        color: state.backgroundColorReducer.color,
        token: state.tokenReducer.token
    };
}

function mapDispatchToProps(dispatch) {
    return {
        colorActions: bindActionCreators(colorActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
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
