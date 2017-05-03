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

export default class CarsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { navigation } = this.props;
        return (
            <View>
                <AppHead title='购物车' />
                <Button title='提交订单' onPress={()=>navigation.navigate('AddOrder')} />
            </View>
        );
    }
}

var styles = StyleSheet.create({
});