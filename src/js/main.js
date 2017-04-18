/**
 * 导航管理
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    StatusBar,
    Platform,
    View,
    Image,
} from 'react-native';

import { TabNavigator } from 'react-navigation';
import Lang from './public/language';
import { Color } from './public/globalStyle';

import Home from './home/';
import Find from './find/';
import Class from './class/';
import Car from './car/';
import Personal from './personal/';

//首页
const HomeScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Home} />
);
//发现
const FindScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Find} />
);
//分类
const ClassScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Class} />
);
//购物车
const CarsScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Car} />
);
//个人中心
const PersonalScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Personal} />
);
//显示格式
const MyNavScren = ({navigation, NavScreen}) => {
    return (
        <View style={styles.flex}>
            <StatusBar backgroundColor={Color.statusBarColor} barStyle="light-content" />
            <View style={styles.container}>
                <NavScreen navigation={navigation} />
            </View>
        </View>
    );
};

//APP下方导航栏
const TabNavs = TabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions : {
            tabBar: () => ({
                label: Lang['cn']['tab_home'],
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
                label: Lang['cn']['tab_find'],
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
                label: Lang['cn']['tab_class'],
                icon: ({ focused }) => {
                    let img = focused ? require('../images/navs/classSelect.png') : require('../images/navs/class.png');
                    return <Image source={img} style={styles.tabIcon} />;
                },
            }),
        },
    },
    Cars: {
        screen: CarsScreen,
        navigationOptions : {
            tabBar: () => ({
                label: Lang['cn']['tab_car'],
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
                label: Lang['cn']['tab_personal'],
                icon: ({ focused }) => {
                    let img = focused ? require('../images/navs/personalSelect.png') : require('../images/navs/personal.png');
                    return <Image source={img} style={styles.tabIcon} />;
                },
            }),
        },
    }
}, {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        showIcon: true,
        activeTintColor: Color.statusBarColor,      // 选中颜色
        inactiveTintColor: '#999',                  // 未选中颜色
        style: {
            backgroundColor: '#fff',
        },
        labelStyle: {
            fontSize: 14,
        },
    },
});

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 20 : 0,
    },
    tabIcon: {
        width: 22,
        height: 22,
    },
});

export default TabNavs;