/**
 * 购物车 - 提交订单
 * @auther linzeyong
 * @date   2017.05.02
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import Urls from '../public/apiUrl';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {Rule, str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import InputText from '../public/InputText';
import Order from '../datas/order.json';

export default class AddOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectSwapIntegral: 0,
        };

        this.ref_scroll = null;
    }

    render() {
        let that = this;
        let { navigation } = this.props;
        let list1 = <Text style={styles.defaultFont}>{Lang.cn.fullSwap}</Text>;
        let list2 = <Text style={styles.defaultFont}>{Lang.cn.noUseSwap}</Text>;
        let list3 = 
            (<View style={styles.rowViewStyle}>
                <Text style={styles.defaultFont}>{Lang.cn.diySwapIntegral + ': '}</Text>
                <InputText style={styles.integralInput} keyboardType="numeric" onChange={(txt)=>this.useIntegral = txt} />
            </View>);
        let integralList = [list1, list2, list3];

        return (
            <View style={styles.flex}>
                <AppHead 
                    title='提交订单'
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                         navigation.goBack(null);
                    }} src={require("../../images/back.png")} />)}
                />
                <View style={styles.flex}>
                <ScrollView contentContainerStyle={styles.scrollviewStyle} ref={(_ref)=>this.ref_scroll=_ref}>
                    <View style={styles.addressSession}>
                        <Image style={styles.addressBgStyle} resizeMode="stretch" source={require('../../images/car/address_bg.png')}>
                            <View style={styles.addressBox}>
                                <Image style={styles.addressLeftImage} source={require('../../images/car/address_nav.png')} />
                                <View style={styles.centerTextBox}>
                                    <View style={styles.rowViewStyle}>
                                        <Text style={styles.addressTextStyle}>{Lang.cn.consignee + ': ' + Order.addressInfo.name}</Text>
                                        <Text style={[styles.addressTextStyle, styles.mobileStyle]}>{Order.addressInfo.mobile}</Text>
                                    </View>
                                    <Text style={[styles.addressTextStyle, styles.addressStyle]}>{Order.addressInfo.adress}</Text>
                                </View>
                                <Image style={styles.addressRightImage} source={require('../../images/list_more.png')} />
                            </View>
                        </Image>
                    </View>
                    {Order.orderInfo.map((item, index) => this.storeSession(item, index))}
                    <View style={styles.couponBox}>
                        <Text style={styles.defaultFont}>{Lang.cn.coupon}</Text>
                        <View style={styles.rowViewStyle}>
                            <Text style={styles.couponExplainStyle}>{Lang.cn.haveCoupon}</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.couponMoreImage} />
                        </View>
                    </View>
                    <View style={styles.integralBox}>
                        <View style={styles.integralBoxHead}>
                            <Text style={styles.defaultFont}>{Lang.cn.integralSwap}</Text>
                            <Text style={styles.defaultFont}>
                                {Lang.cn.canUseIntegral + ' '}
                                <Text style={styles.redColor}>1500</Text>
                            </Text>
                        </View>
                        <View style={styles.integralSelectStyle}>
                            {integralList.map(function(item, index) {
                                let img = that.state.selectSwapIntegral == index ? require('../../images/car/select.png') : require('../../images/car/no_select.png');
                                return (
                                    <TouchableOpacity key={index} style={styles.integralSelectItem} onPress={()=>{
                                        that.setState({selectSwapIntegral: index});
                                    }}>
                                        <Image source={img} style={styles.selectBeforeImage} />
                                        {item}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <View style={styles.integralBoxFoot}>
                            <Text>
                                使用了
                                <Text style={styles.redColor}>300</Text>
                                积分, 抵现
                                <Text style={styles.redColor}>{Lang.cn.RMB + 30}</Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                </View>
                <View style={styles.footRowBox}>
                    <View style={styles.footRowLeft}>
                        <Text style={styles.footRowLeftText}>
                            {Lang.cn.actualMoney + ': '}
                            <Text style={styles.redColor}>{Lang.cn.RMB + '98.00'}</Text>
                        </Text>
                    </View>
                    <View style={styles.footRowRight}>
                        <Text style={styles.footRowRightText}>{Lang.cn.updateOrder}</Text>
                    </View>
                </View>
            </View>
        );
    }

    //订单内的商家
    storeSession = (item, index) => {
        let name = item.name || '';
        let headImgUrl = item.headImg || null;
        let headImg = headImgUrl ? {uri: headImgUrl} : require('../../images/empty.png');
        let productList = item.productList || [];
        let expressType = item.expressType || '';
        let expressMoney = item.expressMoney || '';
        let totalNum = 0, totalMoney = parseFloat(expressMoney) || 0;

        return (
            <View key={index} style={styles.storeSessionStyle}>
                <View style={styles.storeNameBox}>
                    <Image source={headImg} style={styles.headImgStyle} />
                    <Text style={styles.goodNameStyle}>{name}</Text>
                </View>
                <View>
                    {productList.map(function(good, i) {
                        let goodImgUrl = good.imgurl || null;
                        let goodImg = goodImgUrl ? {uri: goodImgUrl} : require('../../images/empty.png');
                        let goodName = good.name || null;
                        let goodAttr = good.attr || null;
                        let goodPrice = good.price || null;
                        totalNum++;
                        totalMoney += parseFloat(goodPrice);

                        return (
                            <View key={i} style={styles.goodItemBox}>
                                <Image source={goodImg} style={styles.goodImageStyle} />
                                <View style={styles.goodRightBox}>
                                    <View>
                                        <Text style={styles.goodNameStyle}>{goodName}</Text>
                                        <Text style={styles.goodAttrStyle}>{goodAttr}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.goodPriceStyle}>{Lang.cn.RMB + goodPrice}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
                <View style={styles.expressBox}>
                    <View style={styles.rowViewStyle}>
                        <Text style={styles.defaultFont}>{Lang.cn.distributionType}</Text>
                        <Text style={styles.expressTypeText}>{expressType}</Text>
                    </View>
                    <Text style={styles.expressText}>
                        {Lang.cn.express + ': '}
                        <Text style={styles.redColor}>{Lang.cn.RMB + expressMoney}</Text>
                    </Text>
                </View>
                <View style={styles.buyerMessageBox}>
                    <Text style={styles.buyerMessageText}>{Lang.cn.buyerMessage}</Text>
                    <InputText
                        style={styles.flex} 
                        pText={Lang.cn.buyerMessagePlaceholder} 
                        onChange={(txt)=>this.message = txt} 
                    />
                </View>
                <View style={styles.totalBox}>
                    <Text style={styles.totalNumber}>{str_replace(Lang.cn.totalProductNumberL, totalNum)}</Text>
                    <Text style={styles.defaultFont}>
                        <Text>{Lang.cn.total + ' '}</Text>
                        <Text style={styles.redColor}>{Lang.cn.RMB + totalMoney}</Text>
                    </Text>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        backgroundColor: Color.lightGrey,
        paddingBottom: 10,
    },
    defaultFont: {
        color: Color.lightBack,
        fontSize: 14,
    },
    scrollviewStyle: {
        width: Size.width,
    },
    rowViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressSession: {
        height: 100,
        marginTop: 10,
        marginBottom: 10,
    },
    addressBgStyle: {
        width: Size.width,
        height: 100,
    },
    addressBox: {
        height: 90,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 5,
    },
    addressLeftImage: {
        marginLeft: 15,
        marginRight: 7,
        width: 20,
        height: 20,
    },
    centerTextBox: {
        width: Size.width - 84,
    },
    addressRightImage: {
        marginLeft: 10,
        marginRight: 10,
        width: 22,
        height: 22,
    },
    addressTextStyle: {
        fontSize: 12,
        color: Color.lightBack,
        lineHeight: 20,
    },
    mobileStyle: {
        paddingLeft: 20,
    },
    addressStyle: {
        marginTop: 5,
    },
    allProductBox: {
        marginBottom: 10,
    },
    storeSessionStyle: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    storeNameBox: {
        flexDirection: 'row',
        // height: 50,
    },
    headImgStyle: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    goodItemBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 16,
    },
    goodImageStyle: {
        width: 90,
        height: 90,
    },
    goodRightBox: {
        height: 90,
        marginLeft: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 3,
        paddingBottom: 3,
    },
    goodNameStyle: {
        fontSize: 14,
        color: Color.lightBack,
    },
    goodAttrStyle: {
        fontSize: 12,
        color: Color.gainsboro,
    },
    goodPriceStyle: {
        fontSize: 16,
        color: Color.red,
    },
    expressBox: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: Color.lavender,
        borderBottomWidth: pixel,
    },
    expressTypeText: {
        paddingLeft: 10,
    },
    redColor: {
        color: Color.red,
    },
    buyerMessageBox: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: Color.lavender,
        borderBottomWidth: pixel,
    },
    buyerMessageText: {
        color: Color.lightBack,
        fontSize: 14,
        paddingRight: 10,
    },
    totalBox: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    totalNumber: {
        color: Color.lightBack,
        fontSize: 14,
        paddingRight: 30,
    },
    couponBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        backgroundColor: '#fff',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 10,
    },
    couponExplainStyle: {
        fontSize: 14,
        color: Color.gainsboro,
    },
    couponMoreImage: {
        width: 26,
        height: 26,
        marginLeft: 5,
    },
    integralBox: {
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    integralBoxHead: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
    },
    integralSelectStyle: {
        padding: 8,
    },
    integralSelectItem: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    selectBeforeImage: {
        width: 18,
        height: 18,
        marginRight: 18,
    },
    integralInput: {
        width: 64,
        height: 22,
        padding: 0,
        paddingLeft: 5,
        borderRadius: 2,
        borderColor: Color.lightBack,
        marginLeft: 10,
    },
    integralBoxFoot: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-end',
        borderTopWidth: pixel,
        borderTopColor: Color.lavender,
    },
    footRowBox: {
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    footRowLeft: {
        flex: 1,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 18,
    },
    footRowRight: {
        width: 106,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.mainColor,
    },
    footRowLeftText: {
        fontSize: 16,
        color: Color.lightBack,
    },
    footRowRightText: {
        fontSize: 14,
        color: '#fff',
    },
});