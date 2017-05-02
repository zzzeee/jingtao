/**
 * 购物车 - 提交订单
 * @auther linzeyong
 * @date   2017.05.02
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
    ScrollView,
    Animated,
} from 'react-native';

import Urls from '../public/apiUrl';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {Rule, str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';

export default class AddOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { navigation } = this.props;
        return (
            <View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.lightGrey,
        paddingBottom: 10,
    },
});