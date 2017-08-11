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
  ScrollView,
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
            updateType: null,
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
            textView: null,
            rightText: '稍后再说',
            leftText: '立即下载',
            rightClick: ()=>this.setState({deleteAlert: false,}),
            leftClick: this.linkUpdate_www,
            contentStyle: styles.updateBox,
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
            let type = 0;
            if(versionInfo && versionInfo.length > 0) {
                this.alertObject.textView = (
                    <ScrollView contentContainerStyle={styles.scollStyle}>
                        {versionInfo.map((item, index)=>{
                            let contents = item.versionInfo || [];
                            let title = item.versionTitle || null;
                            let code = item.versionName || null;
                            let _type = item.versionType || null;
                            if(item.versionUrl && !this.updateUrl) this.updateUrl = item.versionUrl;
                            if(_type && type != 9) type = _type;
                            return (
                                <View key={index} style={{
                                    marginBottom: (index + 1 == versionInfo.length) ? 0 : 20,
                                }}>
                                    <Text numberOfLines={2} style={styles.updateTitle}>{title}</Text>
                                    <Text numberOfLines={2} style={styles.versionCode}>
                                        {_type == 9 ? `${code} (强制更新)` : code}
                                    </Text>
                                    {contents.map((item2, index2) => {
                                        return <Text key={index2} style={styles.updateText}>{item2}</Text>;
                                    })}
                                </View>
                            )
                        })}
                    </ScrollView>
                );
            }
            this.setState({
                initIndex: parseInt(index),
                deleteAlert: isUpdate ? true : false,
                updateType: type,
            });
        }
    };

    render() {
        const { navigation } = this.props;
        let { updateType, initIndex, selectIndex, deleteAlert } = this.state;
        if(updateType == 9) {
            this.alertObject.rightColor = Color.gray;
            this.alertObject.rightClick = null;
            return <AlertMoudle visiable={deleteAlert} {...this.alertObject} />;
        }
        return (
            <ScrollableTabView
                renderTabBar={() => <TabMenu Menus={this.Menus} />}
                locked={true}
                style={styles.flex}
                initialPage={parseInt(initIndex)}
                tabBarPosition='overlayBottom'
                onChangeTab={(obj) => {
                    this.setState({
                        selectIndex : obj.i,
                    });
                }}
            >
                <View style={styles.flex} tabLabel='Tab1'>
                    <Home navigation={navigation} />
                    {deleteAlert ?
                        <AlertMoudle visiable={deleteAlert} {...this.alertObject} />
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
                    <Car navigation={navigation} selectIndex={selectIndex} />
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
    scollStyle: {
        width: Size.width * 0.8 - 30,
    },
    updateBox : {
        alignItems: 'flex-start',
        backgroundColor: Color.floralWhite,
        maxHeight: Size.height * 0.4,
    },
    updateTitle: {
        color: Color.mainColor,
        fontSize: 14,
        lineHeight: 22,
        paddingBottom: 2,
        fontWeight: 'bold',
        textShadowColor: '#ccc',
        textShadowOffset: {
            width: 1,
            height: 1.6,
        },
        textShadowRadius: 2,
    },
    versionCode: {
        paddingBottom: 10,
        fontSize: 12,
        color: Color.gray,
    },
    updateText: {
        color: Color.lightBack,
        fontSize: 12,
        lineHeight: 20,
    },
});