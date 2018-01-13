// this is home with "settings" instead of "home" & the settings list from evetstech pasted in under "class..."

import React from 'react';
import { Container, Fab, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Alert, Platform, StyleSheet, TouchableHighlight, View } from 'react-native';
import GridView from 'react-native-super-grid';
import PlatformIonicon from './utils/platformIonicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colorActions from '../redux/actions/backgroundColor';
import randomMC from 'random-material-color';
import SettingsList from 'react-native-settings-list';

class Settings extends React.Component {
    constructor(){
  super();
  this.onValueChange = this.onValueChange.bind(this);
  this.onValueChange2 = this.onValueChange2.bind(this);
  this.state = {switchValue: false, switchValue2: false};
}
render() {
  var bgColor = '#0000ff'; //why doesn't this do anything? This should be blue, to debug
  return (
    <View style={{backgroundColor:'#EFEFF4',flex:1}}>
      <View style={{backgroundColor:'#EFEFF4',flex:1}}>
        <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
          <SettingsList.Header headerStyle={{marginTop:15}}/>
          <SettingsList.Item
            icon={
                <PlatformIonicon
                    name='contact' // do we want this to be "person"
                    size={30}
                    style={{ paddingTop: 10, paddingLeft: 5}}
                />
            }
            title='Profile'
            titleInfo='User Name' // could link this to the user's name
            titleInfoStyle={styles.titleInfoStyle}
            onPress={() => this.props.navigation.navigate("ProfileSettings",{})}
          />
          <SettingsList.Item
            icon={
                <PlatformIonicon
                    name='notifications'
                    size={30}
                    style={{paddingTop: 10, paddingLeft: 5}}
                />
            }
            hasSwitch={true}
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasNavArrow={false}
            title='Notifications'
          />
          <SettingsList.Item
            icon={
                <PlatformIonicon
                    name='sunny'
                    size={30}
                    style={{paddingTop: 10, paddingLeft: 5}}
                />
            }
            hasSwitch={true}
            switchState={this.state.switchValue2}
            switchOnValueChange={this.onValueChange2}
            hasNavArrow={false}
            title='Night Mode'
          />
          <SettingsList.Header headerStyle={{marginTop:15}}/>
          <SettingsList.Item
            icon={
                <PlatformIonicon
                    name='locate'
                    size={30}
                    style={{paddingTop: 10, paddingLeft: 5}}
                />
            }
            title='Radius'
            titleInfo='50 km' // link to the stack beyond it with the distance & unit
            titleInfoStyle={styles.titleInfoStyle}
          />
          <SettingsList.Item
            icon={<PlatformIonicon
                    name='pin'
                    size={30}
                    style={{paddingTop: 10, paddingLeft: 5}}
                />}
            title='Locations'
            onPress={() => this.props.navigation.navigate("ProfileSettings",{})}
          />
          <SettingsList.Header headerStyle={{marginTop:15}}/>
          
          <SettingsList.Item
            icon={<PlatformIonicon
                    name='lock'
                    size={30}
                    style={{paddingTop: 10, paddingLeft: 5}}
                />}
            title='Privacy'
          />
          <SettingsList.Item
            icon={<PlatformIonicon
                    name='hand'
                    size={30}
                    style={{paddingTop: 10, paddingLeft: 5}}
                />}
            title='Restricted Mode'
          />
          <SettingsList.Item
            icon={<PlatformIonicon
                    name='help-circle'
                    size={30}
                    style={{paddingTop: 10, paddingLeft: 5}}
                />}
            title='Help'
          />
          <SettingsList.Item
            icon={<PlatformIonicon
                    name='folder-open'
                    size={30}
                    style={{paddingTop: 10, paddingLeft: 5}}
                />}
            title='Legal'
          />
        </SettingsList>
      </View>
    </View>
  );
}
onValueChange(value){
  this.setState({switchValue: value});
}
onValueChange2(value){
  this.setState({switchValue2: value});
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