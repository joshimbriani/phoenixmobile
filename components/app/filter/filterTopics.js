import React from 'react';
import { connect } from 'react-redux';
import { Platform, Text, Dimensions, View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { Form, Input } from 'native-base';
import { styles } from '../../../assets/styles';
import SettingsList from 'react-native-settings-list';
import PlatformIonicon from '../../utils/platformIonicon';
import SwitchSelector from 'react-native-switch-selector';
import { getURLForPlatform } from '../../utils/networkUtils';

class FilterTopics extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Filter",
    });

    constructor(props) {
        super(props);

        this.state = {
            filterType: props.navigation.state.params.topicType,
            customTopics: props.navigation.state.params.customTopics,
            topic: ''
        }

        this.addTopic = this.addTopic.bind(this);
        this.setFiltersAsDefault = this.setFiltersAsDefault.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.removeTopic = this.removeTopic.bind(this);
    }

    setFiltersAsDefault() {
        this.props.navigation.state.params.setFilter('topics', {type: this.state.filterType, topics: this.state.filterType === 'custom' ? this.state.customTopics : []});
        this.props.navigation.goBack()
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.scrollView) {
                this.scrollView.scrollToEnd({ animated: false })
            }

        }, 150);
    }

    addTopic(topic) {
        if (topic.length < 1) {
            return;
        }

        if (this.state.customTopics.map((topic) => topic.name.toLowerCase()).indexOf(topic.toLowerCase()) > -1) {
            return;
        }

        fetch(getURLForPlatform() + "api/v1/topics/getorcreate/?word=" + topic, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Token ' + this.props.token,
            },
        }).then(response => response.json())
            .then(responseJSON => {
                var topics = this.state.customTopics.slice();
                topics.push(responseJSON)
                this.setState({ customTopics: topics });
            });
    }

    removeTopic(index) {
        var topics = this.state.customTopics.slice();
        topics.splice(index, 1);
        this.setState({ customTopics: topics });
        
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'column', backgroundColor: 'white', flex: 1 }}>
                    <TouchableOpacity onPress={() => this.setState({ filterType: 'all' })}>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                            <View style={{ marginRight: 10, alignItems: 'center', justifyContent: 'center', width: 35 }}>
                                {this.state.filterType === 'all' && <PlatformIonicon
                                    name="checkmark"
                                    style={{ color: 'black' }}
                                    size={35}
                                />}
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', padding: 15 }}>
                                <Text>All Topics</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ filterType: 'followed' })}>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                            <View style={{ marginRight: 10, alignItems: 'center', justifyContent: 'center', width: 35 }}>
                                {this.state.filterType === 'followed' && <PlatformIonicon
                                    name="checkmark"
                                    style={{ color: 'black' }}
                                    size={35}
                                />}
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', padding: 15 }}>
                                <Text>My Followed Topics</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ filterType: 'custom' })}>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                            <View style={{ marginRight: 10, alignItems: 'center', justifyContent: 'center', width: 35 }}>
                                {this.state.filterType === 'custom' && <PlatformIonicon
                                    name="checkmark"
                                    style={{ color: 'black' }}
                                    size={35}
                                />}
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', padding: 15 }}>
                                <Text>Custom Topic List</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {this.state.filterType === 'custom' && <View style={{flex: 1}}>
                        <ScrollView ref={scrollView => { this.scrollView = scrollView; }} keyboardShouldPersistTaps={'handled'}>
                            <View style={{ flex: 1 }}>
                                {this.state.customTopics && this.state.customTopics.length > 0 && this.state.customTopics.map((topic, index) => 
                                    <View key={index} style={{ flexDirection: 'row', backgroundColor: '#' + topic.color, marginTop: 10, marginHorizontal: 10, borderRadius: 5 }}>
                                        <View style={{ padding: 5, margin: 10, backgroundColor: 'white', borderRadius: 30, height: 60, width: 60 }}>
                                            <PlatformIonicon
                                                name={topic.icon}
                                                size={50}
                                                style={{ color: "black", justifyContent: 'center', alignSelf: 'center' }}
                                            />
                                        </View>
                                        <View style={{ flex: 1, paddingLeft: 15, alignSelf: 'center' }}>
                                            <Text numberOfLines={1} style={{ color: 'white', fontSize: 20 }}>{topic.name}</Text>
                                        </View>
                                        <View style={{ alignSelf: 'center', paddingRight: 10 }}>
                                            <PlatformIonicon
                                                name={'close-circle'}
                                                size={30}
                                                style={{ color: "white" }}
                                                onPress={() => this.removeTopic(index)}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                        <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                            <Form style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, paddingLeft: 10 }}>
                                    <TextInput placeholder="Type to Add Events to Custom Filter!" value={this.state.topic} onChangeText={(text) => this.setState({ topic: text })} />
                                </View>
                                <View style={{ paddingRight: 10 }}>
                                    <Button title="Add" style={{ paddingHorizontal: 5 }} accessibilityLabel="Press this button to add a new topic." onPress={() => { this.addTopic(this.state.topic.trim()); this.scrollToBottom(); this.setState({ topic: "" }) }}>
                                        <Text style={{ color: 'white' }}>Add Topic</Text>
                                    </Button>

                                </View>
                            </Form>
                        </View>
                    </View>
                    }
                </View>
                <View style={{ backgroundColor: 'white', padding: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' }}>
                        <Button
                            onPress={() => this.props.navigation.goBack()}
                            title="Cancel"
                            color="#00ABE6"
                            accessibilityLabel="Return without saving filters"
                        />
                        <Button
                            onPress={() => this.setFiltersAsDefault()}
                            title="Save topics"
                            color="#00ABE6"
                            accessibilityLabel="Returning after saving filters"
                        />
                    </View>
                </View>
            </View>

        )
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

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterTopics);