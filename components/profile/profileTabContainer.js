import React from 'react';
import { Alert, Platform, StatusBar, FlatList, StyleSheet, TouchableHighlight, View, Dimensions } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

import Profile from './profile';
import Achievements from './achievements';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
  };

export default class ProfileTabContainer extends React.Component {
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

    _handleIndexChange = index => this.setState({ index });

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});