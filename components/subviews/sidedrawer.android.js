import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { DrawerItems } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CachedImage } from 'react-native-cached-image';

class SideDrawer extends React.Component {
    render() {
        return (
            <ScrollView style={{ elevation: 10 }}>
                <View style={{ height: 200, backgroundColor: '#6ABFA0' }}>
                    <View style={{ marginTop: 50, alignItems: 'center' }}>
                        <CachedImage
                            style={{ width: 75, height: 75, borderRadius: 38 }}
                            source={{ uri: this.props.details.profilePicture }}
                            ttl={60 * 60 * 24 * 3}
                            fallbackSource={require('../../assets/images/KootaK.png')}
                        />
                        <Text style={{ fontSize: 30, color: '#fff' }}>
                            {this.props.details.username}
                        </Text>
                    </View>
                </View>
                <DrawerItems {...this.props} />
            </ScrollView>
        )
    }
}

function mapStateToProps(state) {
    return {
        details: state.userReducer.details,
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SideDrawer);
