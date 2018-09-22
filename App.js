import React from 'react';
import { StyleSheet, Text, FlatList, View, AsyncStorage } from 'react-native';
import { Provider, connect } from 'react-redux';
import NavContainer from './components/subviews/navcontainer'
import configureStore from './redux/store'
import * as colorActions from './redux/actions/backgroundColor'
import Index from './components/app/index';
import { PersistGate } from 'redux-persist/es/integration/react';
import { MenuProvider } from 'react-native-popup-menu';

import firebase from 'react-native-firebase'

const { persistor, store } = configureStore();

import { Sentry } from 'react-native-sentry';

Sentry.config('https://9795f953678b4ee7a1f848631d88b772@sentry.io/1283598').install();


export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MenuProvider>
            <Index />
          </MenuProvider>
        </PersistGate>
      </Provider>
    );
  }
}
