import React from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import NavContainer from './components/navcontainer'

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <NavContainer /> 
      </View> 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
