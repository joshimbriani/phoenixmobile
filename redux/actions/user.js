import { SAVE_USER_OBJECT, PURGE_USER_OBJECT } from '../actions/actionTypes';

export function saveUserObject(user) {
    return {
        type: SAVE_USER_OBJECT,
        user: user
    }
}

export function purgeUserObject() {
    return {
        type: PURGE_USER_OBJECT
    }
}