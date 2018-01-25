import { combineReducers } from 'redux';
import backgroundColorReducer from './backgroundColor';
import tokenReducer from './token';
import userRedcuer from './user';

const reducers = combineReducers({
    backgroundColorReducer,
    tokenReducer,
    userRedcuer
});

export default reducers;