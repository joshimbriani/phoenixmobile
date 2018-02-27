import { combineReducers } from 'redux';
import backgroundColorReducer from './backgroundColor';
import tokenReducer from './token';
import userReducer from './user';
import eventReducer from './events';

const reducers = combineReducers({
    backgroundColorReducer,
    tokenReducer,
    userReducer,
    eventReducer
});

export default reducers;