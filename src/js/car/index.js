/**
 * APP购物车
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Urls from '../public/apiUrl';
import { Size } from '../public/globalStyle';

export default class CarsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View>
                <Text>购物车</Text>
            </View>
        );
    }
}

var styles = StyleSheet.create({
});