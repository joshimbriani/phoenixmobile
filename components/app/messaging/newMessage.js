import { connect } from 'react-redux';
import React from 'react';
import { SectionList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PlatformIonicon from '../../utils/platformIonicon';
import { styles } from '../../../assets/styles';

import { UserRow } from './userRow';

class NewMessage extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'New Message',
        headerRight: <TouchableOpacity style={{paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}} onPress={() => navigation.state.params.startConversation(navigation, navigation.state.params.toUsers)}>
                        <PlatformIonicon
                            name={'send'}
                            size={30}
                            style={{ color: "black" }}
                        />
                    </TouchableOpacity>
    });

    constructor(props) {
        super(props);

        this.state = {
            toUsers: [],
            creator: {},
            interested: [],
            going: []
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ startConversation: this.startConversation, toUsers: this.state.toUsers });
        this.setState({creator: this.props.navigation.state.params.creator, interested: this.props.navigation.state.params.interested, going: this.props.navigation.state.params.going});
    }

    render() {
        return (
            <View style={[styles.flex1]} >
                <View style={{backgroundColor: 'white', margin: 5}}>
                    <TextInput value={this.userListToString(this.state.toUsers)} placeholder="Select users to message" editable={false} style={{height: 50}} />
                </View>
                <SectionList
                    renderItem={({userForRow, index, section}) => { 
                        // For some unknown reason user here is undefined so I have to do this the hacky way
                        return (
                            <UserRow user={(section.data[index] || {})} section={section.title} select={this.toggleUser} />
                        )
                    }}
                    renderSectionHeader={({section: {title}}) => (
                        <Text style={{fontWeight: 'bold'}}>{title}</Text>
                    )}
                    extraData={true}
                    sections={[
                        {title: 'Event Creator', data: [this.state.creator]},
                        {title: 'Going', data: this.state.going},
                        {title: 'Interested', data: this.state.interested},
                    ]}
                    keyExtractor={(item, index) => item + index}
                />
            </View>
        )
    }

    userListToString(users) {
        var userListString = "";
        for (var i = 0; i < users.length; i++) {
            userListString += users[i].username;
        }

        return userListString
    }

    startConversation(navigation, toUsers) {
        if (toUsers.length > 0) {
            navigation.navigate('ConversationView', { newConvo: true })
        } 
    }

    toggleUser(user) {
        // If not in list
        //var toUsers = this.state.toUsers;
        //toUsers.push(user);
        //this.props.navigation.setParams({ toUsers: toUsers });
        console.log('Toggled')
    }

}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewMessage);