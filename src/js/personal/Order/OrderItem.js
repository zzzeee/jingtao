/**
 * 订单框架
 * @auther linzeyong
 * @date   2017.06.23
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
import Nothing from '../../other/ListNothing';
import OrderGood from '../../car/OrderGood';

export default class OrderComponent extends Component {
    // 默认参数
    static defaultProps = {
        orderType: null,
    };
    // 参数类型
    static propTypes = {
        mToken: React.PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            isDelete: false,
        };
    }

    render() {
        let { navigation, orderInfo } = this.props;
        if(!orderInfo || this.state.isDelete) return null;
        let sid = orderInfo.sId || 0;
        let orderID = orderInfo.soID || null;
        let sName = orderInfo.sShopName || null;
        let totalNum = orderInfo.soNum || 0;
        let freight = parseFloat(orderInfo.oExpressMoney) || 0;
        let price = parseFloat(orderInfo.soPrice) || 0;
        let totalMoney = freight + price;
        let goods = orderInfo.oProduct || [];
        let payid = parseInt(orderInfo.oPay) || 0;
        let statuid = parseInt(orderInfo.oStatus) || 0;
        let orderTitleBtns = this.getOrderBtns(payid, statuid);
        return (
            <View style={styles.boxStyle}>
                <View style={styles.rowStyle1}>
                    <BtnIcon 
                        text={sName}
                        src={require('../../../images/car/shophead.png')}
                        width={26}
                        press={()=>navigation.navigate('Shop', {shopID: sid})}
                    />
                    <Text style={styles.fontStyle3}>{orderTitleBtns.text}</Text>
                </View>
                <View>
                    {goods.map((item, index)=>{
                        return <OrderGood good={item} key={index} />;
                    })}
                </View>
                <View style={styles.rowStyle2}>
                    <Text style={[styles.fontStyle1, {
                        marginRight: 15,
                    }]}>{str_replace(Lang[Lang.default].totalProductNumberL, totalNum)}</Text>
                    <Text style={styles.fontStyle1}>
                        {Lang[Lang.default].total2 + ': '}
                        <Text style={styles.fontStyle2}>{Lang[Lang.default].RMB + totalMoney}</Text>
                        {str_replace(Lang[Lang.default].containPostage, freight)}
                    </Text>
                </View>
                <View style={styles.rowStyle2}>
                    {orderTitleBtns.btns.map((item, index)=>{
                        return (
                            <TouchableOpacity key={index} onPress={()=>{
                                if(item.fun && orderID) {
                                    item.fun(orderID);
                                }
                            }} style={[styles.btnStyle, {
                                borderColor: item.red ? Color.mainColor : Color.lightBack,
                            }]}>
                                <Text style={{
                                    fontSize: 11,
                                    color: item.red ? Color.mainColor : Color.lightBack,
                                }}>{item.val}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    }

    /**
     * 获取订单标识符和操作按钮等信息
     * @param payid  number 付款状态
     * 注：0 未付款, 1 已付款, 2 已退款
     * @param status number 订单状态
     * 0 确认中, 1 已确认, 2 取消订单, 3 已发货, 4 收货成功, 5 收货失败, 6 申请退换货, 7 申请失败, 8 申请完成
     */
    getOrderBtns = (payid, _statuid,) => {
        let { showCancel, showAlert, changeOrderStatu, clickPay, } = this.props;
        let statuid = parseInt(_statuid) || 0;
        let obj = {
            text: '',
            btns: [{
                val: Lang[Lang.default].contactWaiter,
                red: false,
                fun: ()=>{
                    Linking.openURL('tel: ' + Lang.telephone)
                    .catch(err => console.error('调用电话失败！', err));
                }
            }],
        };
        if(statuid == 2) {
            obj.text = Lang[Lang.default].shopClose;
        }else if(payid == 1) {
            //已付款
            obj.text = Lang[Lang.default].daishouhuo;
            switch(statuid) {
                case 0:
                case 1:
                    //待发货
                    obj.btns.push({
                        val: Lang[Lang.default].applyReturn,
                        red: false,
                    });
                    obj.text = Lang[Lang.default].daifahuo;
                    break;
                case 3:
                case 5:
                    //待收货
                    obj.btns.push({
                        val: Lang[Lang.default].applyReturn,
                        red: false,
                    }, {
                        val: Lang[Lang.default].viewLogistics,
                        red: false,
                    }, {
                        val: Lang[Lang.default].confirmReceipt,
                        red: true,
                        fun: (soid)=>{
                            showAlert(
                                Lang[Lang.default].confirmReceipt2,
                                ()=>changeOrderStatu(soid, 4, Lang[Lang.default].successfulReceipt)
                            );
                        }
                    });
                    obj.text = Lang[Lang.default].daishouhuo;
                    break;
                case 4:
                    //交易完成
                    obj.btns.push({
                        val: Lang[Lang.default].applySellAfter,
                        red: false,
                    });
                    obj.text = Lang[Lang.default].transactionOk;
                    break;
                case 6:
                    obj.text = Lang[Lang.default].applyReturning;
                    break;
                case 7:
                    obj.text = Lang[Lang.default].applyFail;
                    break;
                case 8:
                    obj.text = Lang[Lang.default].applySuccess;
                    break;
                default:
                    obj.text = Lang[Lang.default].cnknownState;
                    break;
            }
        }else if(payid == 2) {
            //已退款
            obj.text = Lang[Lang.default].isTuiKuan;
        }else {
            //未付款
            obj.text = Lang[Lang.default].noFuKuan;
            obj.btns.push({
                val: Lang[Lang.default].cancelOrder,
                red: false,
                fun: showCancel,
            }, {
                val: Lang[Lang.default].immediatePayment,
                red: true,
                fun: clickPay,
            });
        }
        return obj;
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    boxStyle: {
        backgroundColor: '#fff',
        marginTop: PX.marginTB,
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
        marginRight: PX.marginLR,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
    },
    fontStyle1: {
        fontSize: 13,
        color: Color.lightBack,
    },
    fontStyle2: {
        fontSize: 14,
        color: Color.red,
    },
    fontStyle3: {
        fontSize: 12,
        color: Color.mainColor,
    },
    btnStyle: {
        paddingLeft: 10,
        paddingRight: 10,
        height: 27,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        marginLeft: 15,
    },
});