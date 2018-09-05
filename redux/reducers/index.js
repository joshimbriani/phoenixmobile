import { combineReducers } from 'redux';
import backgroundColorReducer from './backgroundColor';
import tokenReducer from './token';
import userReducer from './user';
import eventReducer from './events';
import settingsReducer from './settings';
import locationReducer from './location';

const reducers = combineReducers({
    backgroundColorReducer,
    tokenReducer,
    userReducer,
    eventReducer,
    settingsReducer,
    locationReducer
});

export default reducers;