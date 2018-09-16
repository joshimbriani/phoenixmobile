import React from 'react';
import { connect } from 'react-redux';
import { Platform, Text, Dimensions, BackHandler } from 'react-native';
import PlatformIonicon from '../utils/platformIonicon';

import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import OfferDetails from './offerDetailDetails';
import OfferPlace from './offerDetailPlace';

import { styles } from '../../assets/styles';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

class OfferWrapper extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.offer.name,
        headerStyle: { backgroundColor: navigation.state.params.offer.color },
    });

    constructor(props) {
        super(props);

        var routes = [
            { key: 'details', title: 'Offer Details' },
            { key: 'place', title: 'Offer Place'}
        ];

        this.state = {
            index: 0,
            routes: routes
        }

        this.shareOffer = this.shareOffer.bind(this);
    }

    shareOffer(offer) {
        Share.share({
            message: "It's " + this.props.details.username + " and I think you'd really like this offer - " + offer.name + ". Check it out on Koota! https://kootasocial.com/",
            url: 'http://kootasocial.com',
            title: "I think you'd like this event on Koota!"
        }, {
                // Android only:
                dialogTitle: 'Share this awesome event!',
            })

    }

    _handleIndexChange = index => {
        this.setState({ index })
    };

    _renderHeader = props => <TabBar {...props} labelStyle={{fontSize: 11}} style={[styles.eventTabBar, { backgroundColor: this.props.navigation.state.params.offer.color ? this.props.navigation.state.params.offer.color : '#ffffff' }]} />;

    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'details':
                return <OfferDetails navigation={this.props.navigation} details={this.props.details} offer={this.props.navigation.state.params.offer} />;
            case 'place':
                return <OfferPlace offer={this.props.navigation.state.params.offer} />;
            default:
                return null;
        }
    }

    render() {
        return (
            <TabViewAnimated
                style={{flex: 1}}
                navigationState={this.state}
                renderScene={this._renderScene}
                renderHeader={this._renderHeader}
                onIndexChange={this._handleIndexChange}
                initialLayout={initialLayout}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        details: state.userReducer.details
    };
}

function mapDispatchToProps(dispatch) {
    return {
        
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OfferWrapper);