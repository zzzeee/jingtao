/**
 * 购物车 - 提交订单 - 订单帮助说明
 * @auther linzeyong
 * @date   2017.06.20
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
import BtnIcon from '../public/BtnIcon';

export default class OrderHelp extends Component {
    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    title={'订单帮助'}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                            navigation.goBack(null);
                    }} src={require("../../images/back.png")} />)}
                />
                <ScrollView>
                    <View style={styles.sessionBox}>
                        <Text style={styles.txtStyle1}>遇到问题？</Text>
                        <Text style={styles.txtStyle2}>当您下单购买多家店铺的商品并使用优惠券后,您并未马上付款。由于系统限制,分开的订单将无法使用优惠券。</Text>
                    </View>
                    <View style={styles.sessionBox}>
                        <Text style={styles.txtStyle1}>解决方法</Text>
                        <Text style={styles.txtStyle2}>您可以取消订单后重新下单购买,金额达到条件即可使用满减优惠券。</Text>
                    </View>
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
    sessionBox: {
        paddingTop: 30,
        paddingBottom: 20,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    txtStyle1: {
        fontSize: 16,
        color: Color.mainColor,
        marginBottom: 20,
    },
    txtStyle2: {
        fontSize: 13,
        color: Color.lightBack,
        lineHeight: 17,
    },
});