/**
 * 个人中心 - 我的订单 - 订单详情
 * @auther linzeyong
 * @date   2017.06.27
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
} from 'react-native';

import Utils from '../../public/utils';
import Urls from '../../public/apiUrl';
import BtnIcon from '../../public/BtnIcon';
import { Size, PX, pixel, Color } from '../../public/globalStyle';
import Lang, {str_replace} from '../../public/language';
import ListFrame from '../../other/ListViewFrame';
import OrderGood from '../../car/OrderGood';
import AppHead from '../../public/AppHead';

export default class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: null,
        };
        this.mToken = null;
        this.orderNum = null;
        this.shopID = null;
        this.shopOrderNum = null;
        this.ref_flatList = null;
    }

    componentWillMount() {
        this.initDatas();
    };

    componentDidMount() {
        this.getOrderInfo();
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { mToken, orderNum, shopID, shopOrderNum, } = params;
            this.mToken = mToken || null;
            this.orderNum = orderNum || null;
            this.shopID = shopID || null;
            this.shopOrderNum = shopOrderNum || null;
        }
    };

    //获取订单信息
    getOrderInfo = () => {
        if(this.mToken && this.orderNum && this.shopID) {
            Utils.fetch(Urls.getOrderDetails, 'post', {
                mToken: this.mToken,
                orderNum: this.orderNum,
                sID: this.shopID,
            }, (result)=>{
                console.log(result);
                if(result && result.sTatus == 1) {
                    this.setState({orders: result.oAry, });
                }
            });
        }
    };

    render() {
        let { navigation } = this.props;
        let listHeadComponent = this.orderComponent();
        return (
            <View style={styles.flex}>
                <AppHead
                    title={Lang[Lang.default].myOrder}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                            navigation.goBack(null);
                    }} src={require("../../../images/back.png")} />)}
                    onPress={()=>{
                        if(this.ref_flatList) {
                            this.ref_flatList.scrollToOffset({offset: 0, animated: true});
                        }
                    }}
                />
                {this.state.orders ?
                    <ListFrame
                        listHead={listHeadComponent}
                        navigation={navigation}
                        get_list_ref={(ref)=>this.ref_flatList=ref}
                    />
                    : null
                }
                {this.titleBtns ?
                    <View style={styles.footBox}>
                        <TouchableOpacity style={styles.btnStyle2}>
                            <Image style={styles.custemIcon} source={require('../../../images/product/custem_center.png')} />
                            <Text style={styles.fontStyle3}>客服</Text>
                        </TouchableOpacity>
                        {this.titleBtns.btns2.length ?
                            <View style={styles.footBoxRight}>
                                {this.titleBtns.btns2.map((item, index)=>{
                                    return (
                                        <TouchableOpacity key={index} style={[styles.btnStyle3, {
                                            backgroundColor: item.bgColor,
                                        }]}>
                                            <Text style={styles.fontStyle4}>{item.val}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            : null
                        }
                    </View>
                    : null
                }
            </View>
        );
    }


    orderComponent = () => {
        let orders = this.state.orders;
        if(!orders) return null;
        let { navigation } = this.props;
        let sOrderInfo = orders.shopOrderAry || {};
        let tOrderInfo = orders.totalOrder || {};
        let sid = sOrderInfo.sId || 0;
        let orderID = sOrderInfo.soID || null;
        let sName = sOrderInfo.sShopName || null;
        let totalNum = sOrderInfo.soNum || 0;
        let freight = parseFloat(sOrderInfo.oExpressMoney) || 0;
        let price = parseFloat(sOrderInfo.soPrice) || 0;
        let totalMoney = freight + price;
        let goods = sOrderInfo.oProAry || [];
        let payid = parseInt(sOrderInfo.oPay) || 0;
        let statuid = parseInt(sOrderInfo.oStatus) || 0;
        let addTime = tOrderInfo.oAddtime || null;
        let payTime = sOrderInfo.oPayTime || null;
        let fhTime = sOrderInfo.oExpressTime || null;
        let name = tOrderInfo.oBuyName || '';
        let phone = tOrderInfo.oBuyPhone || '';
        let area = tOrderInfo.oBuyArea || '';
        let address = tOrderInfo.oBuyAddress || '';
        let oIntegral = parseInt(sOrderInfo.oIntegral) || 0;
        let oScoupon = parseInt(sOrderInfo.oScoupon) || 0;
        this.titleBtns = this.getOrderBtns(payid, statuid, addTime, fhTime);
        console.log(this.titleBtns);
        return (
            <View style={styles.container}>
                <View style={styles.sessionBox}>
                    <Image source={require('../../../images/car/payok_bg.png')} resizeMode="stretch" style={styles.topBoxC1}>
                        <View style={styles.topBoxC1Img}>
                            <View style={styles.topBoxC1ImgLeft}>
                                <Text style={styles.topBoxC1Text1}>{this.titleBtns.text1}</Text>
                                {this.titleBtns.text2 ?
                                    <Text style={styles.topBoxC1Text2}>{this.titleBtns.text2}</Text>
                                    : null
                                }
                            </View>
                            {this.titleBtns.image ?
                                <Image source={this.titleBtns.image} resizeMode="stretch" style={styles.topBoxC1ImgRight} />
                                : null
                            }
                        </View>
                    </Image>
                    <View style={styles.addressBox}>
                        <View style={styles.rowStyle}>
                            <Text style={[styles.fontStyle1, {paddingRight: 20}]}>{Lang[Lang.default].consignee + ': ' + name}</Text>
                            <Text style={styles.fontStyle1}>{Lang[Lang.default].iphone + ': ' + phone}</Text>
                        </View>
                        <View>
                            <Text style={styles.fontStyle1}>{Lang[Lang.default].address + ': ' + area + address}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.sessionBox}>
                    <View style={styles.rowStyle1}>
                        <BtnIcon 
                            text={sName}
                            src={require('../../../images/car/shophead.png')}
                            width={26}
                            press={()=>navigation.navigate('Shop', {shopID: sid})}
                        />
                    </View>
                    <View>
                        {goods.map((item, index)=>{
                            return <OrderGood good={item} key={index} />;
                        })}
                    </View>
                    {this.getPriceRow('商品总金额(不含运费)', price)}
                    {this.getPriceRow('运费', freight)}
                    {this.getPriceRow('优惠券', oScoupon, true, false)}
                    {this.getPriceRow('积分抵现', oIntegral, true, false)}
                </View>
                <View style={styles.sessionBox}>
                    {this.getPriceRow('订单号码', this.orderNum, false)}
                    {this.getPriceRow('下单时间', addTime, false)}
                    {this.getPriceRow('付款时间', payTime, false)}
                    {this.titleBtns.btns1 && this.titleBtns.btns1.length ?
                        <View style={[styles.rowStyle2, {justifyContent: 'center', }]}>
                            {this.titleBtns.btns1.map((item, index)=>{
                                return (
                                    <TouchableOpacity key={index} style={styles.btnStyle} onPress={item.fun}>
                                        <Text style={styles.fontStyle2}>{item.val}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        : null
                    }
                </View>
            </View>
        )
    };

    //价格清单行样式
    getPriceRow = (text, price, isPrice = true, isAdd = true) => {
        if(!price) return null;
        if(isPrice) {
            if(isAdd) {
                price = Lang[Lang.default].RMB + price;
            }else {
                price = '-' + Lang[Lang.default].RMB + price;
            }
        }
        return (
            <View style={styles.rowStyle2}>
                <Text numberOfLines={1} style={styles.fontStyle1}>{text}</Text>
                <Text numberOfLines={1} style={[styles.fontStyle1, {
                    color: (isPrice && !isAdd) ? Color.mainColor : (isPrice ? Color.lightBack : Color.gainsboro),
                }]}>{price}</Text>
            </View>
        );
    };

    /**
     * 返回指定时长的过期时间
     * @param timeStr  string 开始计算时间
     * @param hour     number 几个小时之后
     */
    returnExpressTime = (timeStr, hour) => {
        let _date = '';
        if(timeStr && hour) {
            let time = hour * 60 * 60 * 1000;
            let ntime = new Date().getTime();
            let stime = new Date(timeStr.replace(/-/g, "/")).getTime();
            let _time = time + stime - ntime;
            if(_time > 0) {
                let etime = new Date(ntime + _time);
                let _day = etime.getDate();
                let _month = etime.getMonth() + 1;
                let _hour = etime.getHours();
                let _minute = etime.getMinutes();
                _date = _month + '月' + _day + '日' + _hour + ':' + _minute;
            }else {
                _date = null;
            }
        }
        return _date;
    };

    /**
     * 获取订单标识符和操作按钮等信息
     * @param payid  number 付款状态
     * 注：0 未付款, 1 已付款, 2 已退款
     * @param status number 订单状态
     * 0 确认中, 1 已确认, 2 取消订单, 3 已发货, 4 收货成功, 5 收货失败, 6 申请退换货, 7 申请失败, 8 申请完成
     * @param addTime string 订单生成时间
     * @param fhTime  string 发货时间
     */
    getOrderBtns = (payid, _statuid, addTime, fhTime) => {
        let { showCancel, showAlert, changeOrderStatu, clickPay, } = this.props;
        let statuid = parseInt(_statuid) || 0;
        let expirationDate = '';
        let obj = {
            text1: '',
            text2: '',
            image: null,
            btns1: [],
            btns2: [],
        };

        if(payid == 0) {
            //自动取消
            expirationDate = this.returnExpressTime(addTime, 23);
            if(expirationDate === null) statuid = 2;
        }else if(payid == 1 && statuid == 3) {
            //自动收货
            expirationDate = this.returnExpressTime(fhTime, (15 * 24 - 1));
            if(expirationDate === null) statuid = 4;
        }
        
        if(statuid == 2) {
            obj.text1 = '订单关闭';
            obj.text2 = '订单已取消';
            obj.image = require('../../../images/car/order_close.png');
        }else if(payid == 1) {
            //已付款
            switch(statuid) {
                case 0:
                case 1:
                    //待发货
                    obj.text1 = '付款成功';
                    obj.text2 = '您的宝贝马上就要出仓了';
                    obj.btns1.push({
                        val: '申请退换',
                    });
                    obj.image = require('../../../images/car/payok_right.png');
                    break;
                case 3:
                case 5:
                    //待收货
                    obj.text1 = '商品已发货';
                    obj.text2 = expirationDate + '后将自动确认收货';
                    obj.btns1.push({
                        val: '申请退换',
                    });
                    obj.btns2.push({
                        val: '查看物流',
                        bgColor: Color.orange,
                    });
                    obj.btns2.push({
                        val: '确认收货',
                        bgColor: Color.mainColor,
                    });
                    obj.image = require('../../../images/car/order_yfh.png');
                    break;
                case 4:
                    //交易完成
                    obj.text1 = '交易成功';
                    obj.btns1.push({
                        val: '申请售后',
                    });
                    obj.image = require('../../../images/car/order_finish.png');
                    break;
                case 6:
                    obj.text1 = Lang[Lang.default].applyReturning;
                    break;
                case 7:
                    obj.text1 = Lang[Lang.default].applyFail;
                    break;
                case 8:
                    obj.text1 = Lang[Lang.default].applySuccess;
                    break;
                default:
                    obj.text1 = Lang[Lang.default].cnknownState;
                    break;
            }
        }else if(payid == 2) {
            //已退款
            obj.text1 = '订单' + Lang[Lang.default].isTuiKuan;
        }else {
            //未付款
            obj.text1 = '您还未付款';
            obj.text2 = '订单将在' + expirationDate + '后自动关闭';
            obj.btns2.push({
                val: '取消订单',
                bgColor: Color.orange,
            });
            obj.btns2.push({
                val: '立即付款',
                bgColor: Color.mainColor,
            });
            obj.image = require('../../../images/car/order_dfk.png');
        }
        return obj;
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginTop: PX.marginTB,
    },
    sessionBox: {
        marginBottom: PX.marginTB,
        backgroundColor: '#fff',
    },
    rowStyle1: {
        height: PX.rowHeight2,
        paddingLeft: 10,
        paddingRight: PX.marginLR,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowStyle2: {
        height: PX.rowHeight1,
        marginLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
    },
    fontStyle1: {
        fontSize: 13,
        color: Color.lightBack,
        lineHeight: 20,
    },
    fontStyle2: {
        fontSize: 12,
        color: Color.mainColor,
    },
    fontStyle3: {
        fontSize: 10,
        color: Color.lightBack,
    },
    fontStyle4: {
        fontSize: 14,
        color: '#fff',
    },
    btnStyle: {
        paddingLeft: 38,
        paddingRight: 38,
        height: 27,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: Color.mainColor,
        marginLeft: 5,
        marginRight: 5,
    },
    btnStyle2: {
        justifyContent: 'center',
        alignItems: 'center',
        height: PX.rowHeight1,
        marginLeft: PX.marginLR,
    },
    btnStyle3: {
        width: 90,
        height: PX.rowHeight1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBoxC1Img: {
        height: 120,
        flexDirection : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
    },
    topBoxC1ImgLeft: {
        maxWidth: Size.width - 20 - 20 - 115,
    },
    topBoxC1Text1: {
        fontSize: 20,
        color: '#fff',
    },
    topBoxC1Text2: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, .7)',
        paddingTop: 6,
    },
    topBoxC1ImgRight: {
        width: 115,
        height: 86,
        marginRight: 20,
    },
    addressBox: {
        minHeight: PX.rowHeight1,
        marginLeft: PX.marginLR,
        marginRight: PX.marginLR,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
    },
    rowStyle: {
        flexDirection : 'row',
        alignItems: 'center',
    },
    footBox: {
        height: PX.rowHeight1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    custemIcon: {
        width: 32,
        height: 32,
    },
    footBoxRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});