import React from 'react';
import { Container, Fab, Header, Item, Input, Button, Text } from 'native-base';
import { Platform, RefreshControl, TouchableHighlight, View, PermissionsAndroid, AsyncStorage, ActivityIndicator, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { getURLForPlatform } from '../../utils/networkUtils';
import { EventDisplay } from '../eventDisplay';
import PlatformIonicon from '../../utils/platformIonicon';
import * as userActions from '../../../redux/actions/user';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';

const defaultFilters = {
    changed: false,
    privacy: "all",
    restrictToGender: "all",
    offer: "all",
    datetime: {
        start: -1,
        end: -1
    },
    duration: {
        moreThan: 0,
        lessThan: 300
    },
    capacity: 1,
    topics: {
        type: 'all',
        topics: []
    }
}

class FindSubEvents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            refreshing: false,
            GPSPermission: false,
            loading: true,
            events: [],
            filters: {
                changed: false,
                privacy: "all",
                restrictToGender: "all",
                offer: "all",
                datetime: {
                    start: -1,
                    end: -1
                },
                duration: {
                    moreThan: 0,
                    lessThan: 300
                },
                capacity: 1,
                topics: {
                    type: 'all',
                    topics: []
                }
            }
        };

        this.changeValue = this.changeValue.bind(this);
        this.userInterestedInEvent = this.userInterestedInEvent.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.loadEvents = this.loadEvents.bind(this);

        this.props.navigation.setParams({ setFilter: this.setFilter, loadEvents: this.loadEvents });
    }

    async componentDidMount() {
        this.setState({ loading: true })
        this.loadEvents();
        await this.props.userActions.loadUser(this.props.token);
    }

    setFilter(key, value) {
        var filters = Object.assign({}, this.state.filters);
        filters[key] = value;
        filters["changed"] = true;
        this.setState({ filters: filters });
        // datetime start or end can come back with a -1. Need to handle it. Start = current date, end = no end range
    }

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'Find Forked Events',
        headerRight: <Icon
            name="md-funnel"
            size={35}
            style={{ marginRight: 10 }}
            onPress={() => navigation.navigate('FilterHome', { setFilter: navigation.state.params.setFilter, loadEvents: navigation.state.params.loadEvents, default: false })}
        />

    }) : ({ navigation }) => ({
        title: 'Find Forked Events',
        headerRight: <Icon
            name="ios-funnel"
            size={35}
            style={{ marginRight: 10 }}
            onPress={() => navigation.navigate('FilterHome', { setFilter: navigation.state.params.setFilter, loadEvents: navigation.state.params.loadEvents, default: false })}
        />
    });

    changeValue(text) {
        this.setState({ searchQuery: text });
    }

    _onRefresh() {
        this.props.userActions.loadUser(this.props.token);
        this.loadEvents();
    }

    loadEvents() {
        const filterString = this.generateFilterURLString(this.state.filters);

        fetch(getURLForPlatform() + 'api/v1/events/' + filterString, {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseJSON => {
                if (responseJSON["events"]) {
                    this.setState({ events: responseJSON["events"], loading: false, filters: defaultFilters })
                }
            })
    }

    generateFilterURLString(filterPropsObject) {
        var filterString = "?";
        filterString += ("&includeForks=true")
        filterString += ("&forkedFrom=" + this.props.navigation.state.params.event.id)
        filterString += ("&privacy=" + filterPropsObject.privacy)
        filterString += ("&restrictToGender=" + (filterPropsObject.restrictToGender === 'all' ? 'false' : 'true'))
        filterString += ("&offer=" + filterPropsObject.offer)
        filterString += ("&datetimegt=" + (filterPropsObject.datetime.start === -1 ? 'now' : (typeof filterPropsObject.datetime.start === 'string' ? filterPropsObject.datetime.start : filterPropsObject.datetime.start.toISOString())))
        if (filterPropsObject.datetime.end !== -1) {
            filterString += ("&datetimelt=" + (typeof filterPropsObject.datetime.end === 'string' ? filterPropsObject.datetime.end : filterPropsObject.datetime.end.toISOString()))
        }
        filterString += ("&durationgt=" + (filterPropsObject.duration.moreThan === 0 ? 'all' : filterPropsObject.duration.moreThan))
        filterString += ("&durationlt=" + (filterPropsObject.duration.lessThan === 300 ? 'all' : filterPropsObject.duration.lessThan))
        filterString += ("&capacity=" + filterPropsObject.capacity)
        filterString += ("&topicsType=" + filterPropsObject.topics.type)
        if (filterPropsObject.topics.type === 'custom') {
            filterString += ("&topics=" + filterPropsObject.topics.topics.map(topic => topic.id).join(","))
        }

        return filterString;
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({ item }) => (
        <EventDisplay index={item.id} event={item} interested={this.userInterestedInEvent(item.id)} showButtons={true} username={this.props.user.username} token={this.props.token} goToEvent={() => this.props.navigation.push('EventDetailWrapper', { event: item.title, id: item.id, color: item.color, loadEvents: this.loadEvents })} />
    );

    userInterestedInEvent(eventID) {
        if (this.props.user.interestedIn) {
            for (var i = 0; i < this.props.user.interestedIn.length; i++) {
                if (eventID === this.props.user.interestedIn[i].id) {
                    return true;
                }
            }
        }
        return false;
    }

    render() {
        return (
            <Container style={{ backgroundColor: '#D3D3D3' }}>
                {this.state.loading && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>}
                {!this.state.loading && this.state.events.length > 0 &&
                    <FlatList
                        data={this.state.events}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.loading}
                                onRefresh={this._onRefresh}
                            />
                        }

                    />}
                {!this.state.loading && this.state.events.length <= 0 && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                        <Text>No Events Found. Try Reloading!</Text>
                        <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: 15 }}>
                            <Button onPress={() => { this.setState({ loading: true }); this.loadEvents() }}>
                                <Text>Reload Events</Text>
                            </Button>
                        </View>
                    </View>
                </View>}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
        user: state.userReducer.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FindSubEvents);