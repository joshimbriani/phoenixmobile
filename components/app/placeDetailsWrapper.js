import React from 'react';
import { connect } from 'react-redux';
import { Platform, Text, Dimensions, BackHandler } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';

import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import PlaceDetailsDetails from './placeDetailsDetails';
import PlaceDetailsEvents from './placeDetailsEvents';
import PlaceDetailsMap from './placeDetailsMap';
import { getURLForPlatform } from '../utils/networkUtils';

import { styles } from '../../assets/styles';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

class PlaceDetailsWrapper extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.place.name,
    });

    constructor(props) {
        super(props);

        var routes = [
            { key: 'details', title: 'Details' },
            { key: 'events', title: 'Events' },
            { key: 'map', title: 'Map' }
        ];

        this.state = {
            index: 0,
            routes: routes,
            events: [],
            achievements: [],
            loading: false
        }

        this.loadPlaceEvents = this.loadPlaceEvents.bind(this);
        this.loadPlaceAchievements = this.loadPlaceAchievements.bind(this);
    }

    componentDidMount() {
        this.loadPlaceEvents();
        this.loadPlaceAchievements();
    }

    loadPlaceEvents() {
        this.setState({loading: true});
        fetch(getURLForPlatform() + "api/v1/events/?datetimegt=now&place=" + this.props.navigation.state.params.place.id, {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ events: responseObj["events"], loading: false });
            })
    }

    loadPlaceAchievements() {
        this.setState({loading: true});
        fetch(getURLForPlatform() + "api/v1/achievements/?place=" + this.props.navigation.state.params.place.id, {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseObj => {
                console.log(responseObj)
                this.setState({ achievements: responseObj, loading: false });
            })
    }

    _handleIndexChange = index => {
        this.setState({ index })
    };

    _renderHeader = props => <TabBar {...props} labelStyle={{fontSize: 11}} style={[styles.eventTabBar, { backgroundColor: 'red' }]} />;

    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'details':
                return <PlaceDetailsDetails navigation={this.props.navigation} achievements={this.state.achievements} place={this.props.navigation.state.params.place} />;
            case 'events':
                return <PlaceDetailsEvents navigation={this.props.navigation} loadPlaceEvents={this.loadPlaceEvents} events={this.state.events} place={this.props.navigation.state.params.place} />;
            case 'map':
                return <PlaceDetailsMap place={this.props.navigation.state.params.place} />;
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
)(PlaceDetailsWrapper);