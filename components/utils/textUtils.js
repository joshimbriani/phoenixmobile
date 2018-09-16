import { getMonthNameFromMonthNumber } from './datetimeUtils';
import { debounce } from 'lodash'


export function generateUserToString(userID, users, creator) {
    const userList = removeUserFromList(userID, users);
    return userList.map(function(item) { if (item.username === creator) { return item.username + ' (Creator)' } return item.username }).join(", ")
}

function removeUserFromList(userID, users) {
    const usersClone = users.map(user => Object.assign({}, user));
    for (var i = usersClone.length - 1; i >= 0; i--) {
        if (usersClone[i].id === userID) {
            usersClone.splice(i, 1);
        }
    }

    return usersClone;
}

export function getDateStringForMessage(date) {
    const now = new Date();

    if (now.getFullYear() > date.getFullYear()) {
        return date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear()
    }
    else if (now.getMonth() === date.getMonth() && now.getDate() === date.getDate() && now.getFullYear() === date.getFullYear()) {
        return (date.getHours() % 12) + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + (date.getHours() < 12 ? 'AM' : 'PM');
    } else {
        return getMonthNameFromMonthNumber(date.getMonth()) + ' ' + date.getDate()
    }
}

export function _debouncedSearch(func) {
    debounce(func, 1000);
}