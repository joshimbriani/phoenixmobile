import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { DrawerItems } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const SideDrawer = (props) => (
    <View style={{ elevation: 10 }}>
        <View style={{ height: 200, backgroundColor: '#6ABFA0' }}>
            <View style={{ marginTop: 50, alignItems: 'center' }}>
                <Ionicons
                    name="md-contact"
                    size={100}
                    style={{ color: "white" }}
                />
                <Text style={{ fontSize: 30, color: '#fff' }}>
                    Josh Imbriani
                </Text>
            </View>
        </View>
        <DrawerItems {...props} />
    </View>
);
