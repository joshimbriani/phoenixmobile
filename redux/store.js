import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';

const persistConfig = {
    key: 'root',
    storage: FilesystemStorage,
}

const persistedReducer = persistReducer(persistConfig, reducers);

export default function configureStore() {
    let store = createStore(
        persistedReducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        applyMiddleware(thunk)
    );
    let persistor = persistStore(store);
    return {store, persistor};
};