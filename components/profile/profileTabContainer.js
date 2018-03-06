import React from 'react';
import { Alert, Platform, StatusBar, FlatList, StyleSheet, TouchableHighlight, View, Dimensions } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Profile from './profile';
import Achievements from './achievements';
import * as achievementActions from '../../redux/actions/achievements';
import * as userActions from '../../redux/actions/user';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
  };

class ProfileTabContainer extends React.Component {
    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'Profile',
        headerLeft: <PlatformIonicon
            name="menu"
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.navigate('DrawerOpen')} />
    }) : ({ navigation }) => ({
        title: 'Profile',
        headerStyle: { paddingTop: -22, }
    });

    state = {
        index: 0,
        routes: [
            { key: 'profile', title: 'My Profile' },
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
        } else if (index === 1) {
            this.props.achievementActions.fetchAchievements(this.props.token);
        }
    }

    _renderHeader = props => <TabBar {...props} />;

    _renderScene = SceneMap({
        profile: Profile,
        achievements: Achievements,
    });

    render() {
        return (
            <TabViewAnimated
                style={styles.container}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});