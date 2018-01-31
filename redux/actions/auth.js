import { getURLForPlatform } from "../../components/utils/networkUtils";

import { purgeUserObject } from './user';
import { purgeUserToken } from './token';

export function logout(token) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "rest-auth/logout", {
            method: 'POST',
            Authorization: 'Token ' + token
        }).then(response => {dispatch(purgeUserObject()); dispatch(purgeUserToken())});
    }
}