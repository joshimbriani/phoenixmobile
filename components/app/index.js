import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import NavContainer from '../subviews/navcontainer'
import * as colorActions from '../../redux/actions/backgroundColor';
import { styles } from '../../assets/styles';

class Index extends React.Component {

    state = {
        fontLoaded: false,
    };

    async componentWillMount() {
        this.props.colorActions.resetColor();
    }

    componentDidMount() {
        navigator.geolocation.setRNConfiguration({});
    }

    render() {
        return (
            <View style={styles.container}> 
                <NavContainer />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        color: state.backgroundColorReducer.color
    };
}

function mapDispatchToProps(dispatch) {
    return {
        colorActions: bindActionCreators(colorActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Index);
