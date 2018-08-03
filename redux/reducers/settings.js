import { SAVE_DISTANCE_MEASURE, SAVE_NOTIFICATION_SETTINGS, PURGE_NOTIFICATION_SETTINGS } from '../actions/actionTypes';

const defaultState = { 
    distanceMeasure: 'mi', 
    notifications: {
        notificationUserActions: true, 
        notificationRecommendedEvents: true, 
        notificationRecommendedEventsFrequency: true,
        notificationMessages: true,
        notificationInterestedEvents: true,
        notificationGoingEvents: true,
        notificationInvitedEvents: false
    }
};

export default function settingsReducer(state = defaultState, action) {
    switch (action.type) {
        case SAVE_DISTANCE_MEASURE:
            return Object.assign({}, state, {
                distanceMeasure: action.measure
            })
        case SAVE_NOTIFICATION_SETTINGS:
            return Object.assign({}, state, {
                notifications: action.settings
            })
        case PURGE_NOTIFICATION_SETTINGS:
            return Object.assign({}, state, {
                notifications: defaultState.notifications
            })
        default:
            console.log(state)
            return state
    }
}