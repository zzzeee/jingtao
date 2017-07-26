/**
 * 欢迎页
 * @auther linzeyong
 * @date   2017.06.29
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    InteractionManager,
    Animated,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

import Urls from './public/apiUrl';
import Utils from './public/utils';

var imgHeight = 45; //图片高度
var lineMax = 210;  //中间线的展开长度
var imgMax = 12;    //图片向上移动的距离
var txtMax = 13;    //文字向下移动的距离
var txtDelay = 210; //文字动画间隔

export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineWidth: new Animated.Value(0),
            logoTop: new Animated.Value(imgHeight + imgMax),
            txtTop1: new Animated.Value(-20),
            txtTop2: new Animated.Value(-20),
            txtTop3: new Animated.Value(-20),
            txtTop4: new Animated.Value(-20),
            txtTop5: new Animated.Value(-20),
            txtOpc1: new Animated.Value(0),
            txtOpc2: new Animated.Value(0),
            txtOpc3: new Animated.Value(0),
            txtOpc4: new Animated.Value(0),
            txtOpc5: new Animated.Value(0),
        };
        this.timer = null;
        this.isUpdate = false;
        this.versionInfo = null;
    }

    componentDidMount() {
        this.getVersionInfo();
        this.startAnimated();
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        
    }

    getVersionInfo = () => {
        Utils.fetch(Urls.getVersion, 'get', {}, (result)=>{
            if(result && result.info && result.sTatus == 1) {
                let version1 = result.info.versionCode || null;
                let version2 = DeviceInfo.getVersion() || null;
                if(version1 && version2) {
                    if(version1 != version2) {
                        this.isUpdate = true;
                        this.versionInfo = result.info;
                    }
                }
            }
        })
    }

    //跳转至首页
    gotoHome = () => {
        const { navigation } = this.props;
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ 
                    routeName: 'TabNav',
                    params: {
                        isUpdate: this.isUpdate,
                        versionInfo: this.versionInfo,
                    }
                }),
            ]
        });
        navigation.dispatch(resetAction);
    };

    //开始播放动画
    startAnimated = () => {
        let that = this;
        Animated.sequence([
            Animated.timing(this.state.lineWidth, {
                toValue: lineMax,
                duration: 510,  //持续
            }),
            Animated.parallel([
                Animated.timing(this.state.logoTop, {
                    toValue: 0,
                    delay: 0,        //延迟
                    duration: 1200,  //持续
                }),
                that.textAnimated('txtTop1', 'txtOpc1', txtDelay * 0),
                that.textAnimated('txtTop2', 'txtOpc2', txtDelay * 1),
                that.textAnimated('txtTop3', 'txtOpc3', txtDelay * 2),
                that.textAnimated('txtTop4', 'txtOpc4', txtDelay * 3),
                that.textAnimated('txtTop5', 'txtOpc5', txtDelay * 4),
            ]),
        ]).start(this.gotoHome);
    };

    //文字动画
    textAnimated = (key1, key2, delay) => {
        return Animated.parallel([
            Animated.timing(this.state[key1], {
                toValue: txtMax,
                delay: delay,    //延迟
                duration: 1000,  //持续
            }),
            Animated.timing(this.state[key2], {
                toValue: 1,
                delay: delay,    //延迟
                duration: 1000,  //持续
            }),
        ]);
    };

    render() {
        let { 
            lineWidth, 
            logoTop, 
            txtTop1, 
            txtTop2, 
            txtTop3, 
            txtTop4, 
            txtTop5, 
            txtOpc1,
            txtOpc2,
            txtOpc3,
            txtOpc4,
            txtOpc5,
        } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.welcomeImgBox}>
                    <Animated.Image style={[styles.welcomeImg, {
                        top: logoTop,
                    }]} source={require('../images/logoTitle.jpg')} />
                </View>
                <View style={styles.lineBox}>
                    <Animated.View style={[styles.lineStyle, {
                        width: lineWidth,
                    }]} />
                </View>
                <View style={styles.textBox}>
                    <Animated.Text style={[styles.defaultFont, {
                        left: 0,
                        top: txtTop1,
                        opacity: txtOpc1,
                    }]}>家</Animated.Text>
                    <Animated.Text style={[styles.defaultFont, {
                        left: 24 + 2,
                        top: txtTop2,
                        opacity: txtOpc2,
                    }]}>乡</Animated.Text>
                    <Animated.Text style={[styles.defaultFont, {
                        left: 48,
                        top: txtTop3,
                        opacity: txtOpc3,
                    }]}>·</Animated.Text>
                    <Animated.Text style={[styles.defaultFont, {
                        left: 72 - 2,
                        top: txtTop4,
                        opacity: txtOpc4,
                    }]}>味</Animated.Text>
                    <Animated.Text style={[styles.defaultFont, {
                        left: 96,
                        top: txtTop5,
                        opacity: txtOpc5,
                    }]}>道</Animated.Text>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeImgBox: {
        width: 200,
        height: imgHeight + imgMax,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
    },
    welcomeImg: {
        width: 200,
        height: imgHeight,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    lineBox: {
        width: lineMax,
        height: 1,
    },
    lineStyle: {
        width: lineMax,
        height: 0,
        borderBottomColor: '#d0d0d0',
        borderBottomWidth: 0.8,
    },
    textBox: {
        width: 112,
        minHeight: 50,
        justifyContent: 'space-between',
        flexDirection : 'row',
    },
    defaultFont: {
        color: '#a5a5a5',
        fontSize: 16,
        position: 'absolute',
        width: 16,
        textAlign: 'center',
    },
});