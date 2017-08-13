/**
 * 个人中心 - 设置
 * @auther linzeyong
 * @date   2017.07.07
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

import User from '../public/user';
import Lang, {str_replace, TABKEY} from '../public/language';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import AlertMoudle from '../other/AlertMoudle';

var _User = new User();

export default class SetApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteAlert: false,
        };
    }

    //显示删除提示框
    showAlertMoudle = (msg, func, rText = null) => {
        this.alertObject = {
            text: msg,
            rightText: Lang[Lang.default].cancel,
            leftText: rText || Lang[Lang.default].determine,
            rightClick: ()=>this.setState({deleteAlert: false,}),
            leftClick: func,
        };
        this.setState({deleteAlert: true,});
    };

    render() {
        let { navigation, } = this.props;
        let version = DeviceInfo.getVersion() || '';
        let params = (navigation && navigation.state.params) ? navigation.state.params : {};
        let login = params.login ? true : false;
        return (
            <View style={styles.flex}>
                <AppHead
                    title={'设置'}
                    goBack={true}
                    navigation={navigation}
                />
                <View style={styles.container}>
                    <View style={styles.aboveBox}>
                        <Image source={require('../../images/logo2.png')} style={{
                            width: 60,
                            height: 60,
                        }} />
                        <Text style={styles.fontSize1}>境淘土特产</Text>
                        <Text style={styles.fontSize2}>{'版本号 ' + version}</Text>
                    </View>
                    <View style={styles.belowBox}>
                        <TouchableOpacity onPress={()=>{
                            if(!login) return;
                            this.showAlertMoudle('是否注销当前帐号', ()=>{
                                _User.delUserID(_User.keyMember)
                                .then(()=>{
                                    this.setState({deleteAlert: false,}, ()=>{
                                        // navigation.navigate('Login', {
                                        //     leftPress: () => navigation.navigate('TabNav', {
                                        //         PathKey: TABKEY.personal,
                                        //     }),
                                        // });
                                        let resetAction = NavigationActions.reset({
                                            index: 0,
                                            actions: [
                                                NavigationActions.navigate({routeName: 'TabNav', params: {
                                                    PathKey: TABKEY.personal,
                                                }}),
                                            ]
                                        });
                                        navigation.dispatch(resetAction);
                                    });
                                });
                            }, '退出');
                        }} style={styles.btnLogOut}>
                            <Text style={styles.fontSize3}>退出登录</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.deleteAlert ?
                    <AlertMoudle visiable={this.state.deleteAlert} {...this.alertObject} />
                    : null
                }
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
        backgroundColor: Color.floralWhite,
        justifyContent: 'space-between',
    },
    aboveBox: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    belowBox: {
        marginBottom: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnLogOut: {
        borderWidth: 1,
        borderColor: Color.mainColor,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: Size.width - 30,
        height: PX.rowHeight2,
    },
    fontSize1: {
        fontSize: 16,
        color: Color.lightBack,
        fontWeight: 'bold',
        paddingTop: 5,
        backgroundColor: 'transparent',
    },
    fontSize2: {
        fontSize: 12,
        color: Color.lightBack,
        paddingTop: 3,
        backgroundColor: 'transparent',
    },
    fontSize3: {
        fontSize: 14,
        color: Color.mainColor,
        backgroundColor: 'transparent',
    },
});