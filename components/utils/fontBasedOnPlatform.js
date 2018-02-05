import { Platform } from 'react-native';

export default function fontBasedOnPlatform() {
    if (Platform.OS === "ios") {
        return 'System';
    } else {
        return 'Roboto';
    }
}