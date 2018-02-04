import React from 'react';
import { Container, Header, Item, Input, Icon, Form, Label, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as tokenActions from '../../redux/actions/token'
import PlatformIonicon from '../utils/platformIonicon';
import { getURLForPlatform } from '../utils/networkUtils';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password1: "",
            password2: "",
            error: ""
        }

        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.resetNavigation = this.resetNavigation.bind(this);
        this.register = this.register.bind(this);
        this.parseRegisterResponse = this.parseRegisterResponse.bind(this);
    }

    componentDidMount() {
        if (this.props.token) {
            this.resetNavigation('Main');
        }
    }

    registrationIsValid() {
        if (this.state.username === "" || this.state.password1 === "" || this.state.password2 === "" || this.state.email === "") {
            this.setState({error: "Make sure you fill in all of the fields!"});
            return false;
        }
        if (this.state.password1 !== this.state.password2) {
            this.setState({error: "Make sure your passwords match!"});
            return false;
        }
        if (this.state.password1.length < 6) {
            this.setState({error: "Make sure your paswords are at least 6 chatracters long!"});
            return false;
        }
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(this.state.email.toLowerCase());
    }

    onChange(component, value) {
        var stateRepresentation = {};
        stateRepresentation[component] = value;
        this.setState(stateRepresentation);
    }

    submitForm() {
        if (this.registrationIsValid()) {
            this.register();
        }
    }

    register() {
        fetch(getURLForPlatform() + "rest-auth/registration/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': this.state.username,
                'password1': this.state.password1,
                'password2': this.state.password2,
                'email': this.state.email,
            })
        }).then(response => {if (response.ok) {return response.json()} else {this.setState({error: "Registration failed. Give it another shot!"}); return false}})
        .then(responseJSON => { if (responseJSON) {this.parseRegisterResponse(responseJSON)}});
    }

    parseRegisterResponse(response) {
        this.props.tokenActions.saveUserToken(response["key"]);
        this.resetNavigation('Main');
    }

    resetNavigation(targetRoute) {
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
            <Container>
                {this.state.error !== "" && <View>
                    <Text>{this.state.error}</Text>
                </View>}
                <Form>
                    <Item floatingLabel>
                        <Label>Username</Label>
                        <Input name="username" autoCapitalize="none" onChangeText={(text) => this.onChange("username", text)} />
                    </Item>
                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input name="email" keyboard-type="email-address" autoCapitalize="none" onChangeText={(text) => this.onChange("email", text)} />
                    </Item>
                    <Item floatingLabel>
                        <Label>Password</Label>
                        <Input name="password1" secureTextEntry={true} autoCapitalize="none" onChangeText={(text) => this.onChange("password1", text)} />
                    </Item>
                    <Item floatingLabel last>
                        <Label>Password Again</Label>
                        <Input name="password2" secureTextEntry={true} autoCapitalize="none" onChangeText={(text) => this.onChange("password2", text)} />
                    </Item>
                    <Button onPress={() => this.props.navigation.navigate('Login')}>
                        <Text>Login</Text>
                    </Button>
                    <Button onPress={this.submitForm}>
                        <Text>Submit</Text>
                    </Button>
                </Form>
            </Container>
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
    listitem: {
        alignSelf: 'stretch',
        height: 200,
    },
    itemText: {
        color: 'white',
        fontSize: 40,
        paddingTop: 5,
        textAlign: 'center',
        fontFamily: 'Roboto_medium'
    }

});
