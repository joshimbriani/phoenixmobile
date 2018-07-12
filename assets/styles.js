import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, StyleSheet, TouchableHighlight, View } from 'react-native';
import GridView from 'react-native-super-grid';
import PlatformIonicon from '../components/utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../redux/actions/backgroundColor';
import * as userActions from '../redux/actions/user';
import randomMC from 'random-material-color';
import SettingsList from 'react-native-settings-list';
import { Dropdown } from 'react-native-material-dropdown';
import { NavigationActions } from 'react-navigation';
import fontBasedOnPlatform from '../components/utils/fontBasedOnPlatform';

//the spacing indicates: general, newevents, auth
//import { styles } from '../../assets/styles';

export const styles = StyleSheet.create({
    titleStyle: {
        backgroundColor: 'white',
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 10,
    },
    bodyStyle: {
        backgroundColor: 'white',
        color: 'grey',
        fontSize: 15,
        paddingLeft: 30,
    },
    listitem: {
        alignSelf: 'stretch',
        height: 200,
    },
    itemText: {
        color: 'white',
        fontSize: 20,
        paddingTop: 5,
        textAlign: 'center',
        fontFamily: 'Roboto_medium'
    },
    listView: {
        flex: 5
    },
    gridView: {
        flex: 1,
    },
    itemBox: {
        height: 150,
        backgroundColor: '#1abc9c',
        borderRadius: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    followView: {
        flex: -1
    },










    flex1: {
        flex: 1,
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    header: {
        flexDirection: 'row'
    },
    questionHeader: {
        fontFamily: fontBasedOnPlatform(),
        fontSize: 40,
        marginTop: 10,
        marginLeft: 10
    },
    tagline: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 1,
        marginTop: 15,
        marginRight: 20
    },
    taglineText: {
        fontSize: 10,
        fontWeight: '300'
    },
    formContainer: {
        flex: 1,
    },
    topicContainer: {
        alignSelf: "stretch",
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: "red",
    },
    topicBubble: {
        backgroundColor: "green"
    },
    offerScrollContainer: {
        alignSelf: "stretch",
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: "red",
    },
    offerItemContainer: {
        width: 120,
        backgroundColor: "blue",
        alignSelf: 'flex-end'
    },










    errorBackground: {
        backgroundColor: "red"
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



