import React from 'react';
import { Alert, Platform, StatusBar, FlatList, StyleSheet, TouchableHighlight, View, Dimensions, Text } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Profile from './profile';
import Achievements from './achievements';
import MyEvents from './myEvents';
import * as achievementActions from '../../redux/actions/achievements';
import * as userActions from '../../redux/actions/user';
import { styles } from '../../assets/styles';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
  };

class ProfileTabContainer extends React.Component {
    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'My Koota',
        headerLeft: <PlatformIonicon
            name="menu"
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.navigate('DrawerOpen')} />
    }) : ({ navigation }) => ({
        title: 'My Koota',
        headerStyle: { paddingTop: -22, }
    });

    state = {
        index: 0,
        routes: [
            { key: 'profile', title: 'My Profile' },
            { key: 'myEvents', title: 'My Events'},
            { key: 'achievements', title: 'Achievements' },
        ],
    };

    constructor(props) {
        super(props);
        this._handleIndexChange = this._handleIndexChange.bind(this);
    }

    _handleIndexChange(index) {
        this.setState({ index });
        if (index === 0) {
            this.props.userActions.loadUser(this.props.token);
        }
    }

    _renderHeader = props => <TabBar labelStyle={{fontSize: 11}} {...props} />;

    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'profile':
                return <Profile navigation={this.props.navigation} />;
            case 'achievements':
                return <Achievements navigation={this.props.navigation} />;
            case 'myEvents':
                return <MyEvents navigation={this.props.navigation} />
            default:
                return null;
        }
    }

    render() {
        return (
            <TabViewAnimated
                navigationState={this.state}
                renderScene={this._renderScene}
                renderHeader={this._renderHeader}
                onIndexChange={this._handleIndexChange}
                initialLayout={initialLayout}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token
    };
}

function mapDispatchToProps(dispatch) {
    return {
        achievementActions: bindActionCreators(achievementActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileTabContainer);

