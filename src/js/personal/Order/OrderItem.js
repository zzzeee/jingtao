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
        let sName = orderInfo.sShopName || null;
        let totalNum = orderInfo.soNum || 0;
        let freight = parseFloat(orderInfo.oExpressMoney) || 0;
        let price = parseFloat(orderInfo.soPrice) || 0;
        let totalMoney = freight + price;
        let goods = orderInfo.oProduct || [];

        let payid = parseInt(orderInfo.oPay) || 0;
        let statuid = parseInt(orderInfo.oStatus) || 0;
        return (
            <View style={styles.boxStyle}>
                <View style={styles.rowStyle1}>
                    <BtnIcon 
                        text={sName}
                        src={require('../../../images/car/shophead.png')}
                        width={26}
                        press={()=>navigation.navigate('Shop', {shopID: sid})}
                    />
                    <Text style={styles.fontStyle3}>{this.getStatuStr(payid, statuid)}</Text>
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
                    {this.getOrderBtns(payid, statuid).map((item, index)=>{
                        return (
                            <TouchableOpacity key={index} style={[styles.btnStyle, {
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
     * 获取订单标识符
     * @param payid  number 付款状态
     * 注：0 未付款, 1 已付款, 2 已退款
     * @param status number 订单状态
     * 0 确认中, 1 已确认, 2 取消订单, 3 已发货, 4 收货成功, 5 收货失败, 6 申请退换货, 7 申请失败, 8 申请完成
     */
    getStatuStr = (payid, statuid) => {
        let _statuid = parseInt(statuid) || 0;
        if(payid == 1) {
            switch(_statuid) {
                case 0:
                case 1:
                    //待发货
                    return Lang[Lang.default].daifahuo;
                case 2:
                    //订单关闭
                    return Lang[Lang.default].shopClose;
                case 3:
                case 5:
                    //待收货
                    return Lang[Lang.default].daishouhuo;
                case 4:
                    return '交易成功';
                case 6:
                    return '申请退换货';
                case 7:
                    return '申请失败';
                case 8:
                    return '申请完成';
                default:
                    return '未知状态';
            }
        }else if(payid == 2) {
            return '已退款';
        }else {
            return Lang[Lang.default].noFuKuan;
        }
    };

    /**
     * 获取操作订单的按钮
     * @param payid  number 付款状态
     * @param status number 订单状态
     */
    getOrderBtns = (payid, status) => {
        let statuid = parseInt(status) || 0;
        let btns = [{
            val: '联系客服',
            red: false,
        }];
        if(payid == 1) {
            switch(statuid) {
                case 0:
                case 1:
                    //待发货
                    btns.push({
                        val: '申请退换',
                        red: false,
                    });
                    break;
                case 3:
                case 5:
                    //待收货
                    btns.push({
                        val: '申请退换',
                        red: false,
                    }, {
                        val: '查看物流',
                        red: false,
                    }, {
                        val: '确认收货',
                        red: true,
                    });
                    break;
                case 4:
                    //交易完成
                    btns.push({
                        val: '申请售后',
                        red: false,
                    });
                    break;
            }
        }else if(payid == 2) {
            //已退款
        }else {
            btns.push({
                val: '取消订单',
                red: false,
            }, {
                val: '立即付款',
                red: true,
            });
        }
        return btns;
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
        paddingLeft: 15,
        paddingRight: 15,
        height: 27,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        marginLeft: 20,
    },
});