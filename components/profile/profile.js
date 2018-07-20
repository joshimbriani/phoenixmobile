import React from 'react';
import { View, Text, Image, Button, TextInput, ToastAndroid, TouchableOpacity } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../../redux/actions/user';
import { getURLForPlatform } from '../utils/networkUtils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editingDetails: false,
            email: this.props.user.email
        }

        this.editUser = this.editUser.bind(this);
    }

    componentDidMount() {
        this.setState({email: this.props.user.email})
    }

    render() {
        const date = new Date(this.props.user.created);
        return (
            <KeyboardAwareScrollView>
                <View style={{ flex: 1 }}>
                    <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#c0392b', height: 175}}>
                        <Image
                            style={{ width: 75, height: 75, borderRadius:38, borderWidth: 1, borderColor: '#c0392b' }}
                            source={{ uri: this.props.user.profilePicture }}
                        />
                        <Text style={{color: '#ecf0f1', fontSize: 35, fontWeight: 'bold'}}>{this.props.user.username}</Text>
                    </View>
                    <View>
                        <View style={{flexDirection: 'row', backgroundColor: '#8e44ad', alignItems: 'center'}}>
                            <View style={{flex: 1, padding: 20}}>
                                <Text style={{fontWeight: 'bold', color: 'white'}}>Details</Text>
                            </View>
                            <View style={{paddingRight: 20, flexDirection: 'row'}}>
                                {!this.state.editingDetails && <TouchableOpacity onPress={() => this.setState({editingDetails: true})}><PlatformIonicon
                                    name={"create"}
                                    size={30} //this doesn't adjust the size...?
                                    style={{ color: "white" }}
                                /></TouchableOpacity>}
                                {this.state.editingDetails && <TouchableOpacity onPress={() => this.editUser()}><PlatformIonicon
                                    name={"sad"}
                                    size={30} //this doesn't adjust the size...?
                                    style={{ color: "white", paddingRight: 10 }}
                                /></TouchableOpacity>}
                                {this.state.editingDetails && <TouchableOpacity onPress={() => this.setState({editingDetails: false})}><PlatformIonicon
                                    name={"close-circle"}
                                    size={30} //this doesn't adjust the size...?
                                    style={{ color: "white" }}
                                /></TouchableOpacity>}
                            </View>
                        </View>
                        <View style={{backgroundColor: '#ecf0f1', padding: 10, flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                                <View style={{height: 40, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontWeight: 'bold', paddingRight: 20}}>Username:</Text>
                                </View>
                                <View style={{height: 40, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontWeight: 'bold', paddingRight: 20}}>Email:</Text>
                                </View>
                                <View style={{height: 40, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontWeight: 'bold', paddingRight: 20}}>Password:</Text>
                                </View>
                            </View>
                            <View style={{flex: 2}}>
                                <View style={{height: 40, justifyContent: 'center'}}>
                                    <Text>{this.props.user.username}</Text>
                                </View>
                                <View style={{height: 40, justifyContent: 'center'}}>
                                    {!this.state.editingDetails && <Text>{this.props.user.email}</Text>}
                                    {this.state.editingDetails && <TextInput value={this.state.email} onChangeText={(text) => this.setState({email: text}) }/>}
                                </View>
                                <View style={{height: 40, justifyContent: 'center'}}>
                                    {!this.state.editingDetails && <Text>Click on the Edit Icon to Reset</Text>}
                                    {this.state.editingDetails && <Button title="Reset Password" color="#8e44ad" onPress={() => ToastAndroid.show('Password Reset Email Sent', ToastAndroid.SHORT)} />}
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={{flexDirection: 'row', backgroundColor: '#16a085', alignItems: 'center'}}>
                            <View style={{flex: 1, padding: 20}}>
                                <Text style={{fontWeight: 'bold', color: 'white'}}>Stats</Text>
                            </View>
                        </View>
                        <View style={{backgroundColor: '#ecf0f1', padding: 10, flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                                <View style={{height: 40, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontWeight: 'bold', paddingRight: 20}}>Join Date:</Text>
                                </View>
                            </View>
                            <View style={{flex: 2}}>
                                <View style={{height: 40, justifyContent: 'center'}}>
                                    {this.props.user.created && <Text>{(new Date(this.props.user.created)).getMonth() + 1}/{(new Date(this.props.user.created)).getDate()}/{(new Date(this.props.user.created)).getFullYear()}</Text>}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            
                
        );
    }

    editUser() {
        fetch(getURLForPlatform() + "api/v1/user/" + this.props.user.id + "/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
            method: 'PUT',
            body: JSON.stringify({
                'email': this.state.email
            })
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ email: responseObj["email"], editingDetails: false });
                this.props.userActions.loadUser(this.props.token);
            });
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        token: state.tokenReducer.token
    };
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);
