import React from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Platform, Keyboard, ScrollView } from 'react-native';

import { Button, Content, Form, Input, Item, Label, Text, Icon } from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getURLForPlatform } from '../utils/networkUtils';
import { restrictedUsernames } from '../../assets/restrictedUsernames';
import PlatformIonicon from '../utils/platformIonicon';
import * as tokenActions from '../../redux/actions/token';
import fontBasedOnPlatform from '../utils/fontBasedOnPlatform';
import moment from 'moment';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            email: "",
            birthdate: "",
            gender: "",
            accept: false,
            error: {
                main: "",
                username: "",
                email: "",
                password: "",
                birthdate: "",
                gender: "",
                accept: ""
            },
            first: true,
            imageSize: 100
        }

        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.goToScreenAndErasePreviousScreens = this.goToScreenAndErasePreviousScreens.bind(this);
        this.register = this.register.bind(this);
        this.parseRegisterSuccess = this.parseRegisterSuccess.bind(this);
        this.continueToRegistration = this.continueToRegistration.bind(this);
        this.needToGoBack = this.needToGoBack.bind(this);
    }

    componentDidMount() {

        if (this.props.token) {
            if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.stay) {
                return;
            }

            this.goToScreenAndErasePreviousScreens('Main');
        }
    }

    setErrorUIState() {
        var goBack = false;
        var errorState = { main: "", username: "", email: "", password: "" }
        if (this.state.username === "") {
            errorState["username"] = "Enter your username!";
            goBack = true;
        }

        if (restrictedUsernames.indexOf(this.state.username.toLowerCase()) > -1) {
            errorState["username"] = "That username is restricted. Try a different username!";
            goBack = true;
        }

        if (this.state.password === "") {
            errorState["password"] = "Enter your password!";
            goBack = true;
        } else {
            if (this.state.password.length < 6) {
                errorState["password"] = "Your password needs to at least have 6 characters in it!";
                goBack = true;
            }
        }
        if (this.state.email === "") {
            errorState["email"] = "Enter your email!";
            goBack = true;
        } else {
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailRegex.test(this.state.email.toLowerCase())) {
                errorState["email"] = "That's not a valid email!";
                goBack = true;
            }
        }
        if (this.state.gender === "") {
            errorState["gender"] = "You need to select your gender!"
        }
        if (this.state.birthdate === "") {
            errorState["birthdate"] = "You need to select your birthdate!"
        }
        if (this.state.accept === "") {
            errorState["accept"] = "You need to accept our agreement!"
        }
        // Eventually we might want to enforce password difficulty
        // We'd do that here
        this.setState({ error: errorState });

        return goBack;
    }

    registrationIsValid() {
        const goBack = this.setErrorUIState();
        var valid = true;
        if (this.state.username === "" || this.state.password === "" || this.state.email === "" || this.state.gender === "" || this.state.birthdate === "" || !this.state.accept) {
            valid = false;
        }

        if (restrictedUsernames.indexOf(this.state.username.toLowerCase()) > -1) {
            valid = false;
        }

        if (this.state.password.length < 6) {
            valid = false;
        }

        //const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //valid = emailRegex.test(this.state.email.toLowerCase());

        return valid;
    }

    needToGoBack() {
        var goBack = false;
        if (this.state.username === "" || this.state.password === "" || this.state.email === "") {
            goBack = true;
        }

        if (restrictedUsernames.indexOf(this.state.username.toLowerCase()) > -1) {
            goBack = true;
        }

        if (this.state.password.length < 6) {
            goBack = true;
        }

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        goBack = goBack || !emailRegex.test(this.state.email.toLowerCase());

        return goBack;
    }

    resetErrorsBasedOnComponent(component) {
        var errorState = { main: "", username: this.state.error.username, password: this.state.error.password, email: this.state.error.email };
        if (component === "username") {
            errorState["username"] = "";
        } else if (component === "password") {
            errorState["password"] = "";
        } else if (component === "email") {
            errorState["email"] = "";
        } else if (component === "gender") {
            errorState["gender"] = "";
        } else if (component === "birthdate") {
            errorState["birthdate"] = "";
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
        this.setState({ first: false })
        if (this.registrationIsValid()) {
            this.register();
        }
    }

    register() {
        fetch(getURLForPlatform() + "api/v1/rest_auth/registration/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': this.state.username,
                'password1': this.state.password,
                'password2': this.state.password,
                'email': this.state.email,
            })
        }).then(response => response.json())
            .then(responseOrig => {
                if (responseOrig.key) {
                    fetch(getURLForPlatform() + "api/v1/rest_auth/registration/complete/", {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Token ' + responseOrig.key
                        },
                        body: JSON.stringify({
                            'birthdate': moment(this.state.birthdate, 'MM/DD/YYYY').toDate(),
                            'gender': this.state.gender
                        })
                    }).then(response => response.json())
                        .then(response => {
                            if (response["success"]) {
                                this.parseRegisterSuccess(responseOrig);
                            }
                        })
                } else {
                    this.parseRegisterError(responseOrig);
                }
            });
    }

    parseRegisterSuccess(response) {
        this.props.tokenActions.saveUserToken(response["key"]);
        this.goToScreenAndErasePreviousScreens('Main');
    }

    parseRegisterError(response) {
        var errorObject = { "error": { main: "", username: this.state.error.username, password: this.state.error.password, email: this.state.error.email } };
        if (response["username"]) {
            errorObject["error"]["username"] = response["username"][0];
        }
        if (response["password1"]) {
            errorObject["error"]["password"] = response["password1"][0];
        }
        if (response["email"]) {
            errorObject["error"]["email"] = response["email"][0];
        }
        errorObject["error"]["main"] = "Registration failed, please try again!";

        this.setState(errorObject);
        this.props.navigation.navigate('Register', {})
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

    continueToRegistration() {
        this.props.navigation.navigate('RegisterDetails', { onChange: this.onChange, submitForm: this.submitForm, birthdate: this.state.birthdate, gender: this.state.gender, error: this.state.error, needToGoBack: this.needToGoBack, first: this.state.first, accept: this.state.accept })
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
                            style={{ width: this.state.imageSize, height: this.state.imageSize }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    </View>
                </View>
                <ScrollView style={{ flex: 2 }} keyboardShouldPersistTaps={'handled'}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ marginTop: 30, marginBottom: 15 }}>
                            <View style={{ width: 250 }}>
                                <Item regular error={this.state.error.username !== ""}>
                                    <Icon android="md-person" ios="ios-person" />
                                    <Input name="username" placeholder="Username" autoCapitalize="none" onChangeText={(text) => this.onChange("username", text)} />
                                </Item>
                                {this.state.error.username !== "" && <View>
                                    <Text style={{ fontSize: 10, color: 'red' }}>{this.state.error.username}</Text>
                                </View>}
                            </View>
                        </View>
                        <View style={{ marginBottom: 15 }}>
                            <View style={{ width: 250 }}>
                                <Item regular error={this.state.error.email !== ""}>
                                    <Icon android="md-mail" ios="ios-mail" />
                                    <Input name="email" placeholder="Email" autoCapitalize="none" onChangeText={(text) => this.onChange("email", text)} />
                                </Item>
                                {this.state.error.email !== "" && <View>
                                    <Text style={{ fontSize: 10, color: 'red' }}>{this.state.error.email}</Text>
                                </View>}
                            </View>
                        </View>
                        <View>
                            <View style={{ width: 250 }}>
                                <Item regular error={this.state.error.password !== ""}>
                                    <Icon android="md-lock" ios="ios-lock" />
                                    <Input name="password" placeholder="Password" secureTextEntry={true} autoCapitalize="none" onChangeText={(text) => this.onChange("password", text)} />
                                </Item>
                                {this.state.error.password !== "" && <View>
                                    <Text style={{ fontSize: 10, color: 'red' }}>{this.state.error.password}</Text>
                                </View>}
                            </View>
                        </View>
                    </View>

                </ScrollView>
                <View style={{ marginVertical: 20, alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => this.continueToRegistration()}>
                        <View style={{ width: 300, height: 50, backgroundColor: '#006083', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>Continue Registration</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView >
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
)(Register);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorBackground: {
        backgroundColor: "red"
    },
    errorText: {
        paddingTop: 1,
        paddingLeft: 5,
        paddingBottom: 1,
        color: "white",
        fontFamily: fontBasedOnPlatform(),
    },
    imageHeader: {
        flex: 2,
        alignItems: 'center',
        backgroundColor: '#66b2b2',
    },
    image: {
        width: 100,
        flex: 1
    },
    formBody: {
        flex: 12,
    },
    registerButtons: {
        flex: 2,
        flexDirection: 'row'
    },
    registerButton: {
        flex: 7,
        marginTop: 10,
        marginLeft: 15
    },
    registerButtonContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    loginLinks: {
        flexDirection: 'row',
    },
    loginLink: {
        paddingBottom: 2,
        marginRight: 2,
        textDecorationLine: 'underline'
    },
    alreadyText: {
        paddingBottom: 2,
        paddingLeft: 2
    },
    platformFont: {
        fontFamily: fontBasedOnPlatform(),
    },
    socialIcons: {
        width: 50,
        height: 50,
        marginRight: 5
    },
    socialIconOverlay: {
        flex: 3,
        marginTop: 10
    },
    registerButtonText: {
        textAlign: "center",
        flex: 1
    },
    inputErrorContainer: {
        backgroundColor: "red",
        marginTop: 10
    },
    inputErrorText: {
        paddingTop: 1,
        paddingLeft: 5,
        paddingBottom: 1,
        color: "white",
        fontFamily: fontBasedOnPlatform(),
    },
    socialSeparator: {
        marginTop: 10,
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15
    }

});
