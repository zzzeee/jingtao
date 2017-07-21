/**
 * 浦发信用卡办理 - 登录说明
 * @auther linzeyong
 * @date   2017.07.05
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import Lang, {str_replace, Privacy} from '../public/language';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';

export default class LoginExplain extends Component {
    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    title={'登录说明'}
                    goBack={true}
                    navigation={navigation}
                />
                <ScrollView contentContainerStyle={styles.scrollStyle}>
                    <Text style={styles.titleStyle}>未注册用户, 请按以下步骤登录帐号。</Text>
                    <Text style={styles.defaultFont}>{"1 从“首页”底部导航栏处进入“个人中心”。"}</Text>
                    <View style={styles.imgBox}>
                        <Image style={styles.imgStyle1} source={require('../../images/find/explain1.jpg')} />
                    </View>
                    <Text style={styles.defaultFont}>{"2 在“个人中心”, 点击“登录”按钮。"}</Text>
                    <View style={styles.imgBox}>
                        <Image style={styles.imgStyle2} source={require('../../images/find/explain2.jpg')} />
                    </View>
                    <Text style={styles.defaultFont}>{"3 在“登录”页面, 点击“忘记密码”。"}</Text>
                    <View style={styles.imgBox}>
                        <Image style={styles.imgStyle2} source={require('../../images/find/explain3.jpg')} />
                    </View>
                    <Text style={styles.defaultFont}>{"4 在“忘记密码”页面中, 根据页面提示要求进入操作, 重新设置密码。"}</Text>
                    <View style={styles.imgBox}>
                        <Image style={styles.imgStyle2} source={require('../../images/find/explain4.jpg')} />
                    </View>
                    <Text style={styles.defaultFont}>{"5 最后, 使用新密码登录即可。"}</Text>
                </ScrollView>
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
    scrollStyle: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 50,
        marginTop: 10,
        backgroundColor: '#fff',
    },
    titleStyle: {
        fontSize: 14,
        color: Color.mainColor,
        marginTop: 22,
        marginBottom: 22,
    },
    defaultFont: {
        fontSize: 13,
        color: Color.lightBack,
        lineHeight: 18,
    },
    imgBox: {
        alignItems: 'center',
    },
    imgStyle1: {
        width: Size.width * 0.9,
        height: Size.width * 0.12,
        marginTop: 20,
        marginBottom: 50,
    },
    imgStyle2: {
        width: Size.width * 0.45,
        height: Size.width * 0.8,
        marginTop: 20,
        marginBottom: 50,
    },
});