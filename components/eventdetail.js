import React from 'react';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, StatusBar, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../redux/actions/backgroundColor'
import PlatformIonicon from './utils/platformIonicon';
import ColorScheme from 'color-scheme';

class EventDetail extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.event,
        headerStyle: { backgroundColor: navigation.state.params.color },
    });

    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        fetch("http://10.0.2.2:8000/api/v1/events/" + this.props.navigation.state.params.id + "?format=json").then(response => response.json())
            .then(responseObj => {
                this.setState({ data: responseObj });
            })
    }

    render() {
        if (Object.keys(this.state.data).length > 0) {
            const date = new Date(this.state.data.created);
            return (
                <Container>
                    <View>
                        <Text>
                        {this.state.data.title}
                        </Text>
                    </View>
                    <View>
                        <Text>
                            What: {this.state.data.description}
                        </Text>
                        <Text>
                            Who: {this.state.data.going.length} people
                        </Text>
                        <Text>
                            Where: {this.state.data.place}
                        </Text>
                        <Text>
                            When: {date.toDateString()} @ {date.getHours()}:{date.getMinutes()}
                        </Text>
                    </View>
                </Container>
            );
        } else {
            return (
                <Container>
                    <Text>Loading...</Text>
                </Container>
            )
        }
        
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
)(EventDetail);

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
