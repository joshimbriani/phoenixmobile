import React from 'react';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';
import { styles } from '../../assets/styles';

class HelpSettings extends React.Component {

    render() {
            return (
                <Container>
                    <Text style = {styles.itemText}>
                    "Good help is hard to find"      why gps (1. events near me, 2. validate attendance, 3. send offers to phone when at location with other attendees)
                    </Text>
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
)(HelpSettings);