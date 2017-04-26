/**
 * 导航管理
 * @auther linzeyong
 * @date   2017.04.27
 */
import React from 'react';
import {
    StatusBar,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import TabNavScreen from './tabNav';
import MyIntegralScreen from './personal/MyIntegral';

import { Color, PX } from './public/globalStyle';

const AppNavigator = StackNavigator({
    TabNav: {
        screen: TabNavScreen,
    },
    MyIntegral: {
        screen: MyIntegralScreen,
    },
}, {
    initialRouteName: 'TabNav',
    headerMode: 'none',
    /*
    * Use modal on iOS because the card mode comes from the right,
    * which conflicts with the drawer example gesture
    */
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
});

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
});

export default AppNavigator;