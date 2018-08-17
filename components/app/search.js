import React from 'react';
import { Container, Fab, Header, ListItem, Item, Input, Icon, Button, Text } from 'native-base';
import { SectionList, StyleSheet, TouchableHighlight, View, TouchableOpacity } from 'react-native';
import GridView from 'react-native-super-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor';
import PlatformIonicon from '../utils/platformIonicon';
import { getURLForPlatform } from '../utils/networkUtils';
import { styles } from '../../assets/styles';

import { getMaterialColor } from '../utils/styleutils';
import { getDayOfWeekFromDayNumber, getMonthNameFromMonthNumber } from '../utils/datetimeUtils';

class Search extends React.Component {
    state = {
        active: false,
        data: [],
        loading: true
    };

    static navigationOptions = ({ navigation }) => ({
        title: "Search: " + navigation.state.params.query,
        headerRight: <PlatformIonicon
            name='funnel'
            style={{ paddingRight: 10 }}
            size={35}
            onPress={() => navigation.navigate('Filter')} />
    });

    componentDidMount() {
        this.props.colorActions.resetColor();
        fetch(getURLForPlatform() + "api/v1/search/?query=" + this.props.navigation.state.params.query, {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: responseObj, loading: false });
            })
    }

    renderEmptySections(section) {
        if (section.data.length > 0) {
            return <ListItem itemDivider><Text>{section.title}</Text></ListItem>
        } else {
            return null
            return (<View>
                <ListItem itemDivider><Text>{section.title}</Text></ListItem>
                <View><Text>No Results</Text></View>
            </View>
            )
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Loading...</Text>
                </View>
            )
        } else {
            if (this.state.data[0]["data"].length > 0 || this.state.data[1]["data"].length > 0 || this.state.data[2]["data"].length > 0) {
                return (
                    <Container>
                        <SectionList
                            renderItem={({ item, section }) => {
                                if (section.title === "Topics") {
                                    return (
                                        <TouchableHighlight onPress={() => { this.props.navigation.navigate('Topic', { topic: item.name, id: item.id, color: item.color.substring(0) }) }}>
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
                                }
                                if (section.title === "Events") {
                                    const date = new Date(item.datetime)
                                    return (
                                        <TouchableHighlight onPress={() => { this.props.navigation.navigate('EventDetailWrapper', { event: item.title, id: item.id, color: item.color }) }}>
                                            <View key={item.id} style={[styles.listitem, { backgroundColor: item.color, justifyContent: 'center', alignItems: 'center' }]}>
                                                <View style={{ paddingBottom: 5, paddingTop: 15 }}>
                                                    <Text style={[styles.itemText, { fontSize: 20, fontWeight: 'bold' }]}>{item.title}</Text>
                                                </View>
                                                <View style={{ padding: 10 }}>
                                                    <Text style={{ color: 'white', fontSize: 15 }} numberOfLines={2}>{item.description}</Text>
                                                </View>
                                                <View style={{ paddingTop: 5, paddingBottom: 15 }}>
                                                    <Text style={{ color: 'white', fontSize: 17 }}>
                                                        {getDayOfWeekFromDayNumber(date.getDay())} {getMonthNameFromMonthNumber(date.getMonth())} {date.getDate()}, {date.getFullYear()} @ {(date.getHours() % 12) + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + (date.getHours() < 12 ? 'AM' : 'PM')}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    )
                                }
                                if (section.title === "Offers") {
                                    const color = getMaterialColor();
                                    return (
                                        <TouchableOpacity onPress={() => { console.log("Will create an event with this offer.") }}>
                                            <View key={item.id} style={[styles.listitem, { backgroundColor: color, justifyContent: 'center', alignItems: 'center' }]}>
                                                <View style={{ padding: 5 }}>
                                                    <Text style={[styles.itemText, { fontSize: 25, fontWeight: 'bold' }]}>{item.name}</Text>
                                                </View>
                                                <View style={{ padding: 10 }}>
                                                    <Text style={{ color: 'white' }} numberOfLines={2}>{item.description}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }
                            }}
                            renderSectionHeader={({ section }) => this.renderEmptySections(section)}
                            sections={this.state.data}
                            keyExtractor={(item, index) => index} />
                    </Container>
                );
            } else {
                return (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>No results found! Maybe phrase it differently differently?</Text>
                    </View>
                )
            }
        }

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
        colorActions: bindActionCreators(colorActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);

