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
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import { NavigationActions } from 'react-navigation';

export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
    }

    componentDidMount() {
        console.log(SplashScreen);
        const { navigation } = this.props;
        this.timer = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                SplashScreen.hide();
                 let resetAction = NavigationActions.reset({
                     index: 0,
                     actions: [
                        NavigationActions.navigate({ routeName: 'TabNav' }),
                    ]
                 });
                 navigation.dispatch(resetAction);
            });
        }, 1200);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.welcomeImg} source={require('../images/logoTitle.png')} />
                <View style={styles.lineStyle} />
                <View style={styles.textBox}>
                    <Text style={styles.defaultFont}>家</Text>
                    <Text style={styles.defaultFont}>乡</Text>
                    <Text style={styles.defaultFont}>·</Text>
                    <Text style={styles.defaultFont}>味</Text>
                    <Text style={styles.defaultFont}>道</Text>
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
    welcomeImg: {
        width: 200,
        height: 45,
    },
    lineStyle: {
        width: 200,
        height: 0,
        borderBottomColor: '#d0d0d0',
        borderBottomWidth: 0.8,
        marginTop: 12,
        marginBottom: 13,
    },
    textBox: {
        width: 112,
        justifyContent: 'space-between',
        flexDirection : 'row',
    },
    defaultFont: {
        color: '#a5a5a5',
        fontSize: 16,
    },
});