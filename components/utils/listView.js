import React from 'react';
import { FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';

import { materialColors, getMaterialColorLength } from '../utils/styleutils';
import { getDayOfWeekFromDayNumber, getMonthNameFromMonthNumber } from '../utils/datetimeUtils';

export class KootaListView extends React.Component {

    render() {
        return (
            <FlatList
                data={this.props.data}
                contentContainerStyle={{ paddingTop: 0 }}
                keyExtractor={(item, index) => index}
                style={styles.listView}
                renderItem={({ item, index }) => {
                    const date = new Date(item.datetime)
                    return (
                        <TouchableHighlight onPress={() => { this.props.pressCallback(item) }}>
                            <View key={item.id} style={[styles.listitem, {backgroundColor: materialColors[index % getMaterialColorLength], justifyContent: 'center', alignItems: 'center'}]} >
                                <View style={{paddingTop: 15, paddingBottom: 5}}>
                                    <Text style={[styles.itemText, {fontSize: 20, fontWeight: 'bold'}]}>{item.title}</Text>
                                </View>
                                <View style={{padding: 5}}>
                                    <Text style={{color: 'white', fontSize: 15}} numberOfLines={2}>{item.description}</Text>
                                </View>
                                <View style={{paddingTop: 5, paddingBottom: 15}}>
                                    <Text style={{color: 'white', fontSize: 17}}>
                                        {getDayOfWeekFromDayNumber(date.getDay())} {getMonthNameFromMonthNumber(date.getMonth())} {date.getDate()}, {date.getFullYear()} @ {(date.getHours() % 12) + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + (date.getHours() < 12 ? 'AM' : 'PM')}
                                    </Text>
                                </View>
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
    pressCallback: PropTypes.func,
    colors: PropTypes.array
}