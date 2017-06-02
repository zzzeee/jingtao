/**
 * 优惠券模块
 * @auther linzeyong
 * @date   2017.05.27
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import Urls from '../public/apiUrl';
import { Size, pixel, Color, PX, errorStyles } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class CouponItem extends Component {
    // 参数类型
    static propTypes = {
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        coupon: React.PropTypes.object.isRequired,
        leftRatio: React.PropTypes.number,
    };
    constructor(props) {
        super(props);
        this.state = {
            receive: false,
        };
    }

    render() {
        let { width, height, coupon, leftRatio, backgroundColor } = this.props;
        if(!coupon) return null;
        let id = coupon.hID || 0;
        let sid = coupon.sId || 0;
        let stime = coupon.hStartTime || null;
        let etime = coupon.hSendTime || null;
        let ntime = new Date().getTime();
        let isable = coupon.isable || 0;
        let money = parseFloat(coupon.hMoney) || null;
        let maxMoney = parseFloat(coupon.hUseMoney) || null;
        let _stime = new Date(stime).getTime();
        let _etime = new Date(etime).getTime();
        let color = sid > 0 ? Color.orange : Color.mainColor;
        let sname = sid > 0 ? '商城通用' : '入驻商名称';
        let hname = coupon.hName || null;
        let bgColor = backgroundColor ? backgroundColor : '#fff';
        let bg = sid > 0 ?
                require('../../images/find/coupons_bg_shop.png') :
                require('../../images/find/coupons_bg_self.png');
        if(this.state.receive) {
             color = Color.gray;
             bg = require('../../images/find/coupons_bg_out.png');
        }
        if(id > 0 && ntime > _stime && ntime < _etime) {
            return (
                <View style={styles.flex}>
                    <TouchableOpacity activeOpacity={1} style={{backgroundColor: bgColor}} onPress={()=>{
                        this.setState({receive: true});
                    }}>
                        {/* <Image source={{uri: Urls.getCouponImages + id}} resizeMode="stretch" style={{flex: 1}} /> */}
                        <Image source={bg} style={{width: width, height: height}} resizeMode="stretch">
                            <View style={[styles.rowStyle, {flex: 1, height: height}]}>
                                <View style={[styles.couponsLeft, {height: height, width: width * leftRatio}]}>
                                    <View style={styles.rowStyle}>
                                        <Text style={{color: color, fontSize: 14, paddingTop: 10}}>{Lang[Lang.default].RMB}</Text>
                                        <Text style={{color: color, fontSize: 27, paddingLeft: 3}}>{money}</Text>
                                    </View>
                                    <Text numberOfLines={1} style={styles.maxMoneyText}>
                                        {str_replace(Lang[Lang.default].howMuch, maxMoney)}
                                    </Text>
                                </View>
                                <View style={[styles.couponsRight, {height: height}]}>
                                    <Text numberOfLines={1} style={[styles.couponShopName, {backgroundColor: color,}]}>
                                        {sname}
                                    </Text>
                                    <Text numberOfLines={1} style={styles.couponName}>{hname}</Text>
                                    <Text numberOfLines={1} style={styles.couponDate}>
                                        {Lang[Lang.default].usePeriod + ':' + stime.substr(0, 10) + ' - ' + etime.substr(0, 10)}
                                    </Text>
                                </View>
                            </View>
                            {this.state.receive ?
                                <Image source={require('../../images/receive.png')} style={{
                                    width: height, 
                                    height: height,
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                }} />
                                : null
                            }
                        </Image>
                    </TouchableOpacity>
                </View>
            );
        }else {
            return null;
        }
    }
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    couponsLeft: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
    },
    maxMoneyText: {
        fontSize: 13, 
        color: Color.lightBack,
        marginTop: 5,
    },
    couponsRight: {
        flex: 1, 
        marginLeft: 12,
        justifyContent: 'center',
    },
    couponShopName: {
        fontSize: 11,
        paddingBottom: 3,
        paddingTop: 3,
        paddingLeft: 8,
        paddingRight: 8,
        color: '#fff',
        borderRadius: 4.5,
        position: 'absolute',
        left: 0,
        top: 15,
    },
    couponName: {
        fontSize: 14, 
        color: Color.lightBack,
    },
    couponDate: {
        fontSize: 11,
        color: Color.lightGrey,
        position: 'absolute',
        left: 0,
        bottom: 20,
    },
});