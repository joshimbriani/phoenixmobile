import {CHANGE_COLOR, RESET_COLOR } from '../actions/actionTypes';

const defaultState = { color: "ffffff" };

export default function backgroundColorReducer(state = defaultState, action) {
    switch (action.type) {
        case CHANGE_COLOR:
            return Object.assign({}, state, {
                color: action.color
            })
        case  RESET_COLOR:
            return defaultState
        default:
            return state
    }
}