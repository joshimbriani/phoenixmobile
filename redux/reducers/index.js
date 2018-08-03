import { combineReducers } from 'redux';
import backgroundColorReducer from './backgroundColor';
import tokenReducer from './token';
import userReducer from './user';
import eventReducer from './events';
import settingsReducer from './settings';

const reducers = combineReducers({
    backgroundColorReducer,
    tokenReducer,
    userReducer,
    eventReducer,
    settingsReducer
});

export default reducers;