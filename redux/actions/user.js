import { SAVE_USER_OBJECT, PURGE_USER_OBJECT } from '../actions/actionTypes';
import { getURLForPlatform } from '../../components/utils/networkUtils';

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

export function purgeUserObject() {
    return {
        type: PURGE_USER_OBJECT
    }
}