import React from 'react';
import { connect } from 'react-redux';
import { Platform, Text, Dimensions, BackHandler } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';

import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import GroupsMessage from './groupsMessage';
import GroupsDetails from './groupsDetails';
import { GroupHeader } from './groupHeader';
import { getURLForPlatform } from '../utils/networkUtils';
import { HeaderBackButton } from 'react-navigation';

import {styles} from '../../assets/styles';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

class GroupWrapper extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.groupName || "Loading...",
        headerLeft: <HeaderBackButton onPress={() => { if (navigation.state.params.backKey) { navigation.goBack(navigation.state.params.backKey) } else { navigation.goBack() } }} />,
        headerRight: <GroupHeader index={navigation.state.params.index} editing={navigation.state.params.editing} saveEdits={navigation.state.params.saveEdits} cancelEditing={navigation.state.params.cancelEditing} edit={navigation.state.params.edit} />
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
            group: {},
            editing: false,
            name: "",
            description: "",
            color: ""
        }

        this.handleBackPress = this.handleBackPress.bind(this);
        this.edit = this.edit.bind(this);
        this.cancelEditing = this.cancelEditing.bind(this);
        this.saveEdits = this.saveEdits.bind(this);
        this.setGroupParams = this.setGroupParams.bind(this);
        this.loadGroup = this.loadGroup.bind(this);

        this.props.navigation.setParams({ index: 0, editing: false, saveEdits: this.saveEdits, cancelEditing: this.cancelEditing, edit: this.edit });
    }

    componentDidMount() {
        this.loadGroup();

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress() {
        if (this.props.navigation.state.params.backKey) 
        { 
            this.props.navigation.goBack(this.props.navigation.state.params.backKey) 
        } else {
            this.props.navigation.goBack()
        }

        return true;
    }

    loadGroup() {
        fetch(getURLForPlatform() + "api/v1/groups/" + this.props.navigation.state.params.groupID + "/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
            Authorization: 'Token ' + this.props.token,
        })
            .then(response => response.json())
            .then(responseObj => {
                this.setState({group: responseObj})
                this.props.navigation.setParams({groupName: responseObj["name"]})
            });
    }

    _handleIndexChange = index => {
        this.props.navigation.setParams({ index });
        this.setState({ index })
    };

    _renderHeader = props => <TabBar {...props} labelStyle={{fontSize: 11}} style={[styles.eventTabBar, { backgroundColor: this.state.group.color ? this.state.group.color : '#ffffff' }]} />;

    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'messages':
                return <GroupsMessage group={this.state.group} navigation={this.props.navigation} />;
            case 'details':
                return <GroupsDetails group={this.state.group} setGroupParams={this.setGroupParams} editing={this.state.editing} loadGroup={this.loadGroup} navigation={this.props.navigation} />;
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

    saveEdits() {
        fetch(getURLForPlatform() + "api/v1/groups/" + this.state.group.id + "/", {
            method: 'PUT',
            Authorization: 'Token ' + this.props.token,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'name': this.state.name,
                'description': this.state.description,
                'color': this.state.color,
            })
        }).then(response => {
            if (response.ok) {
                this.loadGroup();
                this.setState({editing: false})
                this.props.navigation.setParams({editing: false})
            }
        });
    }

    cancelEditing() {
        this.setState({editing: false})
        this.props.navigation.setParams({ editing: false })
    }

    edit() {
        this.setState({editing: true})
        this.props.navigation.setParams({ editing: true })
    }

    setGroupParams(name, color, description) {
        this.setState({name, color, description})
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token
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