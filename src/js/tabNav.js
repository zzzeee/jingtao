/**
 * 导航管理
 * @auther linzeyong
 * @date   2017.04.27
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';

import { 
    TabNavigator,
    StackNavigator,
} from 'react-navigation';

import Lang, {str_replace} from './public/language';
import { Color, Size, PX, pixel, FontSize } from './public/globalStyle';

import HomeScreen from './home/';
import FindScreen from './find/';
import ClassScreen from './class/';
import CarScreen from './car/';
import PersonalScreen from './personal/';

//APP下方导航栏
const TabNavs = TabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions : {
            tabBar: () => ({
                label: Lang.cn.tab_home,
                icon: ({ focused }) => {
                    let img = focused ? require('../images/navs/homeSelect.png') : require('../images/navs/home.png');
                    return <Image source={img} style={styles.tabIcon} />;
                },
            }),
        },
    },
    Find: {
        screen: FindScreen,
        navigationOptions : {
            tabBar: () => ({
                label: Lang.cn.tab_find,
                icon: ({ focused }) => {
                    let img = focused ? require('../images/navs/findSelect.png') : require('../images/navs/find.png');
                    return <Image source={img} style={styles.tabIcon} />;
                },
            }),
        },
    },
    Classify: {
        screen: ClassScreen,
        navigationOptions : {
            tabBar: () => ({
                label: Lang.cn.tab_class,
                icon: ({ focused }) => {
                    let img = focused ? require('../images/navs/classSelect.png') : require('../images/navs/class.png');
                    return <Image source={img} style={styles.tabIcon} />;
                },
            }),
        },
    },
    Car: {
        screen: CarScreen,
        navigationOptions : {
            tabBar: () => ({
                label: Lang.cn.tab_car,
                icon: ({ focused }) => {
                    let img = focused ? require('../images/navs/carSelect.png') : require('../images/navs/car.png');
                    return <Image source={img} style={styles.tabIcon} />;
                },
            }),
        },
    },
    Personal: {
        screen: PersonalScreen,
        navigationOptions : {
            tabBar: () => ({
                label: Lang.cn.tab_personal,
                icon: ({ focused }) => {
                    let img = focused ? require('../images/navs/personalSelect.png') : require('../images/navs/personal.png');
                    return <Image source={img} style={styles.tabIcon} />;
                },
            }),
        },
    }
}, {
    swipeEnabled: false,
    tabBarPosition: 'bottom',
    tabBarOptions: {
        showIcon: true,
        activeTintColor: Color.mainColor,      // 选中颜色
        inactiveTintColor: Color.lightBack,    // 未选中颜色
        style: {
            backgroundColor: '#fff',
            height: PX.tabHeight,
            borderTopWidth: pixel,
            borderTopColor: Color.floralWhite,
        },
        labelStyle: {
            fontSize: 10,
        },
        indicatorStyle: {
            height: 0,
        },
    },
});

const styles = StyleSheet.create({
    tabIcon: {
        width: PX.tabIconSize,
        height: PX.tabIconSize,
    },
});

export default TabNavs;