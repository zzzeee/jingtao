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
    Button,
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
        let nav = this.props.navigation || null;
        return (
            <View>
                <Button title="当前页面跳转" onPress={()=>{
                    nav.navigate('Clear', {
                        id: 1,
                        name: '当前页面跳转',
                        obj: {
                            a: 1,
                            b: 2,
                        }
                    });
                }} />
                <Button title="跳转到发现页主页" onPress={()=>{
                    nav.navigate('Find', {
                        id: 2,
                        name: '跳转到发现页主页',
                    });
                }} />
                <Button title="跳转到发现页子页" onPress={()=>{
                    nav.navigate('FindTest', {
                        id: 3,
                        name: '跳转到发现页主页',
                    });
                }} />
            </View>
        );
    }
}

var styles = StyleSheet.create({
});