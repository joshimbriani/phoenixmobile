import React from 'react';
import { connect } from 'react-redux';
import { Platform, Text } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';

import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import GroupsMessage from './groupsMessage';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

class GroupWrapper extends React.Component{
    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'Groups',
        headerLeft: <PlatformIonicon
            name="menu"
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.navigate('DrawerOpen')} />
    }) : ({ navigation }) => ({
        title: 'Home',
        headerStyle: { paddingTop: -22, }
    });

    constructor(props) {
        super(props);
        var routes = [
            { key: 'messages', title: 'Messages' },
            { key: 'details', title: 'Group Details'}
        ];

        this.state = {
            index: 0,
            routes: routes,
        }

    }  

    render() {
        return (
            <Text>Group</Text>
        )
    }

    _handleIndexChange = index => this.setState({ index });

    _renderHeader = props => <TabBar {...props} labelStyle={{fontSize: 11}} style={[styles.eventTabBar, { backgroundColor: '#' + this.props.navigation.state.params.color }]} />;

    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'messages':
                return <EventDetailDetails event={this.state.eventData} color={this.props.navigation.state.params.color} navigation={this.props.navigation} />;
            case 'details':
                return <EventDetailPlace event={this.state.eventData} color={this.props.navigation.state.params.color} navigation={this.props.navigation} />;
            default:
                return null;
        }
    }

    render() {
        return (
            <TabViewAnimated
                style={{flex: 1}}
                navigationState={this.state}
                renderScene={this._renderScene}
                renderHeader={this._renderHeader}
                onIndexChange={this._handleIndexChange}
                initialLayout={initialLayout}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        
    };
}

function mapDispatchToProps(dispatch) {
    return {
        
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GroupWrapper);