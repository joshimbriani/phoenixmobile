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

const defaultState = {
    user: -1,
    details: {},
    createdEvents: [],
    followingTopics: [],
    goingToEvents: [],
    invitedToEvents: [],
    interestedInEvents: [],
    pendingOutgoingRelationships: [],
    pendingIncomingRelationships: [],
    contacts: [],
    blockedUsers: [],
    filter: {
        datetime: {
            start: -1,
            end: -1
        },
        duration: {
            moreThan: 0,
            lessThan: 300
        },
        capacity: 1,
        topics: {
            type: 'all',
            topics: []
        },
        privacy: 'all',
        offer: 'all',
        restrictToGender: 'all'
    }
};

export default function userReducer(state = defaultState, action) {
    switch (action.type) {
        case SAVE_USER_OBJECT:
            return Object.assign({}, state, {
                user: action.user
            })
        case PURGE_USER_OBJECT:
            return Object.assign({}, state, {
                user: defaultState.user
            })
        case SAVE_USER_FILTER:
            return Object.assign({}, state, {
                filter: action.filter
            })
        case PURGE_USER_FILTER:
            return Object.assign({}, state, {
                filter: defaultState.filter
            })
        case SAVE_USER_DETAILS:
            return Object.assign({}, state, {
                details: action.details
            })
        case PURGE_USER_DETAILS:
            return Object.assign({}, state, {
                details: defaultState.details
            })
        case SAVE_USER_CREATED_EVENTS:
            return Object.assign({}, state, {
                createdEvents: action.createdEvents
            })
        case PURGE_USER_CREATED_EVENTS:
            return Object.assign({}, state, {
                createdEvents: defaultState.createdEvents
            })
        case SAVE_USER_FOLLOWING_TOPICS:
            return Object.assign({}, state, {
                followingTopics: action.followingTopics
            })
        case PURGE_USER_FOLLOWING_TOPICS:
            return Object.assign({}, state, {
                followingTopics: defaultState.followingTopics
            })
        case SAVE_USER_GOING_TO:
            return Object.assign({}, state, {
                goingToEvents: action.goingToEvents
            })
        case PURGE_USER_GOING_TO:
            return Object.assign({}, state, {
                goingToEvents: defaultState.goingToEvents
            })
        case SAVE_USER_INVITED_TO:
            return Object.assign({}, state, {
                invitedToEvents: action.invitedToEvents
            })
        case PURGE_USER_INVITED_TO:
            return Object.assign({}, state, {
                invitedToEvents: defaultState.invitedToEvents
            })
        case SAVE_USER_INTERESTED_IN:
            return Object.assign({}, state, {
                interestedInEvents: action.interestedInEvents
            })
        case PURGE_USER_INTERESTED_IN:
            return Object.assign({}, state, {
                interestedInEvents: defaultState.interestedInEvents
            })
        case SAVE_USER_PENDING_INCOMING_RELATIONSHIPS:
            return Object.assign({}, state, {
                pendingIncomingRelationships: action.pendingIncomingRelationships
            })
        case PURGE_USER_PENDING_INCOMING_RELATIONSHIPS:
            return Object.assign({}, state, {
                pendingOutgoingRelationships: defaultState.pendingIncomingRelationships
            })
        case SAVE_USER_PENDING_OUTGOING_RELATIONSHIPS:
            return Object.assign({}, state, {
                pendingOutgoingRelationships: action.pendingOutgoingRelationships
            })
        case PURGE_USER_PENDING_OUTGOING_RELATIONSHIPS:
            return Object.assign({}, state, {
                pendingIncomingRelationships: defaultState.pendingOutgoingRelationships
            })
        case SAVE_USER_CONTACTS:
            return Object.assign({}, state, {
                contacts: action.contacts
            })
        case PURGE_USER_CONTACTS:
            return Object.assign({}, state, {
                contacts: defaultState.contacts
            })
        case SAVE_USER_BLOCKED_USERS:
            return Object.assign({}, state, {
                blockedUsers: action.blockedUsers
            })
        case PURGE_USER_BLOCKED_USERS:
            return Object.assign({}, state, {
                blockedUsers: defaultState.blockedUsers
            })
        default:
            return state
    }
}