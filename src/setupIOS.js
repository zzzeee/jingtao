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
WeChat.registerApp(WeiXin.appid);
AppRegistry.registerComponent('jingtao', () => JingtaoApp);