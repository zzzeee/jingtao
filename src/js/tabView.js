/**
 * APP 主页面
 * @auther linzeyong
 * @date   2017.05.27
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Lang, {str_replace} from './public/language';
import { Color, Size, PX, pixel, FontSize } from './public/globalStyle';

import TabMenu from './tabMenu';
import Home from './home/';
import Find from './find/';
import Class from './class/';
import Car from './car/';
import Personal from './personal/';

export default class TabView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: null,
        };

        this.Menus = [{
                name: Lang[Lang.default].tab_home,
                icon: require('../images/navs/home.png'),
                selIcon: require('../images/navs/homeSelect.png'),
            },{
                name: Lang[Lang.default].tab_find,
                icon: require('../images/navs/find.png'),
                selIcon: require('../images/navs/findSelect.png'),
            },{
                name: Lang[Lang.default].tab_class,
                icon: require('../images/navs/class.png'),
                selIcon: require('../images/navs/classSelect.png'),
            },{
                name: Lang[Lang.default].tab_car,
                icon: require('../images/navs/car.png'),
                selIcon: require('../images/navs/carSelect.png'),
            },{
                name: Lang[Lang.default].tab_personal,
                icon: require('../images/navs/personal.png'),
                selIcon: require('../images/navs/personalSelect.png'),
            }];
    }

    componentDidMount() {
    }

    render() {
        const { navigation } = this.props;
        return (
            <ScrollableTabView
                renderTabBar={() => <TabMenu Menus={this.Menus} />}
                locked={true}
                style={styles.flex}
                initialPage={0}
                tabBarPosition='overlayBottom'
                onChangeTab={(obj) => {
                    this.setState({
                        selectIndex : obj.i,
                    });
                }}
            >
                <View style={styles.flex} tabLabel='Tab1'>
                    <Home navigation={navigation} />
                </View>
                <View style={styles.flex} tabLabel='Tab2'>
                    <Find navigation={navigation} />
                </View>
                <View style={styles.flex} tabLabel='Tab3'>
                    <Class navigation={navigation} />
                </View>
                <View style={styles.flex} tabLabel='Tab4'>
                    <Car navigation={navigation} selectIndex={this.state.selectIndex} />
                </View>
                <View style={styles.flex} tabLabel='Tab4'>
                    <Personal navigation={navigation} />
                </View>
            </ScrollableTabView>
        );
    }
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    contentBox : {
        flex : 1,
    },
});