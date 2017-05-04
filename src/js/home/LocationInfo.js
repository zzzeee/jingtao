import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Geolocation,
} from 'react-native';
import Utils from '../public/utils';
export default class LocationInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			myPosition: null,
		}
	}
	componentDidMount() {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				console.log(position);
				// var initialPosition = JSON.stringify(position);
				// this.setState({initialPosition});
				let that = this;
				let url = 'http://api.map.baidu.com/geocoder?location=' + 
					position.coords.latitude + ',' + 
					position.coords.longitude;
				console.log(url);
				fetch(url)
					.then((response) => response.text())
					.then((responseJson) => {
						let pattern = new RegExp("\\<province>(.| )+?\\</province>", "igm");
						let arr = responseJson.match(pattern);
						console.log(arr);
						if(arr.length > 0) {
							let myPosition = arr[0].replace(/<province>/, '');
							myPosition = myPosition.replace(/<\/province>/, '');
							that.setState({ myPosition });
						}
					})
					.catch((error) => {
						console.error(error);
					});
			},
			(error) => alert(error.message),
			{ enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
		);
	}

	render() {
		return (
			<View style={styles.body}>
				<Text style={styles.bodyText}>{'我的定位：' + this.state.myPosition}</Text>
			</View>
		);
	}
}

var styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
	bodyText: {
		fontSize: 20,
	},
});