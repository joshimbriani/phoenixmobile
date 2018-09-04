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
    }

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }} behavior={Platform.OS === 'ios' ? "padding" : null} >
                {this.props.navigation.state.params.error.main !== "" && <View style={styles.errorBackground}>
                    <Text style={styles.errorText}>{this.props.navigation.state.params.error.main}</Text>
                </View>}
                <Dialog.Container visible={this.state.showEULA} style={{ height: '80%' }}>
                    <Dialog.Title>Licensing Agreement</Dialog.Title>
                    <ScrollView style={{height: 300}}>
                        <Dialog.Description>
                            End-User License Agreement (EULA) of Koota, Inc.{"\n"}{"\n"}
                            
                            Please read this End-User License Agreement ("EULA") carefully. It is a legal document between you and Koota, Inc. (“Koota”) that explains your rights and obligations related to your use of the Koota’s software products provided to you directly by Koota or through a Koota authorized reseller or distributer (“Software”). By downloading or using the Software, or by otherwise indicating your acceptance of this EULA, you are agreeing to be bound by the terms of this EULA. If you enter into this EULA on behalf of a company or other legal entity, you represent that you have the requisite authority to bind such entity and its affiliates to this EULA. If you do not have such authority or if you do not agree with the terms and conditions of this EULA, do not install or use the Software.  If you do not or cannot agree to the terms of this EULA, please do not download or use this Software.
                            Please review Koota’s Privacy Policy found at kootasocial.com to understand our practices and how we may use your personal data. In addition, your use of the Software is also governed by Koota’s Terms of Service, which may be found at kootasocial.com. By downloading or using the Software, you also agree to Koota’s Terms of Service and acknowledge that you have read Koota’s Privacy Policy.
                            If you register for a free trial of the Software, this EULA will also govern that trial.{"\n"}{"\n"}
                            
                            License Grant{"\n"}{"\n"}
                            
                            Koota hereby grants you a personal, non-transferable, non-exclusive license to use the Software on your devices in accordance with the terms of this EULA.  You are permitted to load the Software on hardware (e.g. your personal PC, laptop, mobile or tablet) that is under your control; provided you are responsible for ensuring your device meets the minimum requirements of the Software.{"\n"}
                            You may not do any of the following with respect to the Software or any of its parts: (a) use it commercially or for a promotional purpose; (b) use it on more than one device at a time; (c) copy, reproduce, distribute, display, or use it in a way that is not expressly authorized in this EULA; (d) sell, rent, lease, license, distribute, or otherwise transfer it; (e) reverse engineer, derive source code from, modify, adapt, translate, decompile, or disassemble it or make derivative works based on it; (f) remove, disable, circumvent, or modify any proprietary notice or label or security technology included in it; (g) create, develop, distribute, or use any unauthorized software programs; (h) use it to infringe or violate the rights of any third party, including but not limited to any intellectual property, publicity, or privacy rights; (i) use, export, or re-export it in violation of any applicable law or regulation; or (j) behave in a manner which is detrimental to the enjoyment of the Software by other users as intended by Koota in Koota’s sole judgment, including but not limited to the following – harassment, use of abusive or offensive language, sabotage, spamming, social engineering, or scamming.{"\n"}{"\n"}
                            
                            Intellectual Property and Ownership{"\n"}{"\n"}
                            Koota shall at all times retain ownership of the Software as originally downloaded by you and all subsequent downloads of the Software by you. The Software (and the copyright, and other intellectual property rights of whatever nature in the Software, including any modifications made thereto) are and shall remain the property of Koota. Koota reserves the right to grant licenses to use the Software to third parties.{"\n"}{"\n"}

                            Disclaimer{"\n"}{"\n"}

                            Except as expressly set forth above, Koota and its licensors provide Software “as is” and expressly disclaim all warranties, conditions or other terms, whether express, implied or statutory, including without limitation, warranties, conditions or other terms regarding merchantability, fitness for a particular purpose, design, condition, capacity, performance, title, and non-infringement. Koota does not warrant that the Software will operate uninterrupted or error-free or that all errors will be corrected. In addition, Koota does not warrant that the Software or any equipment, system or network on which the Software is used will be free of vulnerability to intrusion or attack.{"\n"}{"\n"}

                            Limitations and Exclusions of Liability{"\n"}{"\n"}

                            In no event will Koota or its licensors be liable for the following, regardless of the theory of liability or whether arising out of the use or inability to use the Software or otherwise, even if a party been advised of the possibility of such damages: (a) indirect, incidental, exemplary, special or consequential damages; (b) loss or corruption of data or interrupted or loss of business; or (c) loss of revenue, profits, goodwill or anticipated sales or savings. All liability of Koota, its affiliates, officers, directors, employees, agents, suppliers and licensors collectively, to You, whether based in warranty, contract, tort (including negligence), or otherwise, shall not exceed the license fees paid by you for the Software that gave rise to the claim. This limitation of liability for Software is cumulative and not per incident. Nothing in this EULA limits or excludes any liability that cannot be limited or excluded under applicable law.{"\n"}{"\n"}

                            Indemnity {"\n"}{"\n"}

                            You agree to indemnify, pay the defense costs of, and hold Koota, its licensors, its and their affiliates, and its and their employees, officers, directors, agents, contractors, and other representatives harmless from all claims, demands, actions, losses, liabilities, and expenses (including attorneys’ fees, costs, and expert witnesses’ fees) that arise from or in connection with (a) any claim that, if true, would constitute a breach by you of this EULA or negligence by you, or (b) any act or omission by you in using the Software. You agree to reimburse Koota on demand for any defense costs incurred by Koota and any payments made or loss suffered by Koota, whether in a court judgment or settlement.{"\n"}

                            If you are prohibited by law from entering into the indemnification obligation above, then you assume, to the extent permitted by law, all liability for all claims, demands, actions, losses, liabilities, and expenses (including attorneys’ fees, costs and expert witnesses’ fees) that are the stated subject matter of the indemnification obligation above. {"\n"}{"\n"}

                            User Generated Content{"\n"}{"\n"}
                            
                            Any content that you create, generate, or make available through the Software, shall be deemed as “User Generated Content”. You hereby grant to Koota a non-exclusive, fully-paid, royalty-free, irrevocable, perpetual, transferable, and sublicensable license to use, copy, modify, adapt, distribute, and publicly display your User Generated Content. You may not create, generate, or make available through the Software any User Generated Content to which you do not have the right to grant Koota such license. In addition, you may not create, generate, or make available through the Software any User Generated Content that is illegal or violates or infringes another’s rights, including intellectual property rights or privacy, publicity or moral rights. Koota reserves the right to take down any User Generated Content in its discretion.{"\n"}{"\n"}
                            
                            Termination{"\n"}{"\n"}
                            
                            This EULA is effective from the date you first use the Software and shall continue until the earlier of (i) you indicate to Koota in writing that you wish to terminate (ii) you fail to comply with any terms and conditions of this EULA. Upon such termination, the licenses granted by this EULA will immediately terminate and you agree to stop all access and use of the Software. {"\n"}{"\n"}
                            
                            Amendments of this EULA{"\n"}{"\n"}
                            
                            At any time, Koota may issue an amended EULA, Terms of Service, or Privacy Policy in its discretion by posting the amended EULA, Terms of Service, or Privacy Policy on its website or by providing you with digital access to amended versions of any of these documents when you next access the Software. If you do not agree to any amendment to this EULA, the Terms of Service, or Privacy Policy, you may terminate this EULA and must stop using the Software. Your continued use of the Software will demonstrate your acceptance of the amended EULA and Terms of Service as well as your acknowledgement that you have read the amended Privacy Policy.{"\n"}{"\n"}
                            
                            No Assignment{"\n"}{"\n"}
                            
                            This EULA shall not be assigned by you without the prior written consent of Koota. Upon consensual assignment, this EULA and the rights and obligations hereunder shall be binding upon your successors and assigns.
                            
                            Partial Invalidity{"\n"}{"\n"}
                            
                            Nothing contained in this EULA shall be construed so as to require the commission of any act contrary to law, and whenever there is any conflict between any provision of the EULA and any statue, law, ordinance, order, or regulation, the latter shall prevail, but in such event, any provision of this EULA so affected shall be curtailed and limited to the extent necessary to bring it within the legal requirements. In the event that any portion of these terms and conditions shall be held to be invalid or unenforceable in a court of law or equality; (i) the parties agree to negotiate in good faith an acceptable alternative provision which reflects as closely as possible the intent of the enforceable provision; and (ii) the validity and legality of the remaining provisions of this EULA shall not in any way be affected or impaired thereby, and shall remain in full force and affect.
                            
                            No Waiver{"\n"}{"\n"}
                            
                            To the maximum extent permitted under applicable law, the failure of Koota to exercise any right or remedy which it may have hereunder or under the law shall not be construed as a waiver of any other right or remedy which it may have hereunder or under the law.
                            
                            U.S. Government Matters{"\n"}{"\n"}
                            
                            The Software is a “Commercial Item” (as defined at 48 C.F.R. §2.101), consisting of “Commercial Computer Software” and “Commercial Computer Software Documentation” (as used in 48 C.F.R. §12.212 or 48 C.F.R. §227.7202, as applicable). The Software is being licensed to U.S. Government end users only as Commercial Items and with only those rights as are granted to other licensees under this EULA. {"\n"}{"\n"}

                            You represent and warrant to Koota that you are not located in a country that is subject to a U.S. Government embargo or that has been designated by the U.S. Government as a “terrorist supporting” country, and that you are not listed on any U.S. Government list of prohibited or restricted parties.{"\n"}{"\n"}
                            
                            Governing Law{"\n"}{"\n"}
                            
                            This EULA shall be governed by and construed according to the laws of the State of North Carolina, without regard to its conflicts of law principles.{"\n"}{"\n"}
                            
                            Arbitration{"\n"}{"\n"}
                            
                            All disputes arising from this EULA, or from any other agreement that exists between the parties to this EULA, shall be referred for binding arbitration under the rules of the American Arbitration Association, with such arbitration to be held in Wake County, North Carolina, USA. In the event that arbitration is found not to apply to the parties or to a particular claim or dispute under this EULA, you  hereby irrevocably consent to the jurisdiction of the state and federal courts of the State of North Carolina, to accept service of all summons, complaints, and other process of such court(s), and that such court(s) is a convenient forum for resolution of disputes arising out of or related to this EULA.{"\n"}{"\n"}
                            
                            Miscellaneous{"\n"}{"\n"}
                            
                            This EULA contains the entire understanding between the parties and supersedes all prior understandings of the parties hereto relating to the subject matter hereof. This EULA may not be modified, nor may any provision be waived, except by an instrument in writing, signed by both parties. Paragraph headings used herein are for convenience only and shall not be used in any way to interpret the provisions of this EULA. {"\n"}{"\n"}
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