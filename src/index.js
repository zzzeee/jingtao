import { AppRegistry } from 'react-native';
import App from './js/main';

if(!__DEV__){
    global.console = {
        info : () => {},
        log : () => {},
        warn : () => {},
        error : () => {},
    };
}

AppRegistry.registerComponent('jingtao', () => App);