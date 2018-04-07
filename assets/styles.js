import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, StyleSheet, TouchableHighlight, View } from 'react-native';
import GridView from 'react-native-super-grid';
import PlatformIonicon from '../components/utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../redux/actions/backgroundColor';
import * as userActions from '../redux/actions/user';
import randomMC from 'random-material-color';
import SettingsList from 'react-native-settings-list';
import { Dropdown } from 'react-native-material-dropdown';
import { NavigationActions } from 'react-navigation';

export const styles = StyleSheet.create({
  titleStyle: {
    backgroundColor: 'white',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 10,
  },
  bodyStyle: {
    backgroundColor: 'white',
    color: 'grey',
    fontSize: 15,
    paddingLeft: 30,
  },
  listitem: {
    alignSelf: 'stretch',
    height: 200,
  },
  itemText: {
    color: 'white',
    fontSize: 40,
    paddingTop: 5,
    textAlign: 'center',
    fontFamily: 'Roboto_medium'
  },
  listView: {
  	flex: 5
  },
  gridView: {
    flex: 1,
  },
  itemBox: {
    height: 150,
    backgroundColor: '#1abc9c',
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    followView: {
        flex: -1
    },
});

//import { styles } from '../../assets/styles';



