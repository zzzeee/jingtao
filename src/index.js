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
    Image,
    Alert,
} from 'react-native';
import { WeiXin } from './js/datas/protect';
import App from './js/';
// import App from './NavigatorDemo/App';
var WeChat = require('react-native-wechat');
import JPushModule from 'jpush-react-native';
import CodePush from "react-native-code-push";
import { Size, Color, PX } from './js/public/globalStyle';
// import {
//     Code_Push_Production_IOS,
//     Code_Push_Staging_IOS,
//     Code_Push_Production_Android,
//     Code_Push_Staging_Android,
// } from './js/datas/protect';

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

        // 直接更新
        if(!__DEV__) CodePush.sync();
        
        // let codePushKey = Platform.OS === 'ios' ? Code_Push_Production_IOS : Code_Push_Production_Android;
        // CodePush.checkForUpdate(codePushKey).then((update)=>{
        //     console.log(update);
        //     if(!update){
        //         alert("提示: 已是最新版本!!!");
        //     }else {
        //         CodePush.sync({
        //             deploymentKey: codePushKey,
        //             installMode: CodePush.InstallMode.IMMEDIATE,//启动模式三种：ON_NEXT_RESUME、ON_NEXT_RESTART、IMMEDIATE
        //             updateDialog: {
        //                 appendReleaseDescription:true,//是否显示更新description，默认为false
        //                 descriptionPrefix:"更新内容：",//更新说明的前缀。 默认是” Description:
        //                 mandatoryContinueButtonLabel:"立即更新",//强制更新的按钮文字，默认为continue
        //                 mandatoryUpdateMessage: "必须强制更新", //- 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
        //                 optionalIgnoreButtonLabel: '稍后',     //非强制更新时，取消按钮文字,默认是ignore
        //                 optionalInstallButtonLabel: '后台更新',//非强制更新时，确认文字. Defaults to “Install”
        //                 optionalUpdateMessage: '有新版本了，是否更新？',//非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
        //                 title: '更新提示'//要显示的更新通知的标题. Defaults to “Update available”.
        //             },
        //         });
        //     }
        // });
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
                {(Platform.OS === 'ios') ?
                    <View style={{
                        height: PX.statusHeight,
                        backgroundColor: Color.mainColor,
                    }} />
                    : null
                }
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
if(__DEV__ && Platform.OS === 'android') {
    WeChat.registerApp(WeiXin.appid2);
}else {
    WeChat.registerApp(WeiXin.appid);
}

AppRegistry.registerComponent('jingtao', () => JingtaoApp);