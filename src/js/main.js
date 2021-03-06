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
    TouchableOpacity,
} from 'react-native';

import { 
    TabNavigator,
    StackNavigator,
} from 'react-navigation';

import BtnIcon from './public/BtnIcon';
import Lang, {str_replace} from './public/language';
import { Color, Size, PX, pixel, FontSize } from './public/globalStyle';

import Home from './home/';
import Find from './find/';
import Class from './class/';
import Car from './car/';
import Personal from './personal/';
import MyIntegral from './personal/MyIntegral';

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
//个人中心 - 我的积分
const MyIntegralScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={MyIntegral} />
);

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
        screen: ({ navigation }) => (<MyNavScren navigation={navigation} NavScreen={Home} />),
        navigationOptions: {
            header: ({ state, setParams }) => {
                let head = {
                    title: (
                        <View style={styles.headerTitle}>
                            <BtnIcon width={100} height={PX.headHeight} src={require("../images/logoTitle.jpg")} />
                        </View>
                    ),
                    left: (<Text></Text>),
                    right: (<BtnIcon style={styles.btnRight} width={PX.headIconSize} src={require("../images/search.png")} />),
                    style: {
                        height: PX.headHeight,
                    },
                };

                let name = (state.params && state.params.name) ? state.params.name : null;
                let showName = (state.params && state.params.showName) ? state.params.showName : false;
                if(name && showName) {
                    let gotoStart = state.params.gotoStart || null;
                    head.title = (
                        <TouchableOpacity style={styles.titleTextBox} onPress={gotoStart}>
                            <Text style={styles.headTitle1}>{str_replace(Lang[Lang.default].previewing, '')}</Text>
                            <Text style={styles.headTitle2}>{name + Lang[Lang.default].guan}</Text>
                            <BtnIcon width={16} src={require("../images/sanjiao.png")} press={gotoStart} />
                        </TouchableOpacity>);
                    head.left = <BtnIcon style={styles.btnLeft} width={PX.headIconSize} src={require("../images/logo.png")} press={gotoStart} />
                }

                return head;
            },
        },
    },
}, {
    initialRouteName: 'Home',
    headerMode: 'none',  //不显示头部
});

// 发现集合
const FindTab = StackNavigator({
    Find: {
        screen: FindScreen,
        navigationOptions: {
            header: ({ state, setParams }) => ({
                title: (
                    <View style={styles.headerTitle}>
                        <BtnIcon width={100} height={PX.headHeight} src={require("../images/logoTitle.jpg")} />
                    </View>
                ),
                left: (<Text></Text>),
                right: (<BtnIcon style={styles.btnRight} width={PX.headIconSize} src={require("../images/search.png")} />),
                style: {
                    height: PX.headHeight,
                },
            }),
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
            header: ({ state, setParams }) => ({
                title: (
                    <View style={styles.headerTitle}>
                        <Text style={styles.headTextStyle}>{Lang[Lang.default].tab_class}</Text>
                    </View>
                ),
                left: (<Text></Text>),
                right: (<BtnIcon style={styles.btnRight} width={PX.headIconSize} src={require("../images/search.png")} />),
                style: {
                    height: PX.headHeight,
                },
            }),
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
            header: () => ({
                style: {
                    height: PX.headHeight,
                },
            }),
        },
    },
    Clear: {
        screen: ClearScreen,
        navigationOptions: {
            title: '清空购物车',
            header: () => ({
                style: {
                    height: PX.headHeight,
                },
            }),
        },
    },
}, {
    initialRouteName: 'Car',
});

// 个人中心集合
const PersonalTab = StackNavigator({
    Personal: {
        screen: PersonalScreen,
    },
    MyIntegral: {
        screen: MyIntegralScreen,
    },
}, {
    initialRouteName: 'Personal',
    headerMode: 'none',  //不显示头部
});

//APP下方导航栏
const TabNavs = TabNavigator({
    Home: {
        screen: HomeTab,
        navigationOptions : {
            tabBar: () => ({
                label: Lang[Lang.default].tab_home,
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
                label: Lang[Lang.default].tab_find,
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
                label: Lang[Lang.default].tab_class,
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
                label: Lang[Lang.default].tab_car,
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
                label: Lang[Lang.default].tab_personal,
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
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? PX.statusHeight : 0,
        backgroundColor: Color.lightGrey,
    },
    headTextStyle: {
        color: Color.mainColor,
        fontSize: FontSize.headFontSize,
        fontWeight: FontSize.headFontWeight,
    },
    tabIcon: {
        width: PX.tabIconSize,
        height: PX.tabIconSize,
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
    titleTextBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headTitle1: {
        color: Color.gainsboro,
        fontSize: 12,
        paddingRight: 2,
    },
    headTitle2: {
        color: Color.lightBack,
        fontSize: 13,
    },
    btnLeft: {
        paddingLeft: 10,
    },
});

export default TabNavs;