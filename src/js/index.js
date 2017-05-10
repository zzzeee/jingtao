/**
 * 导航管理
 * @auther linzeyong
 * @date   2017.04.27
 */
import React, { Component } from 'react';
import {
    StatusBar,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { Color, PX } from './public/globalStyle';

import TabNavScreen from './tabNav';
import MyIntegral from './personal/MyIntegral';
import IntegralRule from './personal/IntegralRule';
import AddOrder from './car/AddOrder';
import LocationInfo from './home/LocationInfo';
import EmptyCar from './car/EmptyCar';

//显示格式
const MyNavScren = ({navigation, NavScreen}) => {
    let { router } = TabNavScreen;
    return (
        <View style={styles.flex}>
            <StatusBar backgroundColor={Color.mainColor} barStyle="light-content" />
            <View style={styles.container}>
                <NavScreen navigation={navigation} router={router} />
            </View>
        </View>
    );
};

//个人中心 - 我的积分
const MyIntegralScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={MyIntegral} />
);

//个人中心 - 我的积分 - 积分规则
const IntegralRuleScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={IntegralRule} />
);

//购物车 - 提交订单
const AddOrderScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={AddOrder} />
);

//购物车 - 空购物车 - 测试
const EmptyCarScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={EmptyCar} />
);

//首页 - 获取定位 - 测试
const LocationInfoScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={LocationInfo} />
);

const AppNavigator = StackNavigator({
    TabNav: {
        screen: TabNavScreen,
    },
    MyIntegral: {
        screen: MyIntegralScreen,
    },
    IntegralRule: {
        screen: IntegralRuleScreen,
    },
    AddOrder: {
        screen: AddOrderScreen,
    },
    LocationInfo: {
        screen: LocationInfoScreen,
    },
    EmptyCar: {
        screen: EmptyCarScreen,
    },
}, {
    initialRouteName: 'TabNav',
    headerMode: 'none',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
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
});

export default AppNavigator;