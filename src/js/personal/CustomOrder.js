/**
 * 个人中心 - 我的订单 - 各订单切换
 * @auther linzeyong
 * @date   2017.06.20
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import {
    createNavigator,
    createNavigationContainer,
    TabRouter,
    addNavigationHelpers,
} from 'react-navigation';

import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';

const CustomTabBar = ({
    navigation,
}) => {
    const { routes } = navigation.state;
    return (
        <View style={styles.tabContainer}>
            {routes.map(route => (
                <TouchableOpacity
                    onPress={() => navigation.navigate(route.routeName)}
                    style={styles.tab}
                    key={route.routeName}
                >
                    <Text>{route.routeName}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const CustomTabView = ({
    router,
    navigation,
}) => {
    const { routes, index } = navigation.state;
    const ActiveScreen = router.getComponentForState(navigation.state);
    return (
        <View style={styles.container}>
            <CustomTabBar navigation={navigation} />
            <ActiveScreen
                navigation={addNavigationHelpers({
                    ...navigation,
                    state: routes[index],
                })}
            />
        </View>
    );
};

const CustomTabRouter = TabRouter({
    All: {
        screen: MyHomeScreen,
        path: '',
    },
    Notifications: {
        screen: MyNotificationsScreen,
        path: 'notifications',
    },
    Settings: {
        screen: MySettingsScreen,
        path: 'settings',
    },
}, {
    // Change this to start on a different tab
    initialRouteName: 'Home',
});

const CustomTabs = createNavigationContainer(createNavigator(CustomTabRouter)(CustomTabView));

const styles = StyleSheet.create({
});

export default CustomOrder;
