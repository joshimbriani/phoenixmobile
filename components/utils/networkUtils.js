import {Platform} from 'react-native';

export function getURLForPlatform() {
    // ToDo: Check out this blog post for defining URLs for different configurations:
    // https://zeemee.engineering/how-to-set-up-multiple-schemes-configurations-in-xcode-for-your-react-native-ios-app-7da4b5237966
    //return 'https://api.kootasocial.com/'
    return Platform.OS === 'ios' ? 'http://192.168.86.22:8000/' : 'http://192.168.86.22:8000/'; 
    return "http://35.186.252.41/"   
}