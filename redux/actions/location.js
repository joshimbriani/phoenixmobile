import { ADD_USER_LOCATION, REMOVE_USER_LOCATION, PURGE_USER_LOCATION, SET_SELECTED_LOCATION, RESET_SELECTED_LOCATION } from './actionTypes';

export function addUserLocation(location) {
    return {
        type: ADD_USER_LOCATION,
        location: location
    }
}

export function removeUserLocation(locationID) {
    return {
        type: REMOVE_USER_LOCATION,
        locationID: locationID
    }
}

export function purgeUserLocations() {
    return {
        type: PURGE_USER_LOCATION
    }
}

export function setSelectedLocation(location) {
    return {
        type: SET_SELECTED_LOCATION,
        location: location
    }
}

export function resetSelectedLocation() {
    return {
        type: RESET_SELECTED_LOCATION
    }
}