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
    if (!state.userReducer.details) {
      state.userReducer["details"] = {}
    }
    if (!state.userReducer.createdEvents) {
      state.userReducer["createdEvents"] = []
    }
    if (!state.userReducer.followingTopics) {
      state.userReducer["followingTopics"] = []
    }
    if (!state.userReducer.goingToEvents) {
      state.userReducer["goingToEvents"] = []
    }
    if (!state.userReducer.invitedToEvents) {
      state.userReducer["invitedToEvents"] = []
    }
    if (!state.userReducer.interestedInEvents) {
      state.userReducer["interestedInEvents"] = []
    }
    if (!state.userReducer.pendingOutgoingRelationships) {
      state.userReducer["pendingOutgoingRelationships"] = []
    }
    if (!state.userReducer.pendingIncomingRelationships) {
      state.userReducer["pendingIncomingRelationships"] = []
    }
    if (!state.userReducer.contacts) {
      state.userReducer["contacts"] = []
    }
    if (!state.userReducer.blockedUsers) {
      state.userReducer["blockedUsers"] = []
    }
    if (!state.locationReducer) {
      state["locationReducer"] = {
        locations: [{id: -1, name: 'Current Location'}],
        selected: -1
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