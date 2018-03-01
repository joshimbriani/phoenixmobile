import { SAVE_CURRENT_EVENT, PURGE_CURRENT_EVENT, SAVE_CURRENT_EVENT_MESSAGES,PURGE_CURRENT_EVENT_MESSAGES } from '../actions/actionTypes';

const defaultState = { selectedEvent: {}, selectedEventMessages: [] };

export default function eventReducer(state = defaultState, action) {
    switch (action.type) {
        case SAVE_CURRENT_EVENT:
            return Object.assign({}, state, {
                selectedEvent: action.event
            })
        case PURGE_CURRENT_EVENT:
            return Object.assign({}, state, {
                selectedEvent: {}
            })
        case SAVE_CURRENT_EVENT_MESSAGES:
            return Object.assign({}, state, {
                selectedEventMessages: action.messages
            })
        case PURGE_CURRENT_EVENT_MESSAGES:
            return Object.assign({}, state, {
                selectedEventMessages: []
            }) 
        default:
            return state
    }
}