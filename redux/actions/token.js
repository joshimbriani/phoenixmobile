import { STORE_USER_TOKEN, PURGE_USER_TOKEN, STORE_FCM_TOKEN, PURGE_FCM_TOKEN } from '../actions/actionTypes';

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

export function saveFCMToken(token) {
    return {
        type: STORE_FCM_TOKEN,
        token
    }
}

export function purgeFCMToken() {
    return {
        type: PURGE_FCM_TOKEN
    }
}