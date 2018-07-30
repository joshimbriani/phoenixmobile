import React, { Component } from 'react';
import { FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class ColorPicker extends Component {
  state = {
    colors: this.props.colors,
    selectedColor: this.props.selectedColor,
  };

  renderItem = ({ item }) => {
    const fontColor = getContrastYIQ(item);
    return (
    <TouchableOpacity
      style={[styles.circle, { backgroundColor: item }]}
      onPress={() => {
        this.setState({ selectedColor: item });
        this.props.onSelect(item);
      }}>
      {this.state.selectedColor === item &&
        <Icon name="md-checkmark" style={{ color: fontColor, fontSize: 24 }} />}
    </TouchableOpacity>
  )};

  _keyExtractor = (item, index) => index;

  render() {
    return (
      <FlatList
        data={this.state.colors}
        extraData={this.state}
        renderItem={this.renderItem}
        keyExtractor={this._keyExtractor}
        horizontal={true}
        keyboardShouldPersistTaps="always"
        style={{ maxHeight: 75 }}
      />
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const getContrastYIQ = hexcolor => {
    var r = parseInt(hexcolor.substring(1, 3), 16);
    var g = parseInt(hexcolor.substring(3, 5), 16);
    var b = parseInt(hexcolor.substring(5, 7), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#444' : '#fff';
};
