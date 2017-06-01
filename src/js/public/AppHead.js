import React, { Component } from 'react';
import {
	StyleSheet,
	Text, 
	View,
} from 'react-native';

import { Size, pixel, PX, Color, FontSize } from '../public/globalStyle';

export default class AppHead extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {};
  	}

	render() {
		let {title, onPress, center, float, style, textStyle, left, right} = this.props;
		
	    return (
			<View style={[styles.topBox, float ? {position: 'absolute', left: 0, right: 0}: {}, style]}>
				<View style={[styles.sideBox, {left: 0}]}>
					{left ? left : null}
				</View>
				<View style={styles.middleBox}>
					{center ?
						center :
						<Text style={[styles.title, textStyle]} onPress={onPress}>{title}</Text>
					}
				</View>
				<View style={[styles.sideBox, {right: 0}]}>
					{right ? right : null}
				</View>
			</View>
	    );
	}
}

var styles = StyleSheet.create({
	topBox : {
		height: PX.headHeight,
		flexDirection : 'row',
		justifyContent : 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 0.5,
        shadowOffset: {"height": 0.5},
        elevation: 4,
	},
	sideBox : {
		height: PX.headHeight,
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		top: 0,
	},
	middleBox : {
		flex : 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title : {
		color: Color.mainColor,
        fontSize: FontSize.headFontSize,
        fontWeight: FontSize.headFontWeight,
	},
});
