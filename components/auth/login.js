import React from 'react';
import { Image, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';

import { Button, Content, Form, Input, Item, Label, Text, Icon } from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getURLForPlatform } from '../utils/networkUtils';
import PlatformIonicon from '../utils/platformIonicon';
import * as tokenActions from '../../redux/actions/token';
import { styles } from '../../assets/styles';
import fontBasedOnPlatform from '../utils/fontBasedOnPlatform';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: {
                main: "",
                username: "",
                password: ""
            }
        }

        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.goToScreenAndErasePreviousScreens = this.goToScreenAndErasePreviousScreens.bind(this);
        this.sendLoginRequest = this.sendLoginRequest.bind(this);
    }

    componentDidMount() {
        if (this.props.token) {
            this.goToScreenAndErasePreviousScreens('Main');
        }
    }

    formIsValid() {
        this.setErrorUIState();
        if (this.state.username === "" || this.state.password === "") {
            return false;
        }
        return true;
    }

    setErrorUIState() {
        var errorState = { main: "", username: "", password: "" }
        if (this.state.username === "") {
            errorState["username"] = "Enter your username!";
        }
        if (this.state.password === "") {
            errorState["password"] = "Enter your password!";
        }
        this.setState({ error: errorState });
    }

    resetErrorsBasedOnComponent(component) {
        var errorState = { main: "", username: this.state.error.username, password: this.state.error.password };
        if (component === "username") {
            errorState["username"] = "";
        } else if (component === "password") {
            errorState["password"] = "";
        }
        return errorState;
    }

    onChange(component, value) {
        var stateRepresentation = {};
        stateRepresentation[component] = value;
        stateRepresentation["error"] = this.resetErrorsBasedOnComponent(component);
        this.setState(stateRepresentation);
    }

    submitForm() {
        if (this.formIsValid()) {
            this.sendLoginRequest();
        }
    }

    /*
        Response.json returns a promise. We need to have it in a then.
    */
    sendLoginRequest() {
        fetch(getURLForPlatform() + "api/v1/rest_auth/login/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': this.state.username,
                'password': this.state.password,
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return false;
            }
        })
            .then(response => {
                if (response) {
                    this.handleLoginSuccess(response)
                } else {
                    this.handleLoginFailure();
                }
            });
    }

    handleLoginSuccess(response) {
        this.props.tokenActions.saveUserToken(response["key"]);
        this.goToScreenAndErasePreviousScreens('Main');
    }

    handleLoginFailure() {
        this.setState({ error: { main: "Incorrect username or password. Is there another one it could be?", username: "", password: "" } });
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
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }} behavior={Platform.OS === 'ios' ? "padding" : null} >
                {this.state.error.main !== "" && <View style={styles.errorBackground}>
                    <Text style={styles.errorText}>{this.state.error.main}</Text>
                </View>}
                <View style={{ flex: 1 }}>
                    <View>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon android="md-arrow-back" ios="ios-arrow-back" style={{ fontSize: 40, margin: 5 }} />
                        </TouchableOpacity>

                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('../../assets/images/KootaK.png')}
                            style={{ width: 100, height: 100 }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 15 }}>
                                <View style={{ width: 250 }}>
                                    <Item regular error={this.state.error.username !== ""}>
                                        <Icon android="md-person" ios="ios-person" />
                                        <Input name="username" placeholder="Username" autoCapitalize="none" onChangeText={(text) => this.onChange("username", text)} />
                                    </Item>
                                    {this.state.error.username !== "" && <View>
                                        <Text style={{fontSize: 10, color: 'red'}}>{this.state.error.username}</Text>
                                    </View>}
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: 250 }}>
                                    <Item regular error={this.state.error.password !== ""}>
                                        <Icon android="md-lock" ios="ios-lock" />
                                        <Input name="password" placeholder="Password" secureTextEntry={true} autoCapitalize="none" onChangeText={(text) => this.onChange("password", text)} />
                                    </Item>
                                    {this.state.error.password !== "" && <View>
                                        <Text style={{fontSize: 10, color: 'red'}}>{this.state.error.password}</Text>
                                    </View>}
                                </View>
                            </View>
                        </View>

                </View>
                <View style={{ marginVertical: 20, alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => this.submitForm()}>
                        <View style={{ width: 300, height: 50, backgroundColor: '#00ABE6', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>Login</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        tokenActions: bindActionCreators(tokenActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

