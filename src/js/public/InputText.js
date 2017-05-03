/**
 * 输入框
 * @auther linzeyong
 * @date   2017.05.03
 */

import React, { Component } from 'react';
import {
	StyleSheet,
	Text, 
	View, 
    TextInput, 
} from 'react-native';

import { Size, Color, pixel } from '../public/globalStyle';

export default class InputText extends Component {
	//构造
	constructor(props)
	{
		super(props);
		this.state = {};
	}

	render() {
		let {vText, defaultValue, pText, pcolor, onChange, style, isPWD, length, focus, keyType, disEdit, multiline} = this.props;
	    return (
            <TextInput
                style={[styles.inputStyle, style]}
                onChangeText={(text) => onChange(text)}
                value={vText ? vText : null}
                defaultValue={defaultValue ? defaultValue : null}
                placeholder={pText}
                placeholderTextColor={pcolor ? pcolor : '#bbb'}
                secureTextEntry={isPWD ? true : false}
                underlineColorAndroid='transparent'
                maxLength={length ? length : null}
                autoFocus={focus ? true : false}
                keyboardType={keyType ? keyType : 'default'}
                editable={disEdit ? false : true}
                multiline={multiline ? multiline : false}
            />
	    );
	}
}

const styles = StyleSheet.create({
	inputStyle : {
        color : Color.lightBack,
        fontSize : 14,
        height : 34,
        textAlignVertical: 'center',
        borderWidth: pixel,
        borderColor: Color.lavender,
        borderRadius: 6,
        backgroundColor : '#fff'
    },
});
