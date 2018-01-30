import React from 'react';
import { Container, Header, Item, Input, Icon, Form, Label, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as tokenActions from '../redux/actions/token'
import PlatformIonicon from './utils/platformIonicon';
import ColorScheme from 'color-scheme';
import {getURLForPlatform} from './utils/networkUtils';

class Login extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Login"
    });

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: ""
        }

        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.resetNavigation = this.resetNavigation.bind(this);
        this.sendLoginRequest = this.sendLoginRequest.bind(this);
    }

    componentDidMount() {
        if (this.props.token) {
            this.resetNavigation('Main');
        }
    }

    formIsValid() {
        console.log(this.state.username);
        if (this.state.username === "" || this.state.password === "") {
            return false;
        }
        return true;
    }

    onChange(component, value) {
        var stateRepresentation = {};
        stateRepresentation[component] = value;
        stateRepresentation["formIsValid"] = this.formIsValid();
        this.setState(stateRepresentation);
    }

    submitForm() {
        if (this.state.formIsValid) {
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
        }).then(response => {if (response.ok) {return response.json()} else {this.setState({error: "Login failed. Try again!"}); return false}})
        .then(responseJSON => { if (responseJSON) {this.parseLoginResponse(responseJSON)}});
    }

    parseLoginResponse(response) {
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
                    <Item floatingLabel last>
                        <Label>Password</Label>
                        <Input name="password" autoCapitalize="none" onChangeText={(text) => this.onChange("password", text)} />
                    </Item>
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
        color: state.backgroundColorReducer.color,
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
