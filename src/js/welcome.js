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
    Platform,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

import User from './public/user';
import DeviceLog from './public/deviceLog';
import Urls from './public/apiUrl';
import Utils from './public/utils';

var _Device = new DeviceLog();
var _User = new User();
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
        this.isUpdate = false;
        this.versionInfo = null;
        this.maxNumber = 20;
    }

    componentDidMount() {
        this.startAnimated();
        this.getVersionInfo();
        this.appActivityLog();
    }

    //获取版本信息
    getVersionInfo = () => {
        Utils.fetch(Urls.getVersion, 'get', {
            type: Platform.OS === 'ios' ? 2 : 0,
            code: parseInt(DeviceInfo.getBuildNumber()) || 0,
        }, (result)=>{
            console.log(result);
            if(result && result.sTatus == 1 && result.info && result.info.length) {
                let version1 = result.info[0].versionName || null;
                let version2 = DeviceInfo.getVersion() || null;
                if(version1 && version2 && version1 != version2) {
                    let vs1 = version1.split('.') || [];
                    let vs2 = version2.split('.') || [];
                    let vs1_0 = parseInt(vs1[0]) || 0,
                        vs1_1 = parseInt(vs1[1]) || 0,
                        vs1_2 = parseInt(vs1[2]) || 0,
                        vs2_0 = parseInt(vs2[0]) || 0,
                        vs2_1 = parseInt(vs2[1]) || 0,
                        vs2_2 = parseInt(vs2[2]) || 0;
                    if(vs1_0 > vs2_0 || 
                    ((vs1_0 == vs2_0) && (vs1_1 > vs2_1)) || 
                    ((vs1_0 == vs2_0) && (vs1_1 == vs2_1) && (vs1_2 > vs2_2))) {
                        this.isUpdate = true;
                        this.versionInfo = result.info;
                    }
                }
            }
        })
    };

    //活动记录和数据统计
    appActivityLog = () => {
        let dArea = DeviceInfo.getDeviceLocale();   //设备地区
        let dCity = DeviceInfo.getDeviceCountry();  //设备城市
        let userAgent = DeviceInfo.getUserAgent();  //操作系统及版本
        let dName = DeviceInfo.getDeviceName();     //设备名称
        let readableVersion = DeviceInfo.getReadableVersion();
        let version = DeviceInfo.getVersion();      //版本名称
        let buildNumber = DeviceInfo.getBuildNumber();
        let bundleId = DeviceInfo.getBundleId();    //包名
        let systemVersion = DeviceInfo.getSystemVersion();
        let systemName = DeviceInfo.getSystemName();
        let deviceID = DeviceInfo.getDeviceId();
        let model = DeviceInfo.getModel();  //型号
        let brand = DeviceInfo.getBrand();  //品牌
        let manufacturer = DeviceInfo.getManufacturer();    //制造商
        let isEmulator = DeviceInfo.isEmulator();           //是否为虚拟机
        let obj = {
            'userAgent': userAgent.replace(/Android/ig, '安卓系统').replace(/like/ig, '1ike'),
            'deviceName': dName,
            'version': version,
            'buildNumber': buildNumber,
            'bundleId': bundleId,
            'sysVersion': systemVersion,
            'sysName': systemName,
            'deviceID': deviceID,
            'dModel': model,
            'dBrand': brand,
            'manufacturer': manufacturer,
            'isEmulator': isEmulator ? 2 : 1,
        };
        //IOS: APP在重装后,uniqueID会被刷新
        _User.getUserID(_User.keyMember)
        .then((token) => {
            if(token) obj.mToken = token;
            _Device.getDatas()
            .then((result)=>{
                console.log(result);
                let unid = null, vers = null;
                if(result) {
                    unid = result.uniqueID || null;
                    vers = result.version || null;
                    if(unid && (Platform.OS === 'ios') && version == vers) return;
                    if(unid && (unid == DeviceInfo.getUniqueID()) && (Platform.OS === 'android') && version == vers) return;
                }
                if((Platform.OS === 'ios') && unid) {
                    obj.uniqueID = unid;
                }else {
                    obj.uniqueID = DeviceInfo.getUniqueID();
                }
                console.log(obj);
                Utils.fetch(Urls.addDeviceLog, 'post', obj, null);
                _Device.saveDatas(obj.uniqueID, obj.version);
            });
        });
    };

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