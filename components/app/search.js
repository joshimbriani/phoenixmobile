import React from 'react';
import { Container, Fab, Header, ListItem, Item, Input, Icon, Button, Text } from 'native-base';
import { SectionList, StyleSheet, TouchableHighlight, View } from 'react-native';
import GridView from 'react-native-super-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor';
import PlatformIonicon from '../utils/platformIonicon';
import {getURLForPlatform} from '../utils/networkUtils';


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
        fetch(getURLForPlatform("phoenix") + "api/v1/search?query=" + this.props.navigation.state.params.query).then(response => response.json())
            .then(responseObj => {
                this.setState({ data: responseObj });
            })
    }

    renderEmptySections(section) {
        if (section.data.length > 0) {
            return <ListItem itemDivider><Text>{section.title}</Text></ListItem>
        } else {
            return (<View>
                        <ListItem itemDivider><Text>{section.title}</Text></ListItem>
                        <ListItem><Text>No Results</Text></ListItem>
                    </View>
                    )
        }
    }

    render() {
        return (
            <Container>
                <SectionList
                    renderItem={({item, section}) => {
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
                            return (
                                <TouchableHighlight onPress={() => { this.props.navigation.navigate('EventDetail', { event: item.title, id: item.id }) }}>
                                    <View key={item.id} style={[styles.listitem]}>
                                        <Text style={styles.itemText}>{item.title}</Text>
                                    </View>
                                </TouchableHighlight>
                            )
                        }
                    }}
                    renderSectionHeader={({section}) => this.renderEmptySections(section)}
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
