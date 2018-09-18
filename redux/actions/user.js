import {
    SAVE_USER_OBJECT,
    PURGE_USER_OBJECT,
    SAVE_USER_FILTER,
    PURGE_USER_FILTER,
    SAVE_USER_DETAILS,
    PURGE_USER_DETAILS,
    SAVE_USER_CREATED_EVENTS,
    PURGE_USER_CREATED_EVENTS,
    SAVE_USER_FOLLOWING_TOPICS,
    PURGE_USER_FOLLOWING_TOPICS,
    SAVE_USER_GOING_TO,
    PURGE_USER_GOING_TO,
    SAVE_USER_INVITED_TO,
    PURGE_USER_INVITED_TO,
    SAVE_USER_INTERESTED_IN,
    PURGE_USER_INTERESTED_IN,
    SAVE_USER_PENDING_INCOMING_RELATIONSHIPS,
    PURGE_USER_PENDING_INCOMING_RELATIONSHIPS,
    SAVE_USER_PENDING_OUTGOING_RELATIONSHIPS,
    PURGE_USER_PENDING_OUTGOING_RELATIONSHIPS,
    SAVE_USER_CONTACTS,
    PURGE_USER_CONTACTS,
    SAVE_USER_BLOCKED_USERS,
    PURGE_USER_BLOCKED_USERS
} from '../actions/actionTypes';
import { getURLForPlatform } from '../../components/utils/networkUtils';
import { purgeUserToken } from './token';

export function saveUserObject(user) {
    return {
        type: SAVE_USER_OBJECT,
        user: user
    }
}

export function loadUser(token) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/user/id/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        }).then(response => response.ok && response.json())
            .then(responseObj => {
                dispatch(saveUserObject(responseObj["id"]))
            });
    }
}

export function logout(token) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/rest_auth/logout/", {
            method: 'POST',
            Authorization: 'Token ' + token
        }).then(response => {
            dispatch(purgeUserObject());
            dispatch(purgeUserToken());
            dispatch(purgeUserDetails());
            dispatch(purgeCreatedEvents());
            dispatch(purgeFollowingTopics());
            dispatch(purgeGoingTo());
            dispatch(purgeInvited());
            dispatch(purgeInterested());
            dispatch(purgeOutgoingRequests());
            dispatch(purgeIncomingRequests());
            dispatch(purgeContacts());
            dispatch(purgeBlockedUsers());
        });
    }
}

export function purgeUserObject() {
    return {
        type: PURGE_USER_OBJECT
    }
}

export function saveUserFilter(filter) {
    return {
        type: SAVE_USER_FILTER,
        filter: filter
    }
}

export function purgeUserFilter() {
    return {
        type: PURGE_USER_FILTER
    }
}

export function saveUserDetails(details) {
    return {
        type: SAVE_USER_DETAILS,
        details: details
    }
}

export function purgeUserDetails() {
    return {
        type: PURGE_USER_DETAILS
    }
}

export function loadUserDetails(token, userID) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/user/" + userID + "/details/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        }).then(response => response.ok && response.json())
            .then(responseObj => {
                dispatch(saveUserDetails(responseObj["user"]))
            });
    }
}

export function saveCreatedEvents(createdEvents) {
    return {
        type: SAVE_USER_CREATED_EVENTS,
        createdEvents: createdEvents
    }
}

export function purgeCreatedEvents() {
    return {
        type: PURGE_USER_CREATED_EVENTS
    }
}

export function loadCreatedEvents(token, userID) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/user/" + userID + "/created/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        }).then(response => response.ok && response.json())
            .then(responseObj => {
                dispatch(saveCreatedEvents(responseObj["events"]))
            });
    }
}

export function saveFollowingTopics(followingTopics) {
    return {
        type: SAVE_USER_FOLLOWING_TOPICS,
        followingTopics: followingTopics
    }
}

export function purgeFollowingTopics() {
    return {
        type: PURGE_USER_FOLLOWING_TOPICS
    }
}

