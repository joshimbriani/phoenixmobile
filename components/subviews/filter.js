import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, StyleSheet, TouchableHighlight, View } from 'react-native';
import GridView from 'react-native-super-grid';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor';
import randomMC from 'random-material-color';

class Filter extends React.Component {

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'Phoenix',
        headerLeft: <PlatformIonicon
            name="close"
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.goBack()} />
    }) : ({ navigation }) => ({
        title: 'Phoenix',
        headerStyle: {paddingTop:-22,}
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
                            <TouchableHighlight onPress={() => { this.props.navigation.navigate('Topic', { topic: item.name, id: item.id, color: item.color.substring(0) }) }}>
                                <View
                                    style={[styles.itemBox, { backgroundColor: item.color }]}
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
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('NewEvent', { topic: "" })}>
                    <PlatformIonicon
                        name="add"
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
)(Filter);

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
