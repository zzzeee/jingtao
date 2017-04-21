/**
 * 发现模块 - 限时抢购
 * @auther linzeyong
 * @date   2017.04.21
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Urls from '../public/apiUrl';
import { Size, Color } from '../public/globalStyle';
import CountDown from "./CountDown";

export default class PanicBuying extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <CountDown ExpireTime="2017/04/22 11:57:20" />
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: Color.lightGrey,
    },
});