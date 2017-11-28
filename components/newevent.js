import React from 'react';
import { Container, Content, Form, Header, Item, Input, Icon, Label, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../redux/actions/backgroundColor'
import ColorScheme from 'color-scheme';

class NewEvent extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'New Event',
        headerLeft: <Ionicons
            name='md-close'
            style={{ paddingLeft: 10 }}
            size={35}
            onPress={() => navigation.goBack()} />
    });

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
        }
    }

    render() {
        return (
            <Swiper style={styles.wrapper} showsButtons={true}>
                <View styles={styles.slide}>
                    <View style={[styles.header, {backgroundColor: "red"}]}>
                            <Text style={styles.h1}>What?</Text>
                            <Text style={styles.h2}>Give us a short and a longer description of what you want to do!</Text>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>Title</Label>
                            <Input />
                        </Item>
                        <Item stackedLabel last>
                            <Label>Full Description</Label>
                            <Input style={{
                                width: 200, height: 200
                            }} multiline={true} />
                        </Item>
                    </Form>
                </View>
                <View styles={styles.slide}>
                    <View style={[styles.header, {backgroundColor: "red"}]}>
                            <Text style={styles.h1}>Standing Offers?</Text>
                            <Text style={styles.h2}>Any of these standing offers from businesses apply? You could save money if you choose one!</Text>
                    </View>
                    <View>
                            Sub List for standing offers
                    </View>
                </View>
                <View styles={styles.slide}>
                    <View style={[styles.header, {backgroundColor: "red"}]}>
                            <Text style={styles.h1}>Where?</Text>
                            <Text style={styles.h2}>Where is your event at?</Text>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>Place</Label>
                            <Input />
                        </Item>
                    </Form>
                </View>
                <View styles={styles.slide}>
                    <View style={[styles.header, {backgroundColor: "red"}]}>
                            <Text style={styles.h1}>When?</Text>
                            <Text style={styles.h2}>When do you wanna have your event?</Text>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>Time</Label>
                            <Input />
                        </Item>
                    </Form>
                </View>
                <View styles={styles.slide}>
                    <View style={[styles.header, {backgroundColor: "red"}]}>
                            <Text style={styles.h1}>Who?</Text>
                            <Text style={styles.h2}>How many people are you looking to do your event with?</Text>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>Amount of People</Label>
                            <Input />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Restrict to the same gender?</Label>
                            <Input style={{
                                width: 200, height: 200
                            }} multiline={true} />
                        </Item>
                    </Form>
                </View>
            </Swiper>
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
)(NewEvent);

const styles = StyleSheet.create({
    listitem: {
        alignSelf: 'stretch',
        height: 200,
    },
    itemText: {
        color: 'white',
        fontSize: 40,
        paddingTop: 5,
        textAlign: 'center',
        fontFamily: 'Roboto_medium'
    }

});
