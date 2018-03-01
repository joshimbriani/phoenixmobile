import { SAVE_CURRENT_EVENT, PURGE_CURRENT_EVENT, SAVE_CURRENT_EVENT_MESSAGES, PURGE_CURRENT_EVENT_MESSAGES } from './actionTypes';

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

export function saveCurrentEventMessages(messages) {
    return {
        type: SAVE_CURRENT_EVENT_MESSAGES,
        messages: messages
    }
}

export function purgeCurrentEventMessages() {
    return {
        type: PURGE_CURRENT_EVENT_MESSAGES
    }
}