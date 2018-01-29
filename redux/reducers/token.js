import { STORE_USER_TOKEN, PURGE_USER_TOKEN } from '../actions/actionTypes';

const defaultState = { token: "" };

export default function tokenReducer(state = defaultState, action) {
    switch (action.type) {
        case STORE_USER_TOKEN:
            return Object.assign({}, state, {
                token: action.token
            })
        case PURGE_USER_TOKEN:
            return defaultState
        default:
            return state
    }
}