import { SAVE_DISTANCE_MEASURE, SAVE_NOTIFICATION_SETTINGS, PURGE_NOTIFICATION_SETTINGS } from './actionTypes';

export function saveDistanceMeasure(measure) {
    return {
        type: SAVE_DISTANCE_MEASURE,
        measure
    }
}

export function saveNotificationSettings(settings) {
    return {
        type: SAVE_NOTIFICATION_SETTINGS,
        settings
    }
}

export function purgeNotificationSettings() {
    return {
        type: PURGE_NOTIFICATION_SETTINGS
    }
}