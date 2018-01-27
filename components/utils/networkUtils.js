import {Platform} from 'react-native';

export function getURLForPlatform() {
    return Platform.OS === 'ios' ? 'http://127.0.0.1:8000/' : 'http://10.0.2.2:8000/';
}