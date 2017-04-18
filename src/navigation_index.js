import { AppRegistry } from 'react-native';
import App from './NavigatorDemo/App';

if(!__DEV__){
    global.console = {
        info : () => {},
        log : () => {},
        warn : () => {},
        error : () => {},
    };
}

AppRegistry.registerComponent('jingtao', () => App);
