import React from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { events: [] };
  }

  componentDidMount() { 
    fetch('http://10.0.2.2:8000/events/?format=json')
      .then((response) => response.json())
      .then((response) => { this.setState({ events: response }) });
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.events}
          renderItem={({ item }) => <Text style={styles.item}>{item.title}</Text>}
          keyExtractor={(item, index) => index} 
        /> 
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
