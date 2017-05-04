import React from 'react';
import {
  View,
  Text
} from 'react-native';
import AMapLocation from 'react-native-amap-location';
export default class LocationInfo extends React.Component{
  componentDidMount() {
  this.listener = AMapLocation.addEventListener((data) => console.log('data', data));
  AMapLocation.startLocation({
    accuracy: 'HighAccuracy',
    killProcess: true,
    needDetail: true,
  });
}

componentWillUnmount() {
  AMapLocation.stopLocation();
  this.listener.remove();
}
  render(){
    return(
      <View>
        <Text>amap</Text>
      </View>
    );
  }
}