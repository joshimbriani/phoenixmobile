import { STORE_USER_TOKEN, PURGE_USER_TOKEN, STORE_FCM_TOKEN, PURGE_FCM_TOKEN } from '../actions/actionTypes';

const defaultState = { token: "", FCMToken: "" };

export default function tokenReducer(state = defaultState, action) {
    switch (action.type) {
        case STORE_USER_TOKEN:
            return Object.assign({}, state, {
                token: action.token
            })
        case PURGE_USER_TOKEN:
            return Object.assign({}, state, {
                token: ""
            })
        case STORE_FCM_TOKEN:
            return Object.assign({}, state, {
                FCMToken: action.token
            })
        case PURGE_FCM_TOKEN:
            return Object.assign({}, state, {
                FCMToken: ""
            })
        default:
            return state
    }
}