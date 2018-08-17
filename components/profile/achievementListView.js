import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, Text, TouchableOpacity, Image } from 'react-native';
import Collapsible from 'react-native-collapsible';

import PlatformIonicon from '../utils/platformIonicon';
import { CachedImage } from 'react-native-cached-image';

export class AchievementListView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: true,
        }
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({ item, index }) => (
        <View key={index} style={{ alignItems: 'center', padding: 10, margin: 5 }}>
            <CachedImage
                key={index}
                style={{ width: 50, height: 50, borderRadius: 25 }}
                source={{ uri: (item.icon || 'http://via.placeholder.com/200x200') }}
                ttl={60 * 60 * 24 * 3}
                fallbackSource={require('../../assets/images/KootaK.png')}
            />
            <Text>{item.title}</Text>
        </View>
    )

    render() {
        return (
            <View key={this.props.index} style={{ borderBottomWidth: this.state.collapsed ? 0 : 1 }}>
                <TouchableOpacity onPress={() => this.setState({ collapsed: !this.state.collapsed })}>
                    <View style={{ flexDirection: 'row', height: 50, borderBottomWidth: 1 }}>
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>{this.props.achievements.place.name}</Text>
                        </View>
                        <View style={{ justifyContent: 'center', paddingRight: 10 }}>
                            <PlatformIonicon
                                name={this.state.collapsed ? "arrow-dropdown" : "arrow-dropup"}
                                style={{ paddingLeft: 10 }}
                                size={35} />
                        </View>
                    </View>
                </TouchableOpacity>
                <Collapsible collapsed={this.state.collapsed}>
                    <FlatList
                        contentContainerStyle={{ justifyContent: 'center', flexDirection: 'row' }}
                        extraData={this.props}
                        numColumns={2}
                        keyExtractor={this._keyExtractor}
                        horizontal={false}
                        data={this.props.achievements.achievements}
                        renderItem={this._renderItem}
                        listKey={(item, index) => 'E' + index.toString()}
                    />
                </Collapsible>
            </View>
        )
    }
}

AchievementListView.propTypes = {
    achievements: PropTypes.object,
    index: PropTypes.number
}