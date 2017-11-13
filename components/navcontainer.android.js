import React from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

/*export default class NavContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = { events: [] };
    }

    componentDidMount() {
        fetch('http://10.0.2.2:8000/events/?format=json')
            .then((response) => response.json())
            .then((response) => { this.setState({ events: response }) });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>This is Android</Text>
                <FlatList
                    data={this.state.events}
                    renderItem={({ item }) => <Text style={styles.item}>{item.title}</Text>}
                    keyExtractor={(item, index) => index}
                />
            </View>
        );
    }
}*/

const HomeScreen = () => ( 
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
    </View>
);

const ProfileScreen = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Profile Screen</Text>
    </View>
);

const NavContainer = DrawerNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            drawerLabel: 'Home',
            drawerIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-home' : 'ios-home-outline'}
                    size={20}
                    style={{ color: tintColor }}
                />
            ),
        },
    },
    Profile: {
        screen: ProfileScreen,
        navigationOptions: {
            drawerLabel: 'Profile',
            drawerIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-person' : 'ios-person-outline'}
                    size={20}
                    style={{ color: tintColor }}
                />
            ),
        },
    },
});

export default NavContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});
