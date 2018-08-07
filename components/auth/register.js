import React from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';

import { Button, Content, Form, Input, Item, Label, Text } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getURLForPlatform } from '../utils/networkUtils';
import PlatformIonicon from '../utils/platformIonicon';
import * as tokenActions from '../../redux/actions/token';
import fontBasedOnPlatform from '../utils/fontBasedOnPlatform';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            email: "",
            error: {
                main: "",
                username: "",
                email: "",
                password: ""
            }
        }

        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.goToScreenAndErasePreviousScreens = this.goToScreenAndErasePreviousScreens.bind(this);
        this.register = this.register.bind(this);
        this.parseRegisterSuccess = this.parseRegisterSuccess.bind(this); 
    }

    componentDidMount() {
        /*const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Register' })
            ]
          });
          
            this.props.navigation.dispatch(resetAction);*/
          
          
        if (this.props.token) {
            if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.stay) {
                return;
            }

            this.goToScreenAndErasePreviousScreens('Main');
        }
    }

    setErrorUIState() {
        var errorState = { main: "", username: "", email: "", password: "" }
        if (this.state.username === "") {
            errorState["username"] = "Enter your username!";
        }
        if (this.state.password === "") {
            errorState["password"] = "Enter your password!";
        } else {
            if (this.state.password.length < 6) {
                errorState["password"] = "Your password needs to at least have 6 characters in it!";
            }
        }
        if (this.state.email === "") {
            errorState["email"] = "Enter your email!";
        } else {
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailRegex.test(this.state.email.toLowerCase())) {
                errorState["email"] = "That's not a valid email!";
            }
        }
        // Eventually we might want to enforce password difficulty
        // We'd do that here
        this.setState({ error: errorState });
    }

    registrationIsValid() {
        this.setErrorUIState();
        if (this.state.username === "" || this.state.password === "" || this.state.email === "") {
            return false;
        }
        if (this.state.password.length < 6) {
            return false;
        }
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(this.state.email.toLowerCase());
    }

    resetErrorsBasedOnComponent(component) {
        var errorState = { main: "", username: this.state.error.username, password: this.state.error.password, email: this.state.error.email };
        if (component === "username") {
            errorState["username"] = "";
        } else if (component === "password") {
            errorState["password"] = "";
        } else if (component === "email") {
            errorState["email"] = "";
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
        if (this.registrationIsValid()) {
            this.register();
        }
    }

    register() {
        fetch(getURLForPlatform() + "rest_auth/registration/", {
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
        .then(response => { 
            if (response.key) { 
                this.parseRegisterSuccess(response);
            } else { 
                this.parseRegisterError(response);
            } 
        });
    }

    parseRegisterSuccess(response) {
        this.props.tokenActions.saveUserToken(response["key"]);
        this.goToScreenAndErasePreviousScreens('Main');
    }

    parseRegisterError(response) {
        var errorObject = {"error": { main: "", username: this.state.error.username, password: this.state.error.password, email: this.state.error.email }};
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
    }

    goToScreenAndErasePreviousScreens(targetRoute) {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: targetRoute }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }


    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? "padding" : ""}>
                {this.state.error.main !== "" && <View style={styles.errorBackground}>
                    <Text style={styles.errorText}>{this.state.error.main}</Text>
                </View>}
                <View style={styles.imageHeader}>
                    <Image
                        source={require('../../assets/images/logologin.png')}
                        style={styles.image}
                        resizeMethod="resize"
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.formBody}>
                    <Content style={styles.inputWrapper}>
                        {this.state.error.username !== "" && <View style={styles.inputErrorContainer}>
                            <Text style={styles.inputErrorText}>{this.state.error.username}</Text>
                        </View>}
                        <Item stackedLabel>
                            <Label>Username</Label>
                            <Input name="username" autoCapitalize="none" onChangeText={(text) => this.onChange("username", text)} />
                        </Item>
                        {this.state.error.email !== "" && <View style={styles.inputErrorContainer}>
                            <Text style={styles.inputErrorText}>{this.state.error.email}</Text>
                        </View>}
                        <Item stackedLabel>
                            <Label>Email</Label>
                            <Input name="email" autoCapitalize="none" onChangeText={(text) => this.onChange("email", text)} />
                        </Item>
                        {this.state.error.password !== "" && <View style={styles.inputErrorContainer}>
                            <Text style={styles.inputErrorText}>{this.state.error.password}</Text>
                        </View>}
                        <Item style={styles.separatingMargin} stackedLabel last>
                            <Label>Password</Label>
                            <Input name="password" secureTextEntry={true} autoCapitalize="none" onChangeText={(text) => this.onChange("password", text)} />
                        </Item>
                    </Content>
                </View>
                <View style={styles.registerButtons}>
                    <Button onPress={this.submitForm} style={styles.registerButton}>
                        <View style={styles.registerButtonContainer}>
                            <Text style={styles.registerButtonText}>Register</Text>
                        </View>
                    </Button>
                    <View style={styles.socialSeparator}>
                        <Text style={styles.empty}>Or Register</Text>
                        <Text style={styles.empty}>With</Text>
                    </View>
                    <TouchableOpacity onPress={this.submitForm} style={styles.socialIconOverlay}>
                        <Image
                            source={require('../../assets/images/icons/facebookicon.png')}
                            style={styles.socialIcons}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.submitForm} style={styles.socialIconOverlay}>
                        <Image
                            source={require('../../assets/images/icons/googleicon.png')}
                            style={styles.socialIcons}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.loginLinks}>
                    <Text style={[styles.platformFont, styles.alreadyText]}>Already have an account?</Text>
                    <View style={{flex: 1}} />
                    <Text style={[styles.loginLink, styles.platformFont]} onPress={() => this.props.navigation.navigate('Login', {})}>Login</Text>
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
