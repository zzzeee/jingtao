/**
 * APP购物车
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Button,
} from 'react-native';

import AppHead from '../public/AppHead';
import Urls from '../public/apiUrl';
import { Size } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
// var WeChat=require('react-native-wechat');
// import fs from 'react-native-fs';

export default class CarsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        //注册微信应用
        // WeChat.registerApp('wx220dd5779654cdf7');
    }

    render() {
        let nav = this.props.navigation || null;
        return (
            <View>
                <AppHead title='购物车' />
            </View>
        );
    }
}

var styles = StyleSheet.create({
});