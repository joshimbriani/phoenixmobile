import { SAVE_USER_OBJECT, PURGE_USER_OBJECT, SAVE_USER_FILTER, PURGE_USER_FILTER } from '../actions/actionTypes';

const defaultState = { user: {}, filter: {
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
} };

export default function userReducer(state = defaultState, action) {
    switch (action.type) {
        case SAVE_USER_OBJECT:
            return Object.assign({}, state, {
                user: action.user
            })
        case PURGE_USER_OBJECT:
            return Object.assign({}, state, {
                user: {}
            })
        case SAVE_USER_FILTER:
            return Object.assign({}, state, {
                filter: action.filter
            })
        case PURGE_USER_FILTER:
            return Object.assign({}, state, {
                filter: {}
            })
        default:
            return state
    }
}