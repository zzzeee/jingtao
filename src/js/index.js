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
import Coupon from './car/Coupon';
import PayFinish from './car/PayFinish';
import LocationInfo from './home/LocationInfo';
import TestPage from './personal/TestPage';

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

//购物车 - 提交订单 - 选择优惠券
const CouponScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Coupon} />
);

//购物车 - 提交订单 - 支付完成
const PayFinishScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={PayFinish} />
);

//个人中心 - 测试集合
const TestPageScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={TestPage} />
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
    Coupon: {
        screen: CouponScreen,
    },
    PayFinish: {
        screen: PayFinishScreen,
    },
    LocationInfo: {
        screen: LocationInfoScreen,
    },
    TestPage: {
        screen: TestPageScreen,
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
        backgroundColor: '#FFF',
    },
});

export default AppNavigator;