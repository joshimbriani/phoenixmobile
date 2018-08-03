import { SAVE_DISTANCE_MEASURE } from '../actions/actionTypes';

const defaultState = { distanceMeasure: 'mi' };

export default function settingsReducer(state = defaultState, action) {
    switch (action.type) {
        case SAVE_DISTANCE_MEASURE:
            return Object.assign({}, state, {
                distanceMeasure: action.measure
            })
        default:
            return state
    }
}