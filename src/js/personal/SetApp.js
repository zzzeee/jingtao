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

import User from '../public/user';
import Lang, {str_replace} from '../public/language';
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
            leftText: Lang[Lang.default].cancel,
            rightText: rText || Lang[Lang.default].determine,
            leftClick: ()=>this.setState({deleteAlert: false,}),
            rightClick: func,
        };
        this.setState({deleteAlert: true,});
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    title={'设置'}
                    goBack={true}
                    navigation={navigation}
                />
                <View style={{backgroundColor: '#fff'}}>
                    <TouchableOpacity onPress={()=>{
                        this.showAlertMoudle('是否注销当前帐号', ()=>{
                            _User.delUserID(_User.keyMember)
                            .then(()=>{
                                this.setState({deleteAlert: false,}, ()=>{
                                    // navigation.navigate('Login', {notBack: true, })
                                    let resetAction = NavigationActions.reset({
                                        index: 0,
                                        actions: [
                                            NavigationActions.navigate({routeName: 'Login', params: {notBack: true,}}),
                                        ]
                                    });
                                    navigation.dispatch(resetAction);
                                });
                            });
                        }, '退出');
                    }} style={styles.rowMain}>
                        <Text style={styles.rowText}>帐号注销</Text>
                        <Image source={require('../../images/list_more.png')} style={styles.rowRightIcon} />
                    </TouchableOpacity>
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
        backgroundColor: Color.lightGrey,
    },
    rowMain: {
        width: Size.width - PX.marginLR,
        marginLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        height: PX.rowHeight1,
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
        flexDirection : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowText: {
        fontSize: 14,
        color: Color.lightBack,
    },
    rowRightIcon: {
        width: 26,
        height: 26,
    },
});