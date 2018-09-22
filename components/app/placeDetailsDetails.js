import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, FlatList, View, TouchableOpacity } from 'react-native';

import { getDayOfWeekFromDayNumber, getMonthNameFromMonthNumber } from '../utils/datetimeUtils';
import { getComplementaryColor } from '../utils/styleutils';
import { styles } from '../../assets/styles';
import { OfferContainer } from './offerContainer';
import moment from 'moment';
import PlatformIonicon from '../utils/platformIonicon';
import { CachedImage } from 'react-native-cached-image';
import Dialog from "react-native-dialog";

class PlaceDetailsDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAchievementDetails: false,
            selectedAchievement: {
                title: "",
                ruledesc: ""
            }
        }
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => this.setState({selectedAchievement: item, showAchievementDetails: true})}>
            <View key={index} style={{ alignItems: 'center', padding: 10, margin: 5 }}>
                <CachedImage
                    key={index}
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: (item.icon || 'http://via.placeholder.com/200x200') }}
                    ttl={60 * 60 * 24 * 3}
                    fallbackSource={require('../../assets/images/KootaK.png')}
                />
                <Text>{item.title}</Text>
            </View>
        </TouchableOpacity>
    )

    render() {
        if (Object.keys(this.props.place).length > 0) {
            return (
                <View style={styles.flex1} >
                <Dialog.Container visible={this.state.showAchievementDetails} style={{ padding: 20 }}>
                    <Dialog.Title>Achievement Details - {this.state.selectedAchievement.title}</Dialog.Title>
                    <ScrollView style={{height: 300}}>
                        <Dialog.Description>
                            {this.state.selectedAchievement.ruledesc}
                        </Dialog.Description>
                    </ScrollView>
                    <Dialog.Button label="Got it!" onPress={() => this.setState({ selectedAchievement: {title: "", ruledesc: ""}, showAchievementDetails: false })} />
                </Dialog.Container>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.eventDetailHeader}>
                            <View>
                                <Text style={styles.eventDetailHeading}>{this.props.place.name}</Text>
                            </View>
                            {this.props.place.description.length > 0 && <View>
                                <Text style={styles.eventDetailSubHeading}>{this.props.place.description}</Text>
                            </View>}
                        </View>
                        {this.props.place.hoursOpenMon && <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>Hours</Text>
                            <View>
                                <Text>Sunday: {this.props.place.hoursOpenSun} - {this.props.place.hoursCloseSun}</Text>
                                <Text>Monday: {this.props.place.hoursOpenMon} - {this.props.place.hoursCloseMon}</Text>
                                <Text>Tuesday: {this.props.place.hoursOpenTue} - {this.props.place.hoursCloseTue}</Text>
                                <Text>Wednesday: {this.props.place.hoursOpenWed} - {this.props.place.hoursCloseWed}</Text>
                                <Text>Thursday: {this.props.place.hoursOpenThu} - {this.props.place.hoursCloseThu}</Text>
                                <Text>Friday: {this.props.place.hoursOpenFri} - {this.props.place.hoursCloseFri}</Text>
                                <Text>Saturday: {this.props.place.hoursOpenSat} - {this.props.place.hoursCloseSat}</Text>
                            </View>
                        </View>}
                        {this.props.achievements.length > 0 && <View style={{ marginTop: 10, marginLeft: 5 }}>
                            <Text style={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>Achievements</Text>
                            <FlatList
                                contentContainerStyle={{ justifyContent: 'center', flexDirection: 'row' }}
                                extraData={this.state}
                                numColumns={2}
                                keyExtractor={this._keyExtractor}
                                horizontal={false}
                                data={this.props.achievements}
                                renderItem={this._renderItem}
                                listKey={(item, index) => 'E' + index.toString()}
                            />
                        </View>}
                    </ScrollView>
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

PlaceDetailsDetails.propTypes = {
    place: PropTypes.object
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
)(PlaceDetailsDetails);