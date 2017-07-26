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
  Linking,
} from 'react-native';

import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Lang, {str_replace, TABKEY} from './public/language';
import { Color, Size, PX, pixel, FontSize } from './public/globalStyle';
import AlertMoudle from './other/AlertMoudle';

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
            selectIndex: 0,
            initIndex: 0,
            deleteAlert: false,
        };

        this.Menus = [{
                key: TABKEY.home,
                name: Lang[Lang.default].tab_home,
                icon: require('../images/navs/home.png'),
                selIcon: require('../images/navs/homeSelect.png'),
            },{
                key: TABKEY.find,
                name: Lang[Lang.default].tab_find,
                icon: require('../images/navs/find.png'),
                selIcon: require('../images/navs/findSelect.png'),
            },{
                key: TABKEY.class,
                name: Lang[Lang.default].tab_class,
                icon: require('../images/navs/class.png'),
                selIcon: require('../images/navs/classSelect.png'),
            },{
                key: TABKEY.car,
                name: Lang[Lang.default].tab_car,
                icon: require('../images/navs/car.png'),
                selIcon: require('../images/navs/carSelect.png'),
            },{
                key: TABKEY.personal,
                name: Lang[Lang.default].tab_personal,
                icon: require('../images/navs/personal.png'),
                selIcon: require('../images/navs/personalSelect.png'),
            }];
        this.updateUrl = null;
        this.alertObject = {
            text: '',
            rightText: Lang[Lang.default].cancel,
            leftText: '打开浏览器更新',
            rightClick: ()=>this.setState({deleteAlert: false,}),
            leftClick: this.linkUpdate_www,
        };
    }

    componentWillMount() {
        this.initDatas();
    }

    componentDidMount() {
    }

    //打开浏览器
    linkUpdate_www = () => {
        if(this.updateUrl) {
            Linking.openURL(this.updateUrl)
            .catch(err => console.error('跳转失败:', err));
        }
    };

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { PathKey, isUpdate, versionInfo, } = params;
            let index = 0, menus = this.Menus;
            if(PathKey) {
                for(let i in menus) {
                    if(menus[i].key == PathKey) {
                        index = i;
                    }
                }
            }
            if(versionInfo) {
                this.alertObject.text = versionInfo.versionTitle || null;
                this.updateUrl = versionInfo.versionUrl || null;
            }
            this.setState({
                initIndex: parseInt(index),
                deleteAlert: isUpdate ? true : false,
            });
        }
    };

    render() {
        const { navigation } = this.props;
        return (
            <ScrollableTabView
                renderTabBar={() => <TabMenu Menus={this.Menus} />}
                locked={true}
                style={styles.flex}
                initialPage={parseInt(this.state.initIndex)}
                tabBarPosition='overlayBottom'
                onChangeTab={(obj) => {
                    this.setState({
                        selectIndex : obj.i,
                    });
                }}
            >
                <View style={styles.flex} tabLabel='Tab1'>
                    <Home navigation={navigation} />
                    {this.state.deleteAlert ?
                        <AlertMoudle visiable={this.state.deleteAlert} {...this.alertObject} />
                        : null
                    }
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