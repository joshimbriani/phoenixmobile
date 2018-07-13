import React from 'react';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor'
import PlatformIonicon from '../utils/platformIonicon';
import ColorScheme from 'color-scheme';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { getURLForPlatform } from '../utils/networkUtils';
import { styles } from '../../assets/styles';
import EventDetailDetails from './eventDetailDetails';
import EventDetailPlace from './eventDetailPlace';
import EventDetailPeople from './eventDetailPeople';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

class EventDetailWrapper extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.event,
        headerStyle: { backgroundColor: '#' + navigation.state.params.color },
    });

    constructor(props) {
        super(props);
        this.state = {
            eventData: {},
            index: 0,
            routes: [
                { key: 'details', title: 'Details' },
                { key: 'place', title: 'Place' },
                { key: 'people', title: 'People' },
            ],
        }
    }

    _handleIndexChange = index => this.setState({ index });

    _renderHeader = props => <TabBar {...props} style={[styles.eventTabBar, { backgroundColor: '#' + this.props.navigation.state.params.color }]} />;

    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'details':
                return <EventDetailDetails event={this.state.eventData} color={this.props.navigation.state.params.color} navigation={this.props.navigation} />;
            case 'place':
                return <EventDetailPlace event={this.state.eventData} color={this.props.navigation.state.params.color} navigation={this.props.navigation} />;
            case 'people':
                return <EventDetailPeople event={this.state.eventData} color={this.props.navigation.state.params.color} navigation={this.props.navigation} />
            default:
                return null;
        }
    }


    componentDidMount() {
        fetch(getURLForPlatform() + "api/v1/events/" + this.props.navigation.state.params.id + "?format=json", {
            headers: {
                Authorization: "Token " + this.props.token
            }
        })
            .then(response => response.json())
            .then(responseObj => {
                this.setState({ eventData: responseObj });
            })
    }

    render() {
        return (
            <TabViewAnimated
                style={styles.eventTabView}
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
)(EventDetailWrapper);

