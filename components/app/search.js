import React from 'react';
import { Container, Fab, Header, ListItem, Item, Input, Icon, Button, Text } from 'native-base';
import { SectionList, StyleSheet, TouchableHighlight, View } from 'react-native';
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
        fetch(getURLForPlatform() + "api/v1/search/?query=" + this.props.navigation.state.params.query).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: responseObj });
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
                            const date = new Date(item.created)
                            const color = getMaterialColor();
                            return (
                                <TouchableHighlight onPress={() => { this.props.navigation.navigate('EventDetailWrapper', { event: item.title, id: item.id, color: color }) }}>
                                    <View key={item.id} style={[styles.listitem, { backgroundColor: color, justifyContent: 'center', alignItems: 'center' }]}>
                                        <View style={{ padding: 5 }}>
                                            <Text style={[styles.itemText, { fontSize: 25, fontWeight: 'bold' }]}>{item.title}</Text>
                                        </View>
                                        <View style={{ padding: 5 }}>
                                            <Text style={{ color: 'white' }} numberOfLines={2}>{item.description}</Text>
                                        </View>
                                        <View style={{ padding: 5 }}>
                                            <Text style={{ color: 'white' }}>
                                                {getDayOfWeekFromDayNumber(date.getDay())} {getMonthNameFromMonthNumber(date.getMonth())} {date.getDate()}, {date.getFullYear()} @ {(date.getHours() % 12) + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + (date.getHours() < 12 ? 'AM' : 'PM')}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        }
                        if (section.title === "Offers") {
                            return (
                                <View key={item.id} style={[styles.listitem]}>
                                    <Text style={styles.itemText}>{item.name}</Text>
                                </View>
                            )
                        }
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
)(Search);

