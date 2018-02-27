import { SAVE_CURRENT_EVENT, PURGE_CURRENT_EVENT } from './actionTypes';

export function saveCurrentEvent(event) {
    return {
        type: SAVE_CURRENT_EVENT,
        event: event
    }
}

export function purgeCurrentEvent() {
    return {
        type: PURGE_CURRENT_EVENT
    }
}