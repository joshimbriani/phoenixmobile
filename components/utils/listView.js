import React from 'react';
import { FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';

export class KootaListView extends React.Component {

    render() {
        return (
            <FlatList
                data={this.props.data}
                contentContainerStyle={{ paddingTop: 0 }}
                keyExtractor={(item, index) => index}
                style={styles.listView}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableHighlight onPress={() => { this.props.pressCallback(item) }}>
                            <View key={item.id} style={[styles.listitem, {}]}>
                                <Text style={styles.itemText}>{item.title}</Text>
                            </View>
                        </TouchableHighlight>
                    )
                }}
            />
        );
    }
}

KootaListView.PropTypes = {
    data: PropTypes.array,
    pressCallback: PropTypes.func
}