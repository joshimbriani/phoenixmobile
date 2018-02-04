import React from 'react';
import { Container, Header, Item, Input, Icon, Form, Label, Button, Text, Content } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, View, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as tokenActions from '../../redux/actions/token'
import PlatformIonicon from '../utils/platformIonicon';
import { getURLForPlatform } from '../utils/networkUtils';

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

    sendLoginRequest() {
        fetch(getURLForPlatform() + "rest-auth/login/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': this.state.username,
                'password': this.state.password,
            })
        }).then(response => { if (response.ok) { 
            this.handleLoginSuccess(response.json()) 
        } else { 
            this.handleLoginFailure();
        } });
    }

    handleLoginSuccess(response) {
        this.props.tokenActions.saveUserToken(response["key"]);
        this.goToScreenAndErasePreviousScreens('Main');
    }

    handleLoginFailure() {
        this.setState({ error: { main: "Login failed. Try again!", username: "", password: "" } }); 
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
            <KeyboardAvoidingView style={styles.container} behavior="padding" >
                {this.state.error.main !== "" && <View style={styles.errorBackground}>
                    <Text style={styles.errorText}>{this.state.error.main}</Text>
                </View>}
                <View style={styles.loginHeader}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/images/logologin.png')}
                            style={styles.image}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.sloganContainer}>
                        <Text style={styles.slogan}>Curing Loneliness</Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Content style={styles.inputWrapper}>
                        {this.state.error.username !== "" && <View style={styles.inputErrorContainer}>
                            <Text style={styles.inputErrorText}>{this.state.error.username}</Text>
                        </View>}
                        <Item stackedLabel>
                            <Label>Username</Label>
                            <Input name="username" autoCapitalize="none" onChangeText={(text) => this.onChange("username", text)} />
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
                <View style={styles.loginButtonContainer}>
                    <Button onPress={this.submitForm} style={styles.mainLoginButton}>
                        <View style={styles.mainLoginTextContainer}>
                            <Text style={styles.mainLoginText}>Log In</Text>
                        </View>
                    </Button>
                    <View style={styles.socialLoginButtonSeparator}>
                        <Text style={styles.robotoThin}>Or Log</Text>
                        <Text style={styles.robotoThin}>In With</Text>
                    </View>
                    <TouchableOpacity onPress={this.submitForm} style={styles.socialLoginButtonOverlay}>
                        <Image
                            source={require('../../assets/images/icons/facebookicon.png')}
                            style={styles.socialIcons}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.submitForm} style={styles.socialLoginButtonOverlay}>
                        <Image
                            source={require('../../assets/images/icons/googleicon.png')}
                            style={styles.socialIcons}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
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
        fontFamily: "Roboto"
    },
    loginHeader: { 
        flex: 3, 
        alignItems: "center", 
        backgroundColor: '#66b2b2' 
    },
    imageContainer: { 
        marginTop: 10, 
        flex: 3 
    },
    image: { 
        width: 200, 
        flex: 1 
    },
    sloganContainer: { 
        flex: 1, 
        marginBottom: 10 
    },
    slogan: { 
        fontFamily: "Roboto_thin", 
        color: "white", 
        fontSize: 25 
    },
    inputContainer: { 
        flex: 5 
    },
    inputWrapper: { 
        paddingTop: 20, 
        paddingRight: 10, 
        paddingLeft: 10, 
        paddingBottom: 20 
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
        fontFamily: "Roboto" 
    },
    separatingMargin: { 
        marginTop: 10 
    },
    loginButtonContainer: { 
        flex: 1, 
        flexDirection: 'row', 
        marginLeft: 10 
    },
    mainLoginButton: { 
        marginTop: 3, 
        flex: 7 
    },
    mainLoginTextContainer: { 
        flex: 1, 
        flexDirection: 'row' 
    },
    mainLoginText: { 
        textAlign: "center", 
        flex: 1 
    },
    socialLoginButtonSeparator: { 
        flexDirection: 'column', 
        alignItems: 'center', 
        flex: 3, 
        marginLeft: 25, 
        marginRight: 25 
    },
    robotoThin: { 
        fontFamily: "Roboto_thin" 
    },
    socialLoginButtonOverlay: { 
        flex: 3 
    },
    socialIcons: {
        width: 50,
        height: 50,
        marginRight: 5
    }

});
