import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class PlatformIonicon extends React.Component {
    render() {
        const name = this.props["name"];
        delete this.props["name"];
        return this.ioniconForPlatform(Platform.OS, name);
    }

    ioniconForPlatform(platform, name) {
        if (platform === "ios") {
            return (
                <Ionicons
                    {...this.props}
                    name={this.nameForPlatform("ios", name)}
                />
            );
        } else if (platform === "android") {
            return (
                <Ionicons
                    {...this.props}
                    name={this.nameForPlatform("md", name)}
                />
            );
        }
        
    }

    nameForPlatform(platform, name) {
        return platform + "-" + name;
    }
}

PlatformIonicon.propTypes = {
    name: PropTypes.string,
}