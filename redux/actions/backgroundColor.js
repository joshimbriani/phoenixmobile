import { CHANGE_COLOR, RESET_COLOR } from './actionTypes';

export function changeColor(color) {
    return {
        type: CHANGE_COLOR,
        color: color
    }
}

export function resetColor() {
    return {
        type: RESET_COLOR
    }
}