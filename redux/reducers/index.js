import { combineReducers } from 'redux';
import backgroundColorReducer from './backgroundColor';
import tokenReducer from './token';
import userReducer from './user';

const reducers = combineReducers({
    backgroundColorReducer,
    tokenReducer,
    userReducer
});

export default reducers;