import React from 'react';
import { connect } from 'react-redux';
import { Platform, Text, Dimensions } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';

import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import GroupsMessage from './groupsMessage';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

class GroupWrapper extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.groupName,
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
            group: {}
        }

    }

    componentDidMount() {
        fetch(getURLForPlatform() + "api/v1/groups/" + this.props.navigation.state.groupID, {
            headers: {
                Authorization: "Token " + this.props.token
            },
        })
            .then(response => response.json())
            .then(responseObj => {
                this.setState({group: responseObj})
                this.props.navigation.setParams({groupName: responseObj["name"]})
            });

        
    }

    _handleIndexChange = index => this.setState({ index });

    _renderHeader = props => <TabBar {...props} labelStyle={{fontSize: 11}} style={[styles.eventTabBar, { backgroundColor: '#' + this.state.group.color }]} />;

    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'messages':
                return <GroupsMessage group={this.state.group} />;
            case 'details':
                return <GroupsMessage group={this.state.group} />;
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