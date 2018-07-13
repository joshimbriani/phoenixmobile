import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';
import { Dimensions, Image, Text, View } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

const testUserArr = [{name: "Test User 1", profilePicture: "https://www.placecage.com/200/200"},
                    {name: "Test User 2", profilePicture: "https://www.placecage.com/200/200"},
                    {name: "Test User 3", profilePicture: "https://www.placecage.com/200/200"},
                    ]
// TODO: Replace test array stuff with actual user profile picture
// TODO: Fix going view
// TODO: Add Tooltips to images
// TODO: Add text to progress bar

                    class EventDetailPeople extends React.Component {
    render() {
        if (Object.keys(this.props.event).length > 0) {
            return (
                <View style={styles.flex1} >
                    <View style={styles.eventDetailPeopleSection}>
                        <Text style={styles.eventDetailSectionHeader}>Created By</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 5}}>
                            <Image
                                style={{ width: 50, height: 50, borderRadius:30, borderWidth: 1, borderColor: '#fff' }}
                                source={{ uri: 'https://www.placecage.com/200/200' }}
                            />
                            <Text style={{paddingLeft: 20}}>{this.props.event.userBy}</Text>
                        </View>
                    </View>
                    <View style={[styles.eventDetailPeopleSection, { flex: 3, justifyContent: 'space-between' }]}>
                        <Text style={styles.eventDetailSectionHeader}>Going</Text>
                        <View style={{flexDirection: 'row'}}>
                            {testUserArr.map((user, index) => {
                                return (
                                    <Image 
                                        key={index}
                                        style={{ margin: 5, width: 50, height: 50, borderRadius:30, borderWidth: 1, borderColor: '#fff' }}
                                        source={{ uri: user.profilePicture }}
                                    />
                                )
                            })}
                        </View>
                        <ProgressBar style={{alignSelf: 'flex-end'}} progress={this.props.event.going && this.props.event.capacity && (this.props.event.going.length / this.props.event.capacity)} width={Dimensions.get('window').width - 30} />
                    </View>
                    <View style={[styles.eventDetailPeopleSection, { flex: 3 }]}>
                        <Text style={styles.eventDetailSectionHeader}>Interested</Text>
                        <View style={{flexDirection: 'row'}}>
                            {testUserArr.map((user, index) => {
                                return (
                                    <Image 
                                        key={index}
                                        style={{ margin: 5, width: 50, height: 50, borderRadius:30, borderWidth: 1, borderColor: '#fff' }}
                                        source={{ uri: user.profilePicture }}
                                    />
                                )
                            })}
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

EventDetailPeople.propTypes = {
    color: PropTypes.string,
    event: PropTypes.object
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
)(EventDetailPeople);