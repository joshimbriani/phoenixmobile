import React from 'react';
import { View, Text, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { styles } from '../../assets/styles';

class LegalSettings extends React.Component {

    render() {
        return (
            <ScrollView style={{ padding: 10 }}>
                <View style={{padding: 10}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold', color: 'black'}}>Third Party Libraries</Text>
                </View>
                <View>
                    <Text>Koota uses the following open source code libraries and classes. They deserve credit for their excellent work.</Text>
                </View>
                {thirdPartyLibs.map((item, index) => {
                    return (
                        <View key={index} style={{paddingTop: 30}}>
                            <View>
                                <Text>{item.name}</Text>
                            </View>
                            <View>
                                <Text style={{ color: 'blue' }}
                                    onPress={() => Linking.openURL(item.link)}>
                                    {item.link}
                                </Text>
                            </View>
                            <View>
                                <Text>
                                    <Text>License:</Text>{' '}
                                    <Text style={{ color: 'blue' }}
                                        onPress={() => Linking.openURL(licenseFrom)}>
                                        {item.license}
                                    </Text>
                                </Text>
                            </View>

                        </View>
                    )
                })}
                <View style={{paddingBottom: 20}}></View>
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LegalSettings);

function licenseURLFromName(license) {
    if (license === 'MIT') {
        return "https://opensource.org/licenses/MIT"
    }

    if (license === 'BSD 3') {
        return "https://opensource.org/licenses/BSD-3-Clause"
    }

    if (license === 'Apache') {
        return "https://opensource.org/licenses/Apache-2.0"
    }

    if (license === 'ISC') {
        return "https://opensource.org/licenses/ISC"
    }

    if (license === 'BSD') {
        return "https://opensource.org/licenses/BSD-2-Clause"
    }

    return
}

const thirdPartyLibs = [{
    "name": "buffer",
    "link": "https://github.com/feross/buffer",
    "license": "MIT"
}, {
    "name": "color-scheme",
    "link": "https://github.com/c0bra/color-scheme-js",
    "license": "MIT"
}, {
    "name": "crypto-js",
    "link": "https://github.com/brix/crypto-js",
    "license": "MIT"
}, {
    "name": "lodash",
    "link": "https://github.com/lodash/lodash",
    "license": "MIT"
}, {
    "name": "moment",
    "link": "https://github.com/moment/moment",
    "license": "MIT"
}, {
    "name": "parse-google-place",
    "link": "https://github.com/ajoslin/parse-google-place",
    "license": "MIT"
}, {
    "name": "random-material-color",
    "link": "https://github.com/isuru88/random-material-color",
    "license": "MIT"
}, {
    "name": "react",
    "link": "https://github.com/facebook/react",
    "license": "MIT"
}, {
    "name": "react-native",
    "link": "https://github.com/facebook/react-native",
    "license": "MIT"
}, {
    "name": "react-native-cached-image",
    "link": "https://github.com/kfiroo/react-native-cached-image",
    "license": "MIT"
}, {
    "name": "react-native-check-box",
    "link": "https://github.com/crazycodeboy/react-native-check-box",
    "license": "MIT"
}, {
    "name": "react-native-collapsible",
    "link": "https://github.com/oblador/react-native-collapsible",
    "license": "MIT"
}, {
    "name": "react-native-drawer",
    "link": "https://github.com/root-two/react-native-drawer",
    "license": "MIT"
}, {
    "name": "react-native-gesture-handler",
    "link": "https://github.com/kmagiera/react-native-gesture-handler",
    "license": "MIT"
}, {
    "name": "react-native-google-places",
    "link": "https://github.com/tolu360/react-native-google-places",
    "license": "MIT"
}, {
    "name": "react-native-image-picker",
    "link": "https://github.com/react-community/react-native-image-picker",
    "license": "MIT"
}, {
    "name": "react-native-keyboard-aware-scroll-view",
    "link": "https://github.com/APSL/react-native-keyboard-aware-scroll-view",
    "license": "MIT"
}, {
    "name": "react-native-maps",
    "link": "https://github.com/react-community/react-native-maps",
    "license": "MIT"
}, {
    "name": "react-native-modal",
    "link": "https://github.com/react-native-community/react-native-modal",
    "license": "MIT"
}, {
    "name": "react-native-modal-datetime-picker",
    "link": "https://github.com/mmazzarolo/react-native-modal-datetime-picker",
    "license": "MIT"
}, {
    "name": "react-native-progress",
    "link": "https://github.com/oblador/react-native-progress",
    "license": "MIT"
}, {
    "name": "react-native-settings-list",
    "link": "https://github.com/evetstech/react-native-settings-list",
    "license": "MIT"
}, {
    "name": "react-native-super-grid",
    "link": "https://github.com/saleel/react-native-super-grid",
    "license": "MIT"
}, {
    "name": "react-native-swiper",
    "link": "https://github.com/leecade/react-native-swiper",
    "license": "MIT"
}, {
    "name": "react-native-tab-view",
    "link": "https://github.com/react-native-community/react-native-tab-view",
    "license": "MIT"
}, {
    "name": "react-native-vector-icons",
    "link": "https://github.com/oblador/react-native-vector-icons",
    "license": "MIT"
}, {
    "name": "react-native-backhandler",
    "link": "https://github.com/vonovak/react-navigation-backhandler",
    "license": "MIT"
}, {
    "name": "react-redux",
    "link": "https://github.com/reduxjs/react-redux",
    "license": "MIT"
}, {
    "name": "redux",
    "link": "https://github.com/reduxjs/redux",
    "license": "MIT"
}, {
    "name": "redux-persist",
    "link": "https://github.com/rt2zz/redux-persist",
    "license": "MIT"
}, {
    "name": "redux-thunk",
    "link": "https://github.com/reduxjs/redux-thunk",
    "license": "MIT"
}, {
    "name": "rn-fetch-blob",
    "link": "https://github.com/joltup/rn-fetch-blob",
    "license": "MIT"
}, {
    "name": "js-base64",
    "link": "https://github.com/dankogai/js-base64",
    "license": "BSD 3"
}, {
    "name": "native-base",
    "link": "https://github.com/GeekyAnts/NativeBase",
    "license": "Apache"
}, {
    "name": "react-native-popup-menu",
    "link": "https://github.com/instea/react-native-popup-menu",
    "license": "ISC"
}, {
    "name": "react-navigation",
    "link": "https://github.com/react-navigation/react-navigation",
    "license": "BSD"
}]