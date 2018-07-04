import React from 'react';
import { Alert, Platform, StatusBar, FlatList, StyleSheet, TouchableHighlight, View, Dimensions } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { connect } from 'react-redux';

import myEventDetailView from './myEventDetailView';
import myEventDetailMessages from './myEventDetailMessages';
import myEventDetailPhotos from './myEventDetailPhotos';

import { getURLForPlatform } from '../utils/networkUtils';
import { bindActionCreators } from 'redux';
import * as eventActions from '../../redux/actions/events';
import { styles } from '../../assets/styles';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

class MyEventDetailWrapper extends React.Component {
    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: navigation.state.params.title,
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
        data: {},
        index: 0,
        routes: [
            { key: 'detailview', title: "Details" },
            { key: 'messages', title: 'Messages' },
            { key: 'photos', title: 'Photos' },
        ],
        
    };

    _handleIndexChange = index => this.setState({ index });

    _renderHeader = props => <TabBar {...props} />;

    _renderScene = SceneMap({
        detailview: myEventDetailView,
        messages: myEventDetailMessages,
        photos: myEventDetailPhotos
    });

    componentDidMount() {
        fetch(getURLForPlatform() + "api/v1/events/" + this.props.navigation.state.params.id, {
            method: 'GET',
            Authorization: "Token " + this.props.token
        })
            .then(response => response.json())
            .then(responseObj => {
                this.props.eventActions.saveCurrentEvent(responseObj);
            });
    }

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
        token: state.tokenReducer.token
    };
}

function mapDispatchToProps(dispatch) {
    return {
        eventActions: bindActionCreators(eventActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyEventDetailWrapper);