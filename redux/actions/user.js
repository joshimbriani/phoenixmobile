import { SAVE_USER_OBJECT, PURGE_USER_OBJECT } from '../actions/actionTypes';
import { getURLForPlatform } from '../../components/utils/networkUtils';
import { purgeUserToken } from './token';

export function saveUserObject(user) {
    return {
        type: SAVE_USER_OBJECT,
        user: user
    }
}

export function loadUser() {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/users/current/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(responseObj => dispatch(saveUserObject(responseObj)));
    }
}

export function logout(token) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "rest-auth/logout", {
            method: 'POST',
            Authorization: 'Token ' + token
        }).then(response => { dispatch(purgeUserObject()); dispatch(purgeUserToken())});
    }
}

export function purgeUserObject() {
    return {
        type: PURGE_USER_OBJECT
    }
}