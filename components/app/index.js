import React from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import NavContainer from '../subviews/navcontainer'
import { Constants } from 'expo';
import * as colorActions from '../../redux/actions/backgroundColor'

class Index extends React.Component {

    state = {
        fontLoaded: false,
    };

    async componentWillMount() {
        this.props.colorActions.resetColor();
        await Expo.Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            'Roboto_thin': require('../../assets/fonts/Roboto-Thin.ttf'),
            'Roboto_bold': require('../../assets/fonts/Roboto-Bold.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{
                    backgroundColor: '#' + this.props.color,
                    height: Constants.statusBarHeight,
                    marginTop: -Constants.statusBarHeight
                }} />
                {
                    this.state.fontLoaded ? (

                        <NavContainer />

                    ) : null
                }
            </View>
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
)(Index);



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});
