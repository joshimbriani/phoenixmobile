import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import { createMigrate, persistStore, persistReducer } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';

const persistConfig = {
  key: 'root',
  storage: FilesystemStorage,
  version: 0,
  migrate: (state) => {
    // If filter not in user reducer, then add it
    if (!state.userReducer.filter) {
      state.userReducer["filter"] = {
        datetime: {
          start: -1,
          end: -1
        },
        duration: {
          moreThan: 0,
          lessThan: 300
        },
        capacity: 1,
        topics: {
          type: 'all',
          topics: []
        },
        privacy: 'all',
        offer: 'all',
        restrictToGender: 'all'
      }
    }
    console.log('Migration Running!')
    return Promise.resolve(state)
  }
}

const persistedReducer = persistReducer(persistConfig, reducers);

export default function configureStore() {
  let store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
  );
  let persistor = persistStore(store);
  return { store, persistor };
};