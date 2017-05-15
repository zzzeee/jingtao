/**
 * 导航管理
 * @auther linzeyong
 * @date   2017.04.27
 */

import React , { Component } from 'react';
import {
    Platform,
    StatusBar,
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

import Home from './home/';
import Find from './find/';
import Class from './class/';
import Car from './car/';
import Personal from './personal/';

//显示格式
const MyNavScren = ({navigation, NavScreen}) => {
    return (
        <View style={styles.flex}>
            <StatusBar backgroundColor={Color.mainColor} barStyle="light-content" />
            <View style={styles.container}>
                <NavScreen navigation={navigation} />
            </View>
        </View>
    );
};

// 导味
const HomeScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Home} />
);
// 发现
const FindScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Find} />
);
// 分类
const ClassScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Class} />
);
// 购物车
const CarScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Car} />
);
// 个人中心
const PersonalScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Personal} />
);

//APP下方导航栏
const TabNavs = TabNavigator({
    Home: {
        screen: HomeScreen,
        path: 'home',
        navigationOptions : {
            // tabBarLabel: Lang[Lang.default].tab_home,
            tabBarLabel: ({ focused })=>{
                let selectStyle = focused ? {color: Color.mainColor} : {};
                return <Text style={[styles.labelTextStyle, selectStyle]}>{Lang[Lang.default].tab_home}</Text>;
            },
            tabBarIcon: ({ focused }) => {
                let img = focused ? require('../images/navs/homeSelect.png') : require('../images/navs/home.png');
                return <Image source={img} style={styles.tabIcon} />;
            },
            // tabBar: ({state}) => ({
            //     label: Lang[Lang.default].tab_home,
            //     icon: ({ focused }) => {
            //         let img = focused ? require('../images/navs/homeSelect.png') : require('../images/navs/home.png');
            //         return <Image source={img} style={styles.tabIcon} />;
            //     },
            // }),
        },
    },
    Find: {
        screen: FindScreen,
        path: 'find',
        navigationOptions : {
            // tabBarLabel: Lang[Lang.default].tab_find,
            tabBarLabel: ({ focused })=>{
                let selectStyle = focused ? {color: Color.mainColor} : {};
                return <Text style={[styles.labelTextStyle, selectStyle]}>{Lang[Lang.default].tab_find}</Text>;
            },
            tabBarIcon: ({ focused }) => {
                let img = focused ? require('../images/navs/findSelect.png') : require('../images/navs/find.png');
                return <Image source={img} style={styles.tabIcon} />;
            },
            // tabBar: ({state}) => ({
            //     label: Lang[Lang.default].tab_find,
            //     icon: ({ focused }) => {
            //         let img = focused ? require('../images/navs/findSelect.png') : require('../images/navs/find.png');
            //         return <Image source={img} style={styles.tabIcon} />;
            //     },
            // }),
        },
    },
    Classify: {
        screen: ClassScreen,
        path: 'classify',
        navigationOptions : {
            // tabBarLabel: Lang[Lang.default].tab_class,
            tabBarLabel: ({ focused })=>{
                let selectStyle = focused ? {color: Color.mainColor} : {};
                return <Text style={[styles.labelTextStyle, selectStyle]}>{Lang[Lang.default].tab_class}</Text>;
            },
            tabBarIcon: ({ focused }) => {
                let img = focused ? require('../images/navs/classSelect.png') : require('../images/navs/class.png');
                return <Image source={img} style={styles.tabIcon} />;
            },
            // tabBar: ({state}) => ({
            //     label: Lang[Lang.default].tab_class,
            //     icon: ({ focused }) => {
            //         let img = focused ? require('../images/navs/classSelect.png') : require('../images/navs/class.png');
            //         return <Image source={img} style={styles.tabIcon} />;
            //     },
            // }),
        },
    },
    Car: {
        screen: CarScreen,
        path: 'car',
        navigationOptions : {
            tabBarLabel: ({ focused })=>{
                let selectStyle = focused ? {color: Color.mainColor} : {};
                return <Text style={[styles.labelTextStyle, selectStyle]}>{Lang[Lang.default].tab_car}</Text>;
            },
            tabBarIcon: ({ focused }) => {
                let img = focused ? require('../images/navs/carSelect.png') : require('../images/navs/car.png');
                return <Image source={img} style={styles.tabIcon} />;
            },
            // tabBar: ({state}) => ({
            //     label: Lang[Lang.default].tab_car,
            //     icon: ({ focused }) => {
            //         let img = focused ? require('../images/navs/carSelect.png') : require('../images/navs/car.png');
            //         return <Image source={img} style={styles.tabIcon} />;
            //     },
            // }),
        },
    },
    Personal: {
        screen: PersonalScreen,
        path: 'personal',
        navigationOptions : {
            // tabBarLabel: Lang[Lang.default].tab_personal,
            tabBarLabel: ({ focused })=>{
                let selectStyle = focused ? {color: Color.mainColor} : {};
                return <Text style={[styles.labelTextStyle, selectStyle]}>{Lang[Lang.default].tab_personal}</Text>;
            },
            tabBarIcon: ({ focused }) => {
                let img = focused ? require('../images/navs/personalSelect.png') : require('../images/navs/personal.png');
                return <Image source={img} style={styles.tabIcon} />;
            },
            // tabBar: ({state}) => ({
            //     label: Lang[Lang.default].tab_personal,
            //     icon: ({ focused }) => {
            //         let img = focused ? require('../images/navs/personalSelect.png') : require('../images/navs/personal.png');
            //         return <Image source={img} style={styles.tabIcon} />;
            //     },
            // }),
        },
    }
}, {
    initialRouteName: 'Home',
    swipeEnabled: false,
    animationEnabled: false,
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
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? PX.statusHeight : 0,
        backgroundColor: Color.lightGrey,
    },
    tabIcon: {
        width: PX.tabIconSize,
        height: PX.tabIconSize,
    },
    labelTextStyle: {
        margin: 2,
        fontSize: 10,
    },
});

export default TabNavs;