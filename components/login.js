import React from 'react';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../redux/actions/backgroundColor'
import PlatformIonicon from './utils/platformIonicon';
import ColorScheme from 'color-scheme';

class Login extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Login"
    });

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    formIsValid() {
        if (this.state.username === "" || this.state.password === "") {
            return false;
        }
        return true;
    }

    onChange(e) {
        var stateRepresentation = {};
        stateRepresentation[e.target.name] = e.target.value;
        stateRepresentation["formIsValid"] = this.formIsValid();
        this.setState(stateRepresentation);
    }

    sendLoginRequest() {
        fetch("http://10.0.2.2:8000/rest-auth/login/", {
            method: 'POST',
            headers: {
                'Accept': 'applicatiion/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': this.state.username,
                'password': this.state.password,
            })
        }).then(response => response.json())
          .then(responseJSON => console.log(responseJSON));
    }

    render() {
        return (
            <Container>
                <Form>
                    <Item floatingLabel>
                        <Label>Username</Label>
                        <Input name="username" onChange={this.onChange} />
                    </Item>
                    <Item floatingLabel last>
                        <Label>Password</Label>
                        <Input name="password" onChange={this.onChange} />
                    </Item>
                </Form>
            </Container>
        )
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
