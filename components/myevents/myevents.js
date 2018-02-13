import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, StyleSheet, TouchableHighlight, View } from 'react-native';
import GridView from 'react-native-super-grid';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor';
import randomMC from 'random-material-color';

class MyEvents extends React.Component {

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

    render() {
        return (
            <Container>
                <Text>My Events View</Text>
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
    itemText: {
        color: 'white',
    }

});