export function loadFollowingTopics(token, userID) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/user/" + userID + "/following/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        }).then(response => response.ok && response.json())
            .then(responseObj => {
                dispatch(saveFollowingTopics(responseObj["topics"]))
            });
    }
}

export function saveGoingTo(goingToEvents) {
    return {
        type: SAVE_USER_GOING_TO,
        goingToEvents: goingToEvents
    }
}

export function purgeGoingTo() {
    return {
        type: PURGE_USER_GOING_TO
    }
}

export function loadGoingTo(token, userID) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/user/" + userID + "/going/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        }).then(response => response.ok && response.json())
            .then(responseObj => {
                dispatch(saveGoingTo(responseObj["events"]))
            });
    }
}

export function saveInvited(invitedToEvents) {
    return {
        type: SAVE_USER_INVITED_TO,
        invitedToEvents: invitedToEvents
    }
}

export function purgeInvited() {
    return {
        type: PURGE_USER_INVITED_TO
    }
}

export function loadInvited(token, userID) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/user/" + userID + "/invited/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        }).then(response => response.ok && response.json())
            .then(responseObj => {
                dispatch(saveInvited(responseObj["events"]))
            });
    }
}

export function saveInterested(interestedInEvents) {
    return {
        type: SAVE_USER_INTERESTED_IN,
        interestedInEvents: interestedInEvents
    }
}

export function purgeInterested() {
    return {
        type: PURGE_USER_INTERESTED_IN
    }
}

export function loadInterested(token, userID) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/user/" + userID + "/interested/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        }).then(response => response.ok && response.json())
            .then(responseObj => {
                dispatch(saveInterested(responseObj["events"]))
            });
    }
}

export function saveOutgoingRequests(pendingOutgoingRelationships) {
    return {
        type: SAVE_USER_PENDING_OUTGOING_RELATIONSHIPS,
        pendingOutgoingRelationships: pendingOutgoingRelationships
    }
}

export function purgeOutgoingRequests() {
    return {
        type: PURGE_USER_PENDING_OUTGOING_RELATIONSHIPS
    }
}

export function loadOutgoingRequests(token, userID) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/user/" + userID + "/pendingRequests/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        }).then(response => response.ok && response.json())
            .then(responseObj => {
                dispatch(saveOutgoingRequests(responseObj["outgoing"]))
            });
    }
}

export function saveIncomingRequests(pendingIncomingRelationships) {
    return {
        type: SAVE_USER_PENDING_INCOMING_RELATIONSHIPS,
        pendingIncomingRelationships: pendingIncomingRelationships
    }
}

export function purgeIncomingRequests() {
    return {
        type: PURGE_USER_PENDING_INCOMING_RELATIONSHIPS
    }
}

export function loadIncomingRequests(token, userID) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/user/" + userID + "/pendingRequests/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        }).then(response => response.ok && response.json())
            .then(responseObj => {
                dispatch(saveIncomingRequests(responseObj["incoming"]))
            });
    }
}

export function saveContacts(contacts) {
    return {
        type: SAVE_USER_CONTACTS,
        contacts: contacts
    }
}

export function purgeContacts() {
    return {
        type: PURGE_USER_CONTACTS
    }
}

export function loadContacts(token, userID) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/user/" + userID + "/contacts/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        }).then(response => response.ok && response.json())
            .then(responseObj => {
                dispatch(saveContacts(responseObj["users"]))
            });
    }
}

export function saveBlockedUsers(blockedUsers) {
    return {
        type: SAVE_USER_BLOCKED_USERS,
        blockedUsers: blockedUsers
    }
}

export function purgeBlockedUsers() {
    return {
        type: PURGE_USER_BLOCKED_USERS
    }
}

export function loadBlocked(token, userID) {
    return function action(dispatch) {
        return fetch(getURLForPlatform() + "api/v1/user/" + userID + "/blocked/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        }).then(response => response.ok && response.json())
            .then(responseObj => {
                dispatch(saveBlockedUsers(responseObj["users"]))
            });
    }
}