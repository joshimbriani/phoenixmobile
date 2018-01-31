import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { DrawerItems } from 'react-navigation';
import PlatformIonicon from '../utils/platformIonicon';
import * as userActions from '../../redux/actions/user';

class SideDrawer extends React.Component {
    render() {
        return (
            <View style={{ elevation: 10 }}>
                <View style={{ height: 200, backgroundColor: '#6ABFA0' }}>
                    <View style={{ marginTop: 50, alignItems: 'center' }}>
                        <PlatformIonicon
                            name="contact"
                            size={100}
                            style={{ color: "white" }}
                        />
                        <Text style={{ fontSize: 30, color: '#fff' }}>
                            {this.props.user.username}
                        </Text>
                    </View>
                </View>
                <DrawerItems {...this.props} />
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.tokenReducer.token,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SideDrawer);
