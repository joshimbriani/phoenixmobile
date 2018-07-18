import React from 'react';
import { connect } from 'react-redux';
import { Platform, Text, FlatList, View } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { getURLForPlatform } from '../utils/networkUtils';

import { Fab } from 'native-base';

class GroupsList extends React.Component{
    static navigationOptions = (Platform.OS === 'android') ? ({ navigation }) => ({
        title: 'Groups',
        headerLeft: <PlatformIonicon
            name="menu"
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.navigate('DrawerOpen')} />
    }) : ({ navigation }) => ({
        title: 'Home',
        headerStyle: { paddingTop: -22, }
    });

    constructor(props) {
        super(props);

        this.state = {
            groups: []
        }

    }  

    componentDidMount() {
        this.loadGroups();
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({item}) => (
        <View>
            <Text>{item.name}</Text>
        </View>
    )

    render() {
        // TODO: Pass the groupID through the GroupWrapper
        return (
            <View style={{flex: 1}}>
                <FlatList
                    data={this.state.groups}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
                <Fab
                    active={true}
                    containerStyle={{}}
                    style={{ backgroundColor: '#e84118' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('NewGroup', { })}>
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
                this.setState({groups: responseObj["groups"]})
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