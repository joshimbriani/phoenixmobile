import { SAVE_ACHIEVEMENTS, PURGE_ACHIEVEMENTS } from './actionTypes';

import { getURLForPlatform } from '../../components/utils/networkUtils';

export function saveAchievements(achievements) {
    return {
        type: SAVE_ACHIEVEMENTS,
        achievements: achievements
    }
}

export function purgeAchievements() {
    return {
        type: PURGE_ACHIEVEMENTS
    }
}

export function fetchAchievements(token) {
    return function action(dispatch) {
        return fetch(getURLForPlatform("phoenix") + "api/v1/achievements/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            Authorization: 'Token ' + token
        }).then(response => response.json())
            .then(responseObj => dispatch(saveAchievements(responseObj)));
    }
}
