import { STORE_USER_TOKEN, PURGE_USER_TOKEN } from '../actions/actionTypes';

export function saveUserToken(token) {
    return {
        type: STORE_USER_TOKEN,
        token: token
    }
}

export function purgeUserToken() {
    return {
        type: PURGE_USER_TOKEN
    }
}