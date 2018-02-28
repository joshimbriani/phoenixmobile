import { SAVE_CURRENT_EVENT, PURGE_CURRENT_EVENT } from '../actions/actionTypes';

const defaultState = { selectedEvent: {} };

export default function eventReducer(state = defaultState, action) {
    switch (action.type) {
        case SAVE_CURRENT_EVENT:
            return Object.assign({}, state, {
                selectedEvent: action.event
            })
        case  PURGE_CURRENT_EVENT:
            return defaultState
        default:
            return state
    }
}