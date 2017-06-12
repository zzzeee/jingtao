/**
 * 个人中心 - 测试页面集合
 * @auther linzeyong
 * @date   2017.05.19
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
    ScrollView,
    WebView,
} from 'react-native';

import Urls from '../public/apiUrl';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, { str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import WebIM from '../../webim/Lib/WebIM';
// console.log(WebIM);
var conn = WebIM.conn;

export default class TestPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        let that = this;
        conn.listen({
            onOpened: function ( message ) {          //连接成功回调
                // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
                // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
                // 则无需调用conn.setPresence();   
                console.log('连接成功！！！！');
                conn.setPresence();
            }, 
            onTextMessage: function (message) {
                console.log(message);
            },
        });
        var options = { 
            apiUrl: WebIM.config.apiURL,
            user: 'zzz',
            pwd: '123456',
            appKey: WebIM.config.appkey
        };
        conn.open(options);
    }

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead
                    title='测试集合'
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                         navigation.goBack(null);
                    }} src={require("../../images/back.png")} />)}
                />
                <ScrollView contentContainerStyle={styles.container}>
                    <Button title="发送给abc" onPress={()=>{
                        this.sendMsg('abc');
                    }} />
                    <Button title="发送给admin" onPress={()=>{
                        this.sendMsg('admin');
                    }} />
                </ScrollView>
            </View>
        );
    }

    sendMsg = (toName) => {
         var id = conn.getUniqueId();               // 生成本地消息id
        var msg = new WebIM.message('txt', id);     // 创建文本消息
        msg.set({
            msg: '来自ReactNative的信息！',          // 消息内容
            to: toName,                             // 接收消息对象（用户id）
            roomType: false,
            success: function (id, serverMsgId) {
                console.log('send private text Success');
            }
        });
        msg.body.chatType = 'singleChat';
        conn.send(msg.body);
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        backgroundColor: Color.lightGrey,
    },
    Square: {
        width: Size.width,
        height: Size.height,
    },
});