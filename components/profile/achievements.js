import React from 'react';
import { Alert, Platform, StatusBar, FlatList, StyleSheet, TouchableHighlight, View, Text } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';
import { getURLForPlatform } from '../utils/networkUtils';
import { KootaListView } from '../utils/listView';
import { styles } from '../../assets/styles';
import { AchievementListView } from './achievementListView';

// TODO: Add percentile calculation

class Achievements extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            achievements: [],
        }

        this.getAchievementCount = this.getAchievementCount.bind(this);
    }

    componentDidMount() {
        fetch(getURLForPlatform() + "api/v1/achievements/", {
            headers: {
                Authorization: "Token " + this.props.token
            },
        }).then(response => response.json())
            .then(responseObj => {
                this.setState({ achievements: Object.keys(responseObj).map(key => responseObj[key]) });
            });
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({ item, index }) => (
        <AchievementListView key={index} achievements={item} />
    )

    render() {
        const acCount = this.getAchievementCount();
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: '#34495e' }}>
                    <View style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: '#2ecc71', height: 50, aspectRatio: 1, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}><Text>{acCount}</Text></View>
                        <View><Text style={{ color: 'white' }}>Achievement{acCount !== 1 ? "s" : ""}</Text></View>
                    </View>
                </View>
                <View style={{ flex: 3 }}>
                    {acCount > 0 && <FlatList
                        data={this.state.achievements}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        listKey={(item, index) => 'D' + index.toString()}
                    />}
                    {acCount <= 0 && <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text>You don't have any achievements! Going to events unlocks achievements!</Text>
                    </View>}
                </View>
            </View>
        );
    }

    getAchievementCount() {
        if (!this.state.achievements) {
            return 0
        }

        if (this.state.achievements.length === 0) {
            return 0
        }

        const array = this.state.achievements.map(item => item.achievements)
        return [].concat.apply([], array).length
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
)(Achievements);
