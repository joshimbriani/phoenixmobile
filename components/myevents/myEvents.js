import React from 'react';
import { Container, Fab, Header, ListItem, Item, Input, Icon, Button, Text } from 'native-base';
import { Platform, SectionList, StyleSheet, TouchableHighlight, View } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import MyEventDetailWrapper from './myEventDetailWrapper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getURLForPlatform } from '../utils/networkUtils';
import * as userActions from '../../redux/actions/user';
import { styles } from '../../assets/styles';


class MyEvents extends React.Component {
    state = {
        data: [],
    }

    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'My Events',
        headerLeft: <PlatformIonicon
            name="menu"
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.navigate('DrawerOpen')} />
    }) : ({ navigation }) => ({
        title: 'My Events',
        headerStyle: { paddingTop: -22, }
    });

    componentDidMount() {
            this.props.userActions.loadUser(this.props.token);
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
        if (Object.keys(this.props.user).length > 0) {
            return this.props.user.eventsCreated.length + this.props.user.goingTo.length + this.props.user.invitedTo.length + this.props.user.interestedIn.length;
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
                            <TouchableHighlight onPress={() => { this.props.navigation.navigate('MyEventsDetail', { title: item.title, id: item.id }); }}>
                                <View key={item.id} style={[styles.listitem]}>
                                    <Text style={styles.itemText}>{item.title}</Text>
                                </View>
                            </TouchableHighlight>
                        )
                    }}
                    renderSectionHeader={({ section }) => this.renderEmptySections(section)}
                    sections={[
                        {name: 'Created', data: this.props.user.eventsCreated},
                        {name: 'Going To', data: this.props.user.goingTo},
                        {name: 'Invited To', data: this.props.user.invitedTo},
                        {name: 'Interested In', data: this.props.user.interestedIn}
                    ]}
                    keyExtractor={(item, index) => index} />
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
        user: state.userReducer.user
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
