import { SAVE_DISTANCE_MEASURE  } from './actionTypes';

export function saveDistanceMeasure(measure) {
    return {
        type: SAVE_DISTANCE_MEASURE,
        measure
    }
}