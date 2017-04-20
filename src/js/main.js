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
    Text,
    Image,
} from 'react-native';

import { 
    TabNavigator,
    StackNavigator,
} from 'react-navigation';

import BtnIcon from './public/BtnIcon';
import Lang from './public/language';
import { Color, Size } from './public/globalStyle';

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
const CarScreen = ({ navigation }) => (
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

// ========================== 测试内容 ==========================
const ClearScreen = ({navigation}) => {
    return <View><Text>成功清空</Text></View>;
};

const FindTestScreen = ({navigation}) => {
    return <View><Text>发现 - 测试 - 内容</Text></View>;
};
// =============================================================

// 首页集合
const HomeTab = StackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            header: ({ state, setParams }) => ({
                title: (
                    <View style={styles.headerTitle}>
                        <BtnIcon width={100} src={require("../images/logoTitle.png")} />
                    </View>
                ),
                left: (<Text></Text>),
                right: (<BtnIcon style={styles.btnRight} width={22} src={require("../images/search.png")} />),
            }),
        },
    },
}, {
    initialRouteName: 'Home',
    headerMode: 'none',
});

// 发现集合
const FindTab = StackNavigator({
    Find: {
        screen: FindScreen,
        navigationOptions: {
            title: '发现',
        },
    },
    FindTest: {
        screen: FindTestScreen,
        navigationOptions: {
            title: '发现 - 测试 - 标题',
        },
    },
}, {
    initialRouteName: 'Find',
});

// 分类集合
const ClassTab = StackNavigator({
    Calss: {
        screen: ClassScreen,
        navigationOptions: {
            title: '特产分类',
        },
    },
}, {
    initialRouteName: 'Calss',
});

// 购物车集合
const CarTab = StackNavigator({
    Car: {
        screen: CarScreen,
        navigationOptions: {
            title: '购物车',
        },
    },
    Clear: {
        screen: ClearScreen,
        navigationOptions: {
            title: '清空购物车',
        },
    },
}, {
    initialRouteName: 'Car',
});

// 个人中心集合
const PersonalTab = StackNavigator({
    Personal: {
        screen: PersonalScreen,
        navigationOptions: {
            title: '个人中心',
        },
    },
}, {
    initialRouteName: 'Personal',
});

//APP下方导航栏
const TabNavs = TabNavigator({
    Home: {
        screen: HomeTab,
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
        screen: FindTab,
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
        screen: ClassTab,
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
    Car: {
        screen: CarTab,
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
        screen: PersonalTab,
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
        inactiveTintColor: Color.appColor8,         // 未选中颜色
        style: {
            backgroundColor: '#eee',
        },
        labelStyle: {
            fontSize: 12,
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
    headerTitle: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnRight: {
        paddingRight: 10,
    },
});

export default TabNavs;