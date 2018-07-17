import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../assets/styles';
import { Dimensions, Image, Text, View } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

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
                                source={{ uri: this.props.event.userBy.profilePicture }}
                            />
                            <Text style={{paddingLeft: 20}}>{this.props.event.userBy.username}</Text>
                        </View>
                    </View>
                    <View style={[styles.eventDetailPeopleSection, { flex: 3, justifyContent: 'flex-end' }]}>
                        <Text style={styles.eventDetailSectionHeader}>Going</Text>
                        <View style={{flexDirection: 'row', }}>
                            {this.props.event.going.map((user, index) => {
                                return (
                                    <Image 
                                        key={index}
                                        style={{ margin: 5, width: 50, height: 50, borderRadius:30, borderWidth: 1, borderColor: '#fff' }}
                                        source={{ uri: user.profilePicture }}
                                    />
                                )
                            })}
                        </View>
                        <View>
                            <ProgressBar style={{marginTop: 'auto'}} progress={this.props.event.going && this.props.event.capacity && (this.props.event.going.length / this.props.event.capacity)} width={Dimensions.get('window').width - 30} />
                            <Text>{this.props.event.going.length} out of {this.props.event.capacity} places have been filled.</Text>
                        </View>
                    </View>
                    <View style={[styles.eventDetailPeopleSection, { flex: 3 }]}>
                        <Text style={styles.eventDetailSectionHeader}>Interested</Text>
                        <View style={{flexDirection: 'row'}}>
                            {this.props.event.interested.map((user, index) => {
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