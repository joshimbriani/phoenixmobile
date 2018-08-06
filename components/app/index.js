import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NavContainer from '../subviews/navcontainer'
import * as colorActions from '../../redux/actions/backgroundColor';
import * as tokenActions from '../../redux/actions/token';
import { styles } from '../../assets/styles';

import firebase from 'react-native-firebase';

class Index extends React.Component {

    state = {
        fontLoaded: false,
        notificationsAllowed: false
    };

    async componentWillMount() {
        this.props.colorActions.resetColor();
    }

    componentDidMount() {
        navigator.geolocation.setRNConfiguration({});

        firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    // user has a device token
                    console.log(fcmToken)
                    this.props.tokenActions.saveFCMToken(fcmToken);
                } else {
                    // user doesn't have a device token yet
                }
            });

        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
            this.props.tokenActions.saveFCMToken(fcmToken);
        })

    }

    render() {
        return (
            <View style={styles.container}>
                <NavContainer />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        color: state.backgroundColorReducer.color,
        user: state.userReducer.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        colorActions: bindActionCreators(colorActions, dispatch),
        tokenActions: bindActionCreators(tokenActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Index);
