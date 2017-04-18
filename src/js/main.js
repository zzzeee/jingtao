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
// //发现
// const FindScreen = ({ navigation }) => (
//     <MyNavScren navigation={navigation} NavScreen={Find} />
// );
// //分类
// const ClassScreen = ({ navigation }) => (
//     <MyNavScren navigation={navigation} NavScreen={Class} />
// );
// //购物车
// const CarsScreen = ({ navigation }) => (
//     <MyNavScren navigation={navigation} NavScreen={Cars} />
// );
// //个人中心
// const PersonalScreen = ({ navigation }) => (
//     <MyNavScren navigation={navigation} NavScreen={Personal} />
// );
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
                    let img = focused ? 'homeSelect.png' : 'home.png';
                    return <Image source={require('../images/navs/' + img)} style={styles.tabIcon} />;
                },
            }),
        },
    },
    // Find: {
    //     screen: FindScreen,
    // },
    // Classify: {
    //     screen: ClassScreen,
    // },
    // Cars: {
    //     screen: CarsScreen,
    // },
    // Personal: {
    //     screen: PersonalScreen,
    // }
}, {
    tabBarOptions: {
        tabBarPosition: 'bottom',
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
        width: 30,
        height: 30,
    },
});

export default TabNavs;