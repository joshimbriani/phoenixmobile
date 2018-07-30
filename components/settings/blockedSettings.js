import React from 'react';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';
import { styles } from '../../assets/styles';

class BlockedUserSettings extends React.Component {

    render() {
            return (
                <Container>
                    <Text>Blocked User Settings</Text>
                </Container>
            );
    }
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BlockedUserSettings);