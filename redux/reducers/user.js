import { SAVE_USER_OBJECT, PURGE_USER_OBJECT } from '../actions/actionTypes';

const defaultState = { user: {} };

export default function userReducer(state = defaultState, action) {
    switch (action.type) {
        case SAVE_USER_OBJECT:
            return Object.assign({}, state, {
                user: action.user
            })
        case  PURGE_USER_OBJECT:
            return defaultState
        default:
            return state
    }
}