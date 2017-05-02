import { AppRegistry } from 'react-native';
import { WeiXin } from './js/datas/protect';
import App from './js/';
// import App from './NavigatorDemo/App';
var WeChat=require('react-native-wechat');

if(!__DEV__){
    global.console = {
        info : () => {},
        log : () => {},
        warn : () => {},
        error : () => {},
    };
}

//注册微信应用
WeChat.registerApp(WeiXin.appid);
AppRegistry.registerComponent('jingtao', () => App);