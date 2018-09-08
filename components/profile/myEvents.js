import React from 'react';
import { Container, Fab, Header, ListItem, Item, Input, Button, Text } from 'native-base';
import { Platform, SectionList, StyleSheet, TouchableHighlight, View } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getURLForPlatform } from '../utils/networkUtils';
import * as userActions from '../../redux/actions/user';
import { styles } from '../../assets/styles';
import Icon from 'react-native-vector-icons/Ionicons';

import { getMaterialColor } from '../utils/styleutils';


class MyEvents extends React.Component {
    state = {
        data: [],
    }

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'My Events',
        headerLeft: <Icon
            name="md-menu"
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.openDrawer()} />
    }) : ({ navigation }) => ({
        title: 'My Events',
        headerStyle: { paddingTop: -22, }
    });

    constructor(props) {
        super(props);

        this.noEventsInMyEvents = this.noEventsInMyEvents.bind(this);
    }

    componentDidMount() {
        this.props.userActions.loadCreatedEvents(this.props.token, this.props.user)
        this.props.userActions.loadGoingTo(this.props.token, this.props.user)
        this.props.userActions.loadInvited(this.props.token, this.props.user)
        this.props.userActions.loadInterested(this.props.token, this.props.user)
    }

    renderEmptySections(section) {
        if (section.data.length > 0) {
            return <ListItem itemDivider><Text>{section.name}</Text></ListItem>
        } else {
            return (<View>
            </View>
            )
        }
    }

    noEventsInMyEvents() {
        console.log(this.props.user)
        if (this.props.user > 0) {
            console.log(this.props.createdEvents, this.props.goingToEvents, this.props.invitedToEvents, this.props.interestedInEvents)
            return this.props.createdEvents.length + this.props.goingToEvents.length + this.props.invitedToEvents.length + this.props.interestedInEvents.length;
        }

        return 0
    }

    render() {
        if (this.noEventsInMyEvents() === 0) {
            return (
                <View>
                    <Text style = {styles.bodyStyle}>
                    You aren't associated with any events! Create or sign up for some!
                    </Text>
                </View>
            )
        }
        return (
            <Container>
                <SectionList
                    renderItem={({ item, section }) => {
                        return (
                            <TouchableHighlight onPress={() => this.props.navigation.navigate('EventDetailWrapper', { event: item.title, id: item.id, color: item.color  }) }>
                                <View key={item.id} style={{backgroundColor: item.color, height: 75}}>
                                    <Text style={styles.itemText}>{item.title}</Text>
                                </View>
                            </TouchableHighlight>
                        )
                    }}
                    renderSectionHeader={({ section }) => this.renderEmptySections(section)}
                    sections={[
                        {name: 'Created', data: this.props.createdEvents},
                        {name: 'Going To', data: this.props.goingToEvents},
                        {name: 'Invited To', data: this.props.invitedToEvents},
                        {name: 'Interested In', data: this.props.interestedInEvents}
                    ]}
                    keyExtractor={(item, index) => index} />
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
        user: state.userReducer.user,
        createdEvents: state.userReducer.createdEvents,
        goingToEvents: state.userReducer.goingToEvents,
        invitedToEvents: state.userReducer.invitedToEvents,
        interestedInEvents: state.userReducer.interestedInEvents
    };
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyEvents);
