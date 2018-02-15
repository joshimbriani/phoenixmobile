import React from 'react';
import { Alert, Platform, StyleSheet, TouchableHighlight, View, Dimensions } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';

import MyEvents from './myEvents';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
  };
  
  const FirstRoute = () => <View style={[ styles.container, { backgroundColor: '#ff4081' } ]} />;
  const SecondRoute = () => <View style={[ styles.container, { backgroundColor: '#673ab7' } ]} />;

export default class MyEventsTabContainer extends React.Component {

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

    render() {
        return (
            <MyEvents />
        )
    }
}