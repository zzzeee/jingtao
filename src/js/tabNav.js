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
        navigationOptions : {
            tabBarLabel: Lang.cn.tab_home,
            tabBarIcon: ({ focused }) => {
                let img = focused ? require('../images/navs/homeSelect.png') : require('../images/navs/home.png');
                return <Image source={img} style={styles.tabIcon} />;
            },
            // tabBar: ({state}) => ({
            //     label: Lang.cn.tab_home,
            //     icon: ({ focused }) => {
            //         let img = focused ? require('../images/navs/homeSelect.png') : require('../images/navs/home.png');
            //         return <Image source={img} style={styles.tabIcon} />;
            //     },
            // }),
        },
    },
    Find: {
        screen: FindScreen,
        navigationOptions : {
            tabBarLabel: Lang.cn.tab_find,
            tabBarIcon: ({ focused }) => {
                let img = focused ? require('../images/navs/findSelect.png') : require('../images/navs/find.png');
                return <Image source={img} style={styles.tabIcon} />;
            },
            // tabBar: ({state}) => ({
            //     label: Lang.cn.tab_find,
            //     icon: ({ focused }) => {
            //         let img = focused ? require('../images/navs/findSelect.png') : require('../images/navs/find.png');
            //         return <Image source={img} style={styles.tabIcon} />;
            //     },
            // }),
        },
    },
    Classify: {
        screen: ClassScreen,
        navigationOptions : {
            tabBarLabel: Lang.cn.tab_class,
            tabBarIcon: ({ focused }) => {
                let img = focused ? require('../images/navs/classSelect.png') : require('../images/navs/class.png');
                return <Image source={img} style={styles.tabIcon} />;
            },
            // tabBar: ({state}) => ({
            //     label: Lang.cn.tab_class,
            //     icon: ({ focused }) => {
            //         let img = focused ? require('../images/navs/classSelect.png') : require('../images/navs/class.png');
            //         return <Image source={img} style={styles.tabIcon} />;
            //     },
            // }),
        },
    },
    Car: {
        screen: CarScreen,
        navigationOptions : {
            tabBarLabel: Lang.cn.tab_car,
            tabBarIcon: ({ focused }) => {
                let img = focused ? require('../images/navs/carSelect.png') : require('../images/navs/car.png');
                return <Image source={img} style={styles.tabIcon} />;
            },
            // tabBar: ({state}) => ({
            //     label: Lang.cn.tab_car,
            //     icon: ({ focused }) => {
            //         let img = focused ? require('../images/navs/carSelect.png') : require('../images/navs/car.png');
            //         return <Image source={img} style={styles.tabIcon} />;
            //     },
            // }),
        },
    },
    Personal: {
        screen: PersonalScreen,
        navigationOptions : {
            tabBarLabel: Lang.cn.tab_personal,
            tabBarIcon: ({ focused }) => {
                let img = focused ? require('../images/navs/personalSelect.png') : require('../images/navs/personal.png');
                return <Image source={img} style={styles.tabIcon} />;
            },
            // tabBar: ({state}) => ({
            //     label: Lang.cn.tab_personal,
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
});

export default TabNavs;