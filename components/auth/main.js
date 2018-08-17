import React from 'react';
import { Image, View, Button, TouchableOpacity, Text } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';

import { styles } from '../../assets/styles';

class Main extends React.Component {

    componentDidMount() {
        if (this.props.token) {
            if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.stay) {
                return;
            }

            this.goToScreenAndErasePreviousScreens('Main');
        }
    }

    goToScreenAndErasePreviousScreens(targetRoute) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: targetRoute }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 1, alignItems: 'center'}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Image
                            source={require('../../assets/images/logologin.png')}
                            style={{width: 250, height: 112}}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                        <Text style={{fontSize: 25, color: '#00ABE6'}}>for friends</Text>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register', {})}>
                            <View style={{ width: 250, height: 50, backgroundColor: '#006083', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{color: 'white', fontSize: 20}}>Register</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop: 10}}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login', {})}>
                            <View style={{ width: 250, height: 50, backgroundColor: '#00ABE6', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{color: 'white', fontSize: 20}}>Login</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);

