/**
 * 常用工具
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';

import Lang, {str_replace} from './language';
import { Size, pixel, PX, Color, errorStyles } from './globalStyle';

//加载中
const Loading = ({bgStyle, loadText, loadColor, loadStyle, load_textStyle}) => {
    let txt = loadText || Lang[Lang.default].loading;
    let color = loadColor || '#fff';
    return (
        <View style={[styles.bodyView, bgStyle]}>
            <View style={[styles.modalBody, loadStyle]}>
                <ActivityIndicator animating={true} color={color} size="small" />
                <Text style={[styles.modalText, {color: color}, load_textStyle]} >{txt}</Text>
            </View>
        </View>
    );
};

//获取失败
const ErrorView = (obj, func) => {
    const {bgStyle, errText1, errText2, errColor, errStyle, err_textStyle1, err_textStyle2, fetchFunc} = obj;
    let txt1 = errText1 || Lang[Lang.default].reconnect;
    let txt2 = errText2 || Lang[Lang.default].fetchError;
    let color = errColor || Lang[Lang.default].lightBack;
    return (
        <View style={[errorStyles.bodyView, bgStyle]}>
            <Text 
                style={[errorStyles.refaceBtn, {color: color}, err_textStyle1]}
                onPress={fetchFunc}
            >
                {txt1}
            </Text>
            <Text style={[errorStyles.errRemind, {color: color}, err_textStyle2]}>{txt2}</Text>
        </View>
    );
};

var Util = {
    /* fetch 网络请求数据
     * @param String url  请求地址
     * @param String type 请求方式： get / post
     * @param Object data 请求参数
     * @param function callback 回调函数
     * @param function load_error 返回加载状态或错误状态 
     * @param Object load_error_config 返回加载状态或错误状态的配置
     */
    fetch: function (url, type, data, callback, load_error = null, load_error_config = {}) {
        var fetchOptions = {};
        var str_data = '';
        if(load_error && !load_error_config.hideLoad) {
            load_error && load_error(Loading({...load_error_config}));
        }
        //data参数格式化
        for (let key in data) {
            if (typeof(data[key]) !== 'undefined' && data[key] !== null) {
                str_data += key + '=' + data[key] + '&';
            }
        }
        
        if (str_data.length > 0) {
            str_data = str_data.substring(0, str_data.length - 1);
            str_data = str_data.replace(/\+/g,"%2B");
        }

        //判断请求方式
        if (type.toUpperCase() == 'POST') {
            fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: str_data
            };
        }else {
            url += '?' + str_data;
            url = encodeURI(url);
        }
        
        let fetchFunc = () => this.fetch(url, type, data, callback, load_error, load_error_config);

        load_error_config.fetchFunc = fetchFunc;
        try {
            fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((responseText) => {
                // load_error && load_error(null);
                callback(responseText);
            })
            .catch((error) => {
                load_error && load_error(ErrorView(load_error_config, fetchFunc));
            });
        } catch(error) {
            console.error(error);
            load_error_config.errText2 = Lang[Lang.default].programError;
            load_error && load_error(ErrorView(load_error_config, fetchFunc));
        }
    },

    //仅用于异步请求 (async / await)
    async_fetch: function (url, type, json) {
        let head = type.toUpperCase() == 'POST' ? {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: json,
            } : {};
        return fetch(url, head)
        .then((response) => response.json())
        .then((responseText) => {
            return responseText;
        })
        .catch((error) => {
            return null;
        });
    },

    //网络请求出错
    fetchError: function (err, data) {
        if (err) {
            console.log(err);
        }
    },

    //去除前后空格
    trim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    // 格式“yyyy-MM-dd HH:MM:SS”
    /*
     * 获取指定的日期时间
     * type = 1 时，返回  yyyy-MM-dd HH:MM:SS
     * type = 2 时，返回 yyyy-MM-dd
     */
    getFormatDate: function (date, type) {
        if (date) {
            date = new Date(date);
        }
        else {
            date = new Date();
        }

        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var currentdate;
        var DD = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
        month = month < 10 ? DD[month] : month;
        day = day < 10 ? DD[day] : day;
        hour = hour < 10 ? DD[hour] : hour;
        minute = minute < 10 ? DD[minute] : minute;
        second = second < 10 ? DD[second] : second;

        if (type == 1) {
            currentdate = date.getFullYear() + seperator1 + month + seperator1
                + day + " " + hour + seperator2 + minute + seperator2 + second;
        }
        else if (type == 2) {
            currentdate = date.getFullYear() + seperator1 + month + seperator1 + day;
        }
        else {
            currentdate = '';
        }

        return currentdate;
    },
};

var styles = StyleSheet.create({
    bodyView : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.lightGrey,
    },
    modalBody : {
        width : Size.width * 0.5,
        flexDirection : 'row',
		alignItems: 'center',
        justifyContent: 'center',
        borderWidth : pixel,
        borderColor : '#aaa',
		backgroundColor : 'rgba(0, 0, 0, 0.8)',
        padding : 30,
		borderRadius : 10,
	},
	modalText : {
		color : '#fff',
        fontSize : 15,
        paddingLeft: 20,
	},
});

export default Util;