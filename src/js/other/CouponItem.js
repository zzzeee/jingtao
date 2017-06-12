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

import Toast from 'react-native-root-toast';
import Utils from '../public/utils';
import Urls from '../public/apiUrl';
import { Size, pixel, Color, PX, errorStyles } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class CouponItem extends Component {
    // 参数类型
    static propTypes = {
        type: React.PropTypes.number.isRequired,
        width: React.PropTypes.number.isRequired,
        coupon: React.PropTypes.object.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            receive: false,
        };
    }

    componentWillMount() {
        let { coupon } = this.props;
        console.log(coupon);
        if(coupon) {
            let id = coupon.hID || 0;
            let isReceive = this.isReceiveCoupon(id);
            this.setState({
                receive: isReceive,
            });
        }
    }

    componentWillUnmount() {
        // 请注意Un"m"ount的m是小写

        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    //检查时间是否带有时分秒
    checkTimeString = (t) => {
        if(t) {
            let str = t.replace(/-/g, "/") || '';
            if(str && str.length <= 10 && str.indexOf(':') < 0) {
                str = str + ' 00:00:00';
            }
            return str
        }
        return t;
    };

    //点击领取优惠券
    clickCoupon = (id) => {
        let that = this;
        let { userid, callback, } = this.props;
        if(id && id > 0 && userid && !this.state.receive) {
            Utils.fetch(Urls.userGiveCoupon, 'POST', {
                hID: id,
                mToken: userid,
            }, (result)=>{
                // console.log(result);
                if(result) {
                    let ret = result.sTatus || 0;
                    let msg = result.sMessage || null;
                    if(msg) {
                        that.timer = Toast.show(msg, {
                            duration: Toast.durations.LONG,
                            position: Toast.positions.CENTER,
                            hideOnPress: true,
                        });
                    }
                    if(ret == 1 || ret == 5) {
                        this.setState({receive: true}, ()=>{
                            callback && callback(id);
                        });
                    }
                }
            }, null, {
                catchFunc: (err) => {
                    console.log('获取数据出错');
                    console.log(err);
                    alert(Lang[Lang.default].serverError);
                },
            });
        }
    };

    //判断优惠券是否被领取
    isReceiveCoupon = (id) => {
        let isok = true;
        let _id = parseInt(id) || 0;
        let list = this.props.giveList || [];
        if(_id > 0 && list && list.length) {
            for(let i in list) {
                if(_id == list[i]) {
                    isok = false;
                    break;
                }
            }
        }
        return !isok;
    };

    render() {
        let { type, width, style, coupon, backgroundColor } = this.props;
        if(!coupon || !type) return null;
        let leftRatio = 0.345; // 优惠券左边比率
        let id = coupon.hID || 0;
        let sid = coupon.sId || 0;
        let stime = coupon.hStartTime || null;
        let etime = coupon.hSendTime || null;
        let ntime = new Date().getTime();
        let isable = coupon.isable || 0;
        let money = parseFloat(coupon.hMoney) || null;
        let maxMoney = parseFloat(coupon.hUseMoney) || null;
        stime = this.checkTimeString(stime);
        etime = this.checkTimeString(etime);
        let _stime = new Date(stime).getTime();
        let _etime = new Date(etime).getTime();
        let color = sid > 0 ? Color.orange : Color.mainColor;
        let sname = sid > 0 ? Lang[Lang.default].shopCurrency : Lang[Lang.default].appCurrency;
        let hname = coupon.hName || null;
        let bgColor = backgroundColor ? backgroundColor : '#fff';
        let couponBg = null, height = null;
        if(type == 1) {
            height = 120;
            couponBg = sid > 0 ?
                require('../../images/find/coupons_bg_shop.png') :
                require('../../images/find/coupons_bg_self.png');
            if(this.state.receive) {
                color = Color.gray;
                couponBg = require('../../images/find/coupons_bg_out.png');
            }
        }else if(type == 2) {
            height = 116;
            couponBg = sid > 0 ?
                require('../../images/car/coupons_bg_shop.png') :
                require('../../images/car/coupons_bg_self.png');
            if(this.state.receive) {
                color = Color.gray;
                couponBg = require('../../images/car/coupons_bg_out.png');
            }
        }
        if(id > 0 && ntime > _stime && ntime < _etime) {
            return (
                <View style={style}>
                    <TouchableOpacity 
                        activeOpacity={1}
                        disabled={this.state.receive}
                        style={{backgroundColor: bgColor}}
                        onPress={()=>{
                            this.clickCoupon(id);
                        }}
                    >
                        <Image source={couponBg} style={{width: width, height: height}} resizeMode="stretch">
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
                                <Image source={require('../../images/car/receive.png')} style={{
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