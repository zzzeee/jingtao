import { AppRegistry } from 'react-native';
import App from './js/';
// import App from './NavigatorDemo/App';
// var WeChat=require('react-native-wechat');

if(!__DEV__){
    global.console = {
        info : () => {},
        log : () => {},
        warn : () => {},
        error : () => {},
    };
}

//注册微信应用
// WeChat.registerApp('wx220dd5779654cdf7');
AppRegistry.registerComponent('jingtao', () => App);