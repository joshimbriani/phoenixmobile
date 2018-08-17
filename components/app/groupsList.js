import React from 'react';
import { connect } from 'react-redux';
import { Platform, Text, FlatList, View, TouchableOpacity, RefreshControl, DeviceEventEmitter } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { getURLForPlatform } from '../utils/networkUtils';
import Icon from 'react-native-vector-icons/Ionicons';

import { Fab } from 'native-base';

class GroupsList extends React.Component {
    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'Groups',
        headerLeft: <Icon
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.openDrawer()}
            name="md-menu"
        />
    }) : ({ navigation }) => ({
        title: 'Groups',
        headerStyle: { paddingTop: -22, }
    });

    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            refreshing: true
        }

    }

    componentDidMount() {
        this.loadGroups();

        DeviceEventEmitter.addListener('refresh', (e) => { this.loadGroups() })
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('GroupWrapper', { groupID: item.id })}>
                <View key={index} style={{ flexDirection: 'row', height: 75, borderBottomWidth: 1 }}>
                    <View style={{ justifyContent: 'center', paddingRight: 10, paddingLeft: 10 }}>
                        <View style={{ backgroundColor: item.color, height: 50, aspectRatio: 1, borderRadius: 50 }}></View>
                    </View>
                    <View style={{ justifyContent: 'center', flex: 1 }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', paddingRight: 5 }}>
                        <PlatformIonicon
                            name={"arrow-dropright"}
                            size={50}
                            style={{ color: "black" }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _onRefresh = () => {
        this.setState({ refreshing: true })
        this.loadGroups();
    }

    render() {
        // TODO: Pass the groupID through the GroupWrapper
        return (
            <View style={{ flex: 1 }}>
                {this.state.groups.length > 0 && !this.state.refreshing && <FlatList
                    data={this.state.groups}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                />}
                {this.state.groups.length <= 0 && !this.state.refreshing && <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize: 20, color: 'black'}}>You aren't in any groups! You should start a new one for your crew!</Text>
                </View>}
                {this.state.refreshing && <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize: 20, color: 'black'}}>Loading...</Text>
                </View>}
                <Fab
                    active={true}
                    containerStyle={{}}
                    style={{ backgroundColor: '#e84118' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('NewGroup', {})}>
                    <PlatformIonicon
                        name={"add"}
                        size={50} //this doesn't adjust the size...?
                        style={{ color: "white" }}
                    />
                </Fab>
            </View>
        )
    }

    loadGroups() {
        fetch(getURLForPlatform() + "api/v1/groups/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
        })
            .then(response => response.json())
            .then(responseObj => {
                this.setState({ groups: responseObj["groups"], refreshing: false })
            });
    }
}

function mapStateToProps(state) {
    return {
        token: state.tokenReducer.token,
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GroupsList);