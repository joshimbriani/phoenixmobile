import React from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import NavContainer from './components/navcontainer'
import { Constants } from 'expo';


export default class App extends React.Component {

  state = {
    fontLoaded: false,
    backgroundColor: "white"
  };

  updateBackgroundColor(color) {
    this.setState({backgroundColor: color});
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{
          backgroundColor: this.state.backgroundColor,
          height: Constants.statusBarHeight,
          marginTop: -Constants.statusBarHeight
        }} />
        {
          this.state.fontLoaded ? (

            <NavContainer changeColor={this.state.updateBackgroundColor} />

          ) : null
        }
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
