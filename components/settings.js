// this is home with "settings" instead of "home" & the settings list from evetstech pasted in under "class..."

import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, StyleSheet, TouchableHighlight, View } from 'react-native';
import GridView from 'react-native-super-grid';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../redux/actions/backgroundColor';
import randomMC from 'random-material-color';

class Settings extends React.Component {
    render() {
  return (
    <View style={{backgroundColor:'gray',flex:1}}>
      <View style={{flex:1, marginTop:50}}>
        <SettingsList>
            <SettingsList.Header headerText='First Grouping' headerStyle={{color:'white'}}/>
          <SettingsList.Item
            icon={
              <View style={{height:30,marginLeft:10,alignSelf:'center'}}>
                <Image style={{alignSelf:'center',height:40, width:40}} source={require('./about.png')}/>
              </View>
            }
            itemWidth={50}
            title='Icon Example'
            onPress={() => Alert.alert('Icon Example Pressed')}
          />
          <SettingsList.Item
            hasNavArrow={false}
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasSwitch={true}
            title='Switch Example'/>
          <SettingsList.Item
            title='Different Colors Example'
            backgroundColor='#D1D1D1'
            titleStyle={{color:'blue'}}
            arrowStyle={{tintColor:'blue'}}
            onPress={() => Alert.alert('Different Colors Example Pressed')}/>
          <SettingsList.Header headerText='Different Grouping' headerStyle={{color:'white', marginTop:50}}/>
          <SettingsList.Item titleInfo='Some Information' hasNavArrow={false} title='Information Example'/>
          <SettingsList.Item title='Settings 1'/>
          <SettingsList.Item title='Settings 2'/>
        </SettingsList>
      </View>
    </View>
  );
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
)(Settings);

const styles = StyleSheet.create({
    gridView: {
        flex: 1,
    },
    itemBox: {
        height: 150,
        backgroundColor: '#1abc9c',
        borderRadius: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        color: 'white',
    }

});