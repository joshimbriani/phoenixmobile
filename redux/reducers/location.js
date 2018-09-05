import { ADD_USER_LOCATION, REMOVE_USER_LOCATION, PURGE_USER_LOCATION, SET_SELECTED_LOCATION, RESET_SELECTED_LOCATION } from '../actions/actionTypes';

const defaultState = { 
    locations: [{id: -1, name: 'Current Location'}],
    selected: -1
};

export default function locationsReducer(state = defaultState, action) {
    switch (action.type) {
        case ADD_USER_LOCATION:
            return Object.assign({}, state, {
                locations: [...state.locations, action.location]
            })
        case REMOVE_USER_LOCATION:
            var index = state.locations.map((location) => location.id).indexOf(action.locationIndex);
            return Object.assign({}, state, {
                locations: [
                    ...state.locations.slice(0, index),
                    ...state.locations.slice(index + 1)
                ]
            })
        case PURGE_USER_LOCATION:
            return Object.assign({}, state, {
                locations: defaultState.locations
            })
        case SET_SELECTED_LOCATION:
            return Object.assign({}, state, {
                selected: action.location
            })
        case RESET_SELECTED_LOCATION:
            return Object.assign({}, state, {
                selected: defaultState.selected
            })
        default:
            return state
    }
}