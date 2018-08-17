import React from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Platform, ScrollView, Keyboard } from 'react-native';

import { Button, Content, Form, Input, Item, Label, Text, Icon } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as tokenActions from '../../redux/actions/token';
import fontBasedOnPlatform from '../utils/fontBasedOnPlatform';
import { Dropdown } from 'react-native-material-dropdown';
import CheckBox from 'react-native-check-box'
import Dialog from "react-native-dialog";

class RegisterDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: props.navigation.state.params.accept || false,
            showEULA: false,
            accept: props.navigation.state.params.accept || false,
            birthdate: props.navigation.state.params.birthdate || "",
            gender: props.navigation.state.params.gender || "",
            error: {
                birthdate: "",
                gender: "",
                accept: ""
            },
            imageSize: 100
        }

        this.setErrorUIState = this.setErrorUIState.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

        if (!this.props.navigation.state.params.first) {
            this.setErrorUIState();
        }
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }


    _keyboardDidShow() {
        this.setState({imageSize: 0})
    }

    _keyboardDidHide() {
        this.setState({imageSize: 100})
    }

    setErrorUIState() {
        var errorState = { main: "", username: "", email: "", password: "", gender: "", birthdate: "" }
        if (this.state.gender === "") {
            errorState["gender"] = "You need to select your gender!"
        }
        if (this.state.birthdate === "") {
            errorState["birthdate"] = "You need to select your age!"
        } else {
            if (!isValidDate(this.state.birthdate)) {
                errorState["birthdate"] = "Please enter a valid date!"
            }
        }
        if (this.state.accept === false) {
            errorState["accept"] = "You need to accept our agreement!"
        }
        // Eventually we might want to enforce password difficulty
        // We'd do that here
        this.setState({ error: errorState });
        console.log(errorState);
    }

    render() {
        console.log(this.props.navigation.state.params)
        return (
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }} behavior={Platform.OS === 'ios' ? "padding" : null} >
                {this.props.navigation.state.params.error.main !== "" && <View style={styles.errorBackground}>
                    <Text style={styles.errorText}>{this.props.navigation.state.params.error.main}</Text>
                </View>}
                <Dialog.Container visible={this.state.showEULA} style={{ height: '80%' }}>
                    <Dialog.Title>Licensing Agreement</Dialog.Title>
                    <ScrollView style={{height: 300}}>
                        <Dialog.Description>
                            End-User License Agreement (EULA) of Koota{"\n"}{"\n"}

                            This End-User License Agreement ("EULA") is a legal agreement between you and Koota, Inc.{"\n"}{"\n"}

                            This EULA agreement governs your acquisition and use of our Koota software ("Software") directly from Koota, Inc. or indirectly through a Koota, Inc. authorized reseller or distributor (a "Reseller").{"\n"}{"\n"}

                            Please read this EULA agreement carefully before completing the installation process and using the Koota software. It provides a license to use the Koota software and contains warranty information and liability disclaimers.{"\n"}{"\n"}

                            If you register for a free trial of the Koota software, this EULA agreement will also govern that trial. By clicking "accept" or installing and/or using the Koota software, you are confirming your acceptance of the Software and agreeing to become bound by the terms of this EULA agreement.{"\n"}{"\n"}

                            If you are entering into this EULA agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity and its affiliates to these terms and conditions. If you do not have such authority or if you do not agree with the terms and conditions of this EULA agreement, do not install or use the Software, and you must not accept this EULA agreement.{"\n"}{"\n"}

                            This EULA agreement shall apply only to the Software supplied by Koota, Inc. herewith regardless of whether other software is referred to or described herein. The terms also apply to any Koota, Inc. updates, supplements, Internet-based services, and support services for the Software, unless other terms accompany those items on delivery. If so, those terms apply.{"\n"}{"\n"}{"\n"}{"\n"}

                            License Grant{"\n"}{"\n"}

                            Koota, Inc. hereby grants you a personal, non-transferable, non-exclusive licence to use the Koota software on your devices in accordance with the terms of this EULA agreement.{"\n"}{"\n"}

                            You are permitted to load the Koota software (for example a PC, laptop, mobile or tablet) under your control. You are responsible for ensuring your device meets the minimum requirements of the Koota software.{"\n"}{"\n"}

                            You are not permitted to:{"\n"}{"\n"}


                            - Edit, alter, modify, adapt, translate or otherwise change the whole or any part of the Software nor permit the whole or any part of the Software to be combined with or become incorporated in any other software, nor decompile, disassemble or reverse engineer the Software or attempt to do any such things{"\n"}{"\n"}
                            - Reproduce, copy, distribute, resell or otherwise use the Software for any commercial purpose{"\n"}{"\n"}
                            - Allow any third party to use the Software on behalf of or for the benefit of any third party{"\n"}{"\n"}
                            - Use the Software in any way which breaches any applicable local, national or international law{"\n"}{"\n"}
                            - use the Software for any purpose that Koota, Inc. considers is a breach of this EULA agreement{"\n"}{"\n"}{"\n"}

                            Intellectual Property and Ownership{"\n"}{"\n"}

                            Koota, Inc. shall at all times retain ownership of the Software as originally downloaded by you and all subsequent downloads of the Software by you. The Software (and the copyright, and other intellectual property rights of whatever nature in the Software, including any modifications made thereto) are and shall remain the property of Koota, Inc..{"\n"}{"\n"}

                            Koota, Inc. reserves the right to grant licences to use the Software to third parties.{"\n"}{"\n"}{"\n"}{"\n"}

                            Termination{"\n"}{"\n"}

                            This EULA agreement is effective from the date you first use the Software and shall continue until terminated. You may terminate it at any time upon written notice to Koota, Inc..{"\n"}{"\n"}

                            It will also terminate immediately if you fail to comply with any term of this EULA agreement. Upon such termination, the licenses granted by this EULA agreement will immediately terminate and you agree to stop all access and use of the Software. The provisions that by their nature continue and survive will survive any termination of this EULA agreement.{"\n"}{"\n"}{"\n"}{"\n"}

                            Governing Law{"\n"}{"\n"}

                            This EULA agreement, and any dispute arising out of or in connection with this EULA agreement, shall be governed by and construed in accordance with the laws of the United States of America.{"\n"}{"\n"}
                        </Dialog.Description>
                    </ScrollView>
                    <Dialog.Button label="Got it!" onPress={() => this.setState({ showEULA: false })} />
                </Dialog.Container>
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
                <View style={{ flex: 2 }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ marginTop: 30, marginBottom: 15 }}>
                                <View style={{ width: 250 }}>
                                    <Item regular error={this.state.error.birthdate !== ""}>
                                        <Icon name="birthday-cake" type="FontAwesome" />
                                        <Input name="birthdate" placeholder="MM/DD/YYYY" autoCapitalize="none" value={this.state.birthdate} onChangeText={(text) => { this.props.navigation.state.params.onChange("birthdate", text); this.setState({ birthdate: text, error: { birthdate: "", gender: this.state.error.gender, accept: this.state.error.accept } }) }} />
                                    </Item>
                                    {this.state.error.birthdate !== "" && <View>
                                        <Text style={{ fontSize: 10, color: 'red' }}>{this.state.error.birthdate}</Text>
                                    </View>}
                                </View>
                            </View>
                            <View>
                                <View style={{ width: 250 }}>
                                    <Item regular error={this.state.error.gender !== ""}>
                                        <Icon name="venus-mars" type="FontAwesome" />
                                        <Dropdown
                                            containerStyle={{
                                                width: 175
                                            }}
                                            label='Gender'
                                            onChangeText={(text) => { this.props.navigation.state.params.onChange("gender", text); this.setState({ gender: text, error: { birthdate: this.state.error.birthdate, gender: "", accept: this.state.error.accept } }) }}
                                            value={this.state.gender}
                                            data={[{
                                                value: 'Female',
                                            }, {
                                                value: 'Male',
                                            }, {
                                                value: 'Non-Binary'
                                            }]}
                                        />
                                    </Item>
                                    {this.state.error.gender !== "" && <View>
                                        <Text style={{ fontSize: 10, color: 'red' }}>{this.state.error.gender}</Text>
                                    </View>}
                                </View>
                            </View>
                        </View>

                </View>
                <View style={{ width: 250 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <CheckBox
                            style={{ padding: 10 }}
                            onClick={() => {
                                if (!this.state.checked) {
                                    // It wasn't checked but now it is
                                    this.props.navigation.state.params.onChange("accept", true)
                                } else {
                                    this.props.navigation.state.params.onChange("accept", false)
                                }
                                const oldChecked = this.state.checked;
                                this.setState({ checked: !oldChecked })
                                this.setState({ accept: !oldChecked, error: { birthdate: this.state.error.birthdate, gender: this.state.error.gender, accept: "" } })
                            }}
                            isChecked={this.state.checked}
                        />
                        <View style={{ alignItems: 'center', flexDirection: 'row', maxWidth: '80%' }}>
                            <Text style={{ fontSize: 8 }}>I am over the age of 13 and I accept </Text>
                            <TouchableOpacity onPress={() => this.setState({ showEULA: true })}>
                                <Text style={{ color: 'blue', fontSize: 8 }}>Koota's license agreement.</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.state.error.accept !== "" && <View>
                        <Text style={{ fontSize: 10, color: 'red' }}>{this.state.error.accept}</Text>
                    </View>}
                </View>

                <View style={{ marginVertical: 20, alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.state.params.submitForm(); this.setErrorUIState(); if (this.props.navigation.state.params.needToGoBack()) this.props.navigation.goBack() }}>
                        <View style={{ width: 300, height: 50, backgroundColor: '#006083', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>Register</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

function isValidDate(dateString) {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

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
)(RegisterDetails);

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