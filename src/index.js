/**
 * APP统一入口文件
 * @auther linzeyong
 * @date   2017.06.02
 */

import React, { Component } from 'react';
import { 
    AppRegistry,
    StatusBar,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { WeiXin } from './js/datas/protect';
import App from './js/';
// import App from './NavigatorDemo/App';
var WeChat=require('react-native-wechat');
import JPushModule from 'jpush-react-native';
import codePush from "react-native-code-push";
import { Color, PX } from './js/public/globalStyle';

if(!__DEV__){
    global.console = {
        info : () => {},
        log : () => {},
        warn : () => {},
        error : () => {},
    };
}

class JingtaoApp extends Component {
    componentDidMount() {
        JPushModule.notifyJSDidLoad();
        JPushModule.addReceiveCustomMsgListener((map) => {
            console.log("addReceiveCustomMsgListener: ");
            console.log(map);
        });
        JPushModule.addReceiveNotificationListener((map) => {
            //收到通知
            console.log("收到通知 addReceiveNotificationListener: ");
            console.log(map);
        });
        JPushModule.addReceiveOpenNotificationListener((map) => {
            //打开通知
            console.log("打开通知 addReceiveOpenNotificationListener: ");
            console.log(map);
        });
        JPushModule.addGetRegistrationIdListener((registrationId) => {
            console.log("addGetRegistrationIdListener: ");
            console.log("Device register succeed, registrationId " + registrationId);
        });
        codePush.sync();
    }

    componentWillUnmount() {
        JPushModule.removeReceiveCustomMsgListener();
        JPushModule.removeReceiveNotificationListener();
        JPushModule.removeReceiveOpenNotificationListener();
        JPushModule.removeGetRegistrationIdListener();
    }

    render() {
        return (
            <View style={styles.flex}>
                <StatusBar backgroundColor={Color.mainColor} barStyle="light-content" />
                <View style={{
                    height: (Platform.OS === 'ios') ? PX.statusHeight : 0,
                    backgroundColor: Color.mainColor,
                }} />
                <View style={styles.container}>
                    <App />
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
        backgroundColor: '#FFF',
    },
});

//注册微信应用
WeChat.registerApp(WeiXin.appid);
AppRegistry.registerComponent('jingtao', () => JingtaoApp);