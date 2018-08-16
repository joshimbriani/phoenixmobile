import React from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Platform, ScrollView } from 'react-native';

import { Button, Content, Form, Input, Item, Label, Text } from 'native-base';
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
            checked: false,
            showEULA: false
        }

    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? "padding" : null} keyboardVerticalOffset={Platform.OS === 'ios' ? -220 : 0}>
                {this.props.navigation.state.params.error.main !== "" && <View style={styles.errorBackground}>
                    <Text style={styles.errorText}>{this.props.navigation.state.params.error.main}</Text>
                </View>}
                <Dialog.Container visible={this.state.showEULA} style={{ height: '80%' }}>
                    <Dialog.Title>Licensing Agreement</Dialog.Title>
                    <ScrollView>
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
                        {this.props.navigation.state.params.error.username !== "" && <View style={styles.inputErrorContainer}>
                            <Text style={styles.inputErrorText}>{this.props.navigation.state.params.error.username}</Text>
                        </View>}
                        <Item stackedLabel>
                            <Label>Age</Label>
                            <View style={{ width: '80%' }}>
                                <Dropdown
                                    label='Which age group do you fall into?'
                                    onChangeText={(text) => { this.props.navigation.state.params.onChange("age", text) }}
                                    value={this.props.navigation.state.params.age}
                                    data={[{
                                        value: '13-18',
                                    }, {
                                        value: '18-22',
                                    }, {
                                        value: '22-30'
                                    }, {
                                        value: '31-39'
                                    }, {
                                        value: '40-49'
                                    }, {
                                        value: '50+'
                                    }]}
                                />
                            </View>

                        </Item>
                        {this.props.navigation.state.params.error.email !== "" && <View style={styles.inputErrorContainer}>
                            <Text style={styles.inputErrorText}>{this.props.navigation.state.params.error.email}</Text>
                        </View>}
                        <Item stackedLabel>
                            <Label>Gender</Label>
                            <View style={{ width: '80%' }}>
                                <Dropdown

                                    label='Which gender do you identify as?'
                                    onChangeText={(text) => { this.props.navigation.state.params.onChange("gender", text) }}
                                    value={this.props.navigation.state.params.age}
                                    data={[{
                                        value: 'Female',
                                    }, {
                                        value: 'Male',
                                    }, {
                                        value: 'Non-Binary'
                                    }]}
                                />
                            </View>
                        </Item>
                        <View style={{ backgroundColor: 'white', margin: 5, borderRadius: 5, paddingTop: 20, paddingBottom: 15, shadowRadius: 2, shadowOpacity: 1, shadowColor: 'black', elevation: 2 }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
                                <View>
                                    <Text>Why do we need this info from you?</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 10 }}>Koota use some demographic data that you provide like age group and gender into our algorithms in order to connect you with users that we think are likely to be your friend!</Text>
                                </View>

                            </View>
                        </View>
                    </Content>
                </View>

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
                            this.setState({ checked: !this.state.checked })
                        }}
                        isChecked={this.state.checked}
                    />
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                        <Text style={{ fontSize: 10 }}>I am over the age of 13 and I accept </Text>
                        <TouchableOpacity onPress={() => this.setState({ showEULA: true })}>
                            <Text style={{ color: 'blue', fontSize: 10 }}>Koota's license agreement.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.registerButtons}>
                    <Button onPress={this.props.navigation.state.params.submitForm} style={styles.registerButton}>
                        <View style={styles.registerButtonContainer}>
                            <Text style={styles.registerButtonText}>Register</Text>
                        </View>
                    </Button>
                    <View style={styles.socialSeparator}>
                        <Text style={styles.empty}>Or Register</Text>
                        <Text style={styles.empty}>With</Text>
                    </View>
                </View>
                <View style={styles.loginLinks}>
                    <Text style={[styles.platformFont, styles.alreadyText]}>Already have an account?</Text>
                    <View style={{ flex: 1 }} />
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