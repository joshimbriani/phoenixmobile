import React from 'react';
import { Container, Fab, Header, ListItem, Item, Input, Icon, Button, Text } from 'native-base';
import { Platform, SectionList, StyleSheet, TouchableHighlight, View } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import MyEventDetailWrapper from './myEventDetailWrapper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getURLForPlatform } from '../utils/networkUtils';


class MyEvents extends React.Component {
    state = {
        data: [],
    }

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'My Events',
        headerLeft: <PlatformIonicon
            name="menu"
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.navigate('DrawerOpen')} />
    }) : ({ navigation }) => ({
        title: 'My Events',
        headerStyle: { paddingTop: -22, }
    });

    componentDidMount() {
        fetch(getURLForPlatform("phoenix") + "api/v1/events/my", {
            method: 'GET',
            Authorization: "Token " + this.props.token
        })
            .then(response => response.json())
            .then(responseObj => {
                this.setState({ data: responseObj });
            })
    }

    renderEmptySections(section) {
        if (section.data.length > 0) {
            return <ListItem itemDivider><Text>{section.title}</Text></ListItem>
        } else {
            return (<View>
            </View>
            )
        }
    }

    noEventsInMyEvents() {
        var eventNum = 0;
        if (this.state.data.length > 0) {
            eventNum += this.state.data[0]["data"].length
            eventNum += this.state.data[1]["data"].length
            eventNum += this.state.data[2]["data"].length
            eventNum += this.state.data[3]["data"].length
        }
        return eventNum;
    }

    render() {
        if (this.noEventsInMyEvents() === 0) {
            return (
                <View>
                    <Text>You aren't associated with any events! Create or sign up for some!</Text>
                </View>
            )
        }
        return (
            <Container>
                <SectionList
                    renderItem={({ item, section }) => {
                        return (
                            <TouchableHighlight onPress={() => { this.props.navigation.navigate('MyEventsDetail', { title: item.title, id: item.id }); }}>
                                <View key={item.id} style={[styles.listitem]}>
                                    <Text style={styles.itemText}>{item.title}</Text>
                                </View>
                            </TouchableHighlight>
                        )
                    }}
                    renderSectionHeader={({ section }) => this.renderEmptySections(section)}
                    sections={this.state.data}
                    keyExtractor={(item, index) => index} />
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyEvents);

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