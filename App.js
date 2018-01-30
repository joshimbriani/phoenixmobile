import React from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { Provider, connect } from 'react-redux';
import NavContainer from './components/navcontainer'
import { Constants } from 'expo';
import configureStore from './redux/store'
import * as colorActions from './redux/actions/backgroundColor'
import Index from './components/index';
import { PersistGate } from 'redux-persist/es/integration/react';

const { persistor, store } = configureStore();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Index />
        </PersistGate>
      </Provider>
    );
  }
}
