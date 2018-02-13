import React from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { Provider, connect } from 'react-redux';
import NavContainer from './components/subviews/navcontainer'
import { Constants } from 'expo';
import configureStore from './redux/store'
import * as colorActions from './redux/actions/backgroundColor'
import Index from './components/app/index';
import { PersistGate } from 'redux-persist/es/integration/react';

const { persistor, store } = configureStore();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Index />
        </PersistGate>
      </Provider>
    );
  }
}
