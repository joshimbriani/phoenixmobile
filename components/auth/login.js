import React from 'react';
import { Container, Header, Item, Input, Icon, Form, Label, Button, Text, Content } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as tokenActions from '../../redux/actions/token'
import PlatformIonicon from '../utils/platformIonicon';
import { getURLForPlatform } from '../utils/networkUtils';

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
        }).then(response => { if (response.ok) { return response.json() } else { this.setState({ error: "Login failed. Try again!" }); return false } })
            .then(responseJSON => { if (responseJSON) { this.parseLoginResponse(responseJSON) } });
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
            <View style={{ flex: 1 }} >
                {this.state.error !== "" && <View>
                    <Text>{this.state.error}</Text>
                </View>}
                <View style={{ flex: 3, alignItems: "center", backgroundColor: '#66b2b2' }}>
                    <View style={{ marginTop: 10, flex: 3 }}>
                        <Image
                            source={require('../../assets/images/logologin.png')}
                            style={{ width: 200, flex: 1 }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: "Roboto_thin", color: "white", fontSize: 25 }}>Curing Loneliness</Text>
                    </View>
                </View>
                <View style={{ flex: 5 }}>
                    <Content style={{ paddingTop: 20, paddingRight: 10, paddingLeft: 10, paddingBottom: 20 }}>
                        <Item stackedLabel>
                            <Label>Username</Label>
                            <Input name="username" autoCapitalize="none" onChangeText={(text) => this.onChange("username", text)} />
                        </Item>
                        <Item style={{ marginTop: 10 }} stackedLabel last>
                            <Label>Password</Label>
                            <Input name="password" secureTextEntry={true} autoCapitalize="none" onChangeText={(text) => this.onChange("password", text)} />
                        </Item>
                    </Content>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10 }}>
                    <Button onPress={this.submitForm} style={{ marginTop: 3, flex: 7 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ textAlign: "center", flex: 1 }}>Log In</Text>
                        </View>
                    </Button>
                    <View style={{ flexDirection: 'column', alignItems: 'center', flex: 3, marginLeft: 25, marginRight: 25 }}>
                        <Text style={{ fontFamily: "Roboto_thin" }}>Or Log</Text>
                        <Text style={{ fontFamily: "Roboto_thin" }}>In With</Text>
                    </View>
                    <TouchableOpacity onPress={this.submitForm} style={{flex: 3}}>
                        <Image
                            source={require('../../assets/images/icons/facebookicon.png')}
                            style={{ width: 50, height: 50, marginRight: 5 }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.submitForm} style={{flex: 3}}>
                        <Image
                            source={require('../../assets/images/icons/googleicon.png')}
                            style={{ width: 50, height: 50, marginRight: 5 }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

            </View>
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
