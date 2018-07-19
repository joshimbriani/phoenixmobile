import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';
import { Text, View, TextInput } from 'react-native';
import { Content, Form, Item, Input, Label } from 'native-base';
import { ColorPicker } from 'react-native-status-color-picker';

import PlatformIonicon from '../utils/platformIonicon';
import { materialColors } from '../utils/styleutils';
import { getURLForPlatform } from '../utils/networkUtils';
import HideableView from '../utils/hideableView';

class GroupsDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editing: true,
            name: this.props.group.name,
            description: this.props.group.description,
            color: this.props.group.color
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.props.group.name && !prevProps.group.name) || (this.props.group.description && !prevProps.group.description) || (this.props.group.color && !prevProps.group.color)) {
            this.setState({ name: this.props.group.name, description: this.props.group.description, color: this.props.group.color })
        }
    }

    render() {
        if (Object.keys(this.props.group).length > 0) {
            return (
                <View style={styles.flex1} >
                    <View style={{flexDirection: 'row', height: 50}}>
                        <View style={{flex: 1}}>
                            <Text style={{fontWeight: 'bold'}}>Name</Text>
                        </View>
                        <View style={{flex: 3}}>
                            <HideableView hide={!this.props.editing}>
                                <TextInput
                                    value={this.state.name}
                                    name="name"
                                    onChangeText={(text) => { this.setState({ "name": text, "errors": "" }); this.props.setGroupParams(text, this.state.color, this.state.description) }}
                                />
                            </HideableView>
                            <HideableView hide={this.props.editing}>
                                <Text>{this.props.group.name}</Text>
                            </HideableView>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Text style={{fontWeight: 'bold'}}>Color</Text>
                        </View>
                        <View style={{flex: 3}}>
                            <HideableView hide={!this.props.editing}>
                                <ColorPicker
                                    colors={materialColors}
                                    selectedColor={this.state.color}
                                    onSelect={(color) => { this.setState({ color: color }); this.props.setGroupParams(this.state.name, color, this.state.description) }}
                                />
                            </HideableView>
                            <HideableView hide={this.props.editing}>
                                <View style={{ backgroundColor: this.props.color, height: 50, aspectRatio: 1 }}></View>
                            </HideableView>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Text style={{fontWeight: 'bold'}}>Description</Text>
                        </View>
                        <View style={{flex: 3}}>
                            <HideableView hide={!this.props.editing}>
                                <TextInput
                                    name="description"
                                    multiline={true}
                                    value={this.state.description}
                                    numberOfLines={5}
                                    onChangeText={(text) => { this.setState({ "description": text }); this.props.setGroupParams(this.state.name, this.state.color, text) }}
                                />
                            </HideableView>
                            <HideableView hide={this.props.editing}>
                                <HideableView hide={!this.props.group.description.length > 0}>
                                    <Text>{this.props.group.description}</Text>
                                </HideableView>
                                <HideableView hide={!this.props.group.description.length <= 0}>
                                    <Text>This group has no description. Feel free to add one!</Text>
                                </HideableView>
                                <Text></Text>
                            </HideableView>
                        </View>
                    </View>
                    
                </View>
            )
        } else {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }
    }
}

GroupsDetails.propTypes = {
    setGroupParams: PropTypes.func
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GroupsDetails);