import { SAVE_ACHIEVEMENTS, PURGE_ACHIEVEMENTS } from '../actions/achievements';

const defaultState = { achivements: [] };

export default function achievementReducer(state = defaultState, action) {
    switch (action.type) {
        case SAVE_ACHIEVEMENTS:
            return Object.assign({}, state, {
                achivements: action.achivements
            })
        case  PURGE_ACHIEVEMENTS:
            return defaultState
        default:
            return state
    }
}