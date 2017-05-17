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
import PayOrder from './PayOrder';

export default class AddOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectSwapIntegral: 0,
            showPayModal: false,
        };

        this.ref_scroll = null;
    }

    render() {
        let that = this;
        let { navigation } = this.props;
        let list1 = <Text style={styles.defaultFont}>{Lang[Lang.default].fullSwap}</Text>;
        let list2 = <Text style={styles.defaultFont}>{Lang[Lang.default].noUseSwap}</Text>;
        let list3 = 
            (<View style={styles.rowViewStyle}>
                <Text style={styles.defaultFont}>{Lang[Lang.default].diySwapIntegral + ': '}</Text>
                <InputText style={styles.integralInput} keyType="numeric" onChange={(txt)=>this.useIntegral = txt} />
            </View>);
        let integralList = [list1, list2, list3];

        return (
            <View style={styles.flex}>
                <AppHead 
                    title={Lang[Lang.default].updateOrder}
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
                                        <Text style={styles.addressTextStyle}>{Lang[Lang.default].consignee + ': ' + Order.addressInfo.name}</Text>
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
                        <Text style={styles.defaultFont}>{Lang[Lang.default].coupon}</Text>
                        <View style={styles.rowViewStyle}>
                            <Text style={styles.couponExplainStyle}>{Lang[Lang.default].haveCoupon}</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.couponMoreImage} />
                        </View>
                    </View>
                    <View style={styles.integralBox}>
                        <View style={styles.integralBoxHead}>
                            <Text style={styles.defaultFont}>{Lang[Lang.default].integralSwap}</Text>
                            <Text style={styles.defaultFont}>
                                {Lang[Lang.default].canUseIntegral + ' '}
                                <Text style={styles.redColor}>1500</Text>
                            </Text>
                        </View>
                        <View>
                            {integralList.map(function(item, index) {
                                let img = that.state.selectSwapIntegral == index ? 
                                            require('../../images/car/select.png') : 
                                            require('../../images/car/no_select.png');
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
                        <View style={styles.integralSelectItem}>
                            <Image source={require('../../images/car/careful.png')} style={styles.carefulImage} />
                            <Text style={styles.goodAttrStyle}>{'注意: 现金支付满148元, 可获得30积分哟!'}</Text>
                        </View>
                        <View style={styles.integralBoxFoot}>
                            <Text>
                                {Lang[Lang.default].used}
                                <Text style={styles.redColor}>300</Text>
                                {Lang[Lang.default].integral + ', ' + Lang[Lang.default].swap}
                                <Text style={styles.redColor}>{Lang[Lang.default].RMB + 30}</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={styles.priceListBox}>
                        {this.priceRow(Lang[Lang.default].productTotalPrice, Lang[Lang.default].RMB + '128.00', false)}
                        {this.priceRow(Lang[Lang.default].freightTotal, Lang[Lang.default].RMB + '15.00', false)}
                        {this.priceRow(Lang[Lang.default].couponReduction, '-' + Lang[Lang.default].RMB + '15.00', true)}
                        {this.priceRow(Lang[Lang.default].integralSwap, '-' + Lang[Lang.default].RMB + '128.00', true)}
                    </View>
                </ScrollView>
                </View>
                <View style={styles.footRowBox}>
                    <View style={styles.footRowLeft}>
                        <Text style={styles.footRowLeftText}>
                            {Lang[Lang.default].actualMoney + ': '}
                            <Text style={styles.redColor}>{Lang[Lang.default].RMB + '98.00'}</Text>
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.footRowRight} onPress={()=>this.setState({showPayModal: true})}>
                        <Text style={styles.footRowRightText}>{Lang[Lang.default].updateOrder}</Text>
                    </TouchableOpacity>
                </View>
                <PayOrder visible={this.state.showPayModal} />
            </View>
        );
    }

    //价格明细
    priceRow = (title, price, isRed) => {
        return (
            <View style={styles.priceRowBox}>
                <Text style={styles.defaultFont2}>{title}</Text>
                {isRed ?
                    <Text style={[styles.defaultFont2, styles.redColor]}>{price}</Text>
                    : <Text style={styles.defaultFont2}>{price}</Text>
                }
            </View>
        );
    };

    //订单内的商家
    storeSession = (item, index) => {
        let name = item.name || '';
        let productList = item.productList || [];
        let expressType = item.expressType || '';
        let expressMoney = item.expressMoney || '';
        let totalNum = 0;
        let totalMoney = parseFloat(expressMoney) || 0;

        return (
            <View key={index} style={styles.storeSessionStyle}>
                <View style={styles.storeNameBox}>
                    <Image source={require('../../images/car/shophead.png')} style={styles.headImgStyle} />
                    <Text style={styles.goodNameStyle}>{name}</Text>
                </View>
                <View>
                    {productList.map(function(good, i) {
                        let goodImgUrl = good.imgurl || null;
                        let goodImg = goodImgUrl ? {uri: goodImgUrl} : require('../../images/empty.png');
                        let goodName = good.name || null;
                        let goodAttr = good.attr || null;
                        let goodPrice = good.price || null;
                        let martPrice = good.martPrice || null;
                        let goodNumber = good.number || '';
                        let goodType = good.type || 0;
                        totalNum++;
                        totalMoney += parseFloat(goodPrice);

                        return (
                            <View key={i} style={styles.goodItemBox}>
                                <Image source={goodImg} style={styles.goodImageStyle} />
                                <View style={styles.goodRightBox}>
                                    <Text style={styles.goodNameStyle}>{goodName}</Text>
                                    <Text style={styles.goodAttrStyle}>{Lang[Lang.default].specification + ': ' + goodAttr}</Text>
                                    <View style={[styles.rowViewStyle, {justifyContent: 'space-between'}]}>
                                        <View style={styles.rowViewStyle}>
                                            <Text style={styles.goodPriceStyle}>{Lang[Lang.default].RMB + goodPrice}</Text>
                                            <Text style={[styles.goodAttrStyle, {paddingRight: 10}]}>{martPrice}</Text>
                                            {goodType == 1 ?
                                                <Text style={styles.timeLimit}>{Lang[Lang.default].timeLimit}</Text>
                                                : null
                                            }
                                        </View>
                                        <Text style={styles.goodNameStyle}>{'× ' + goodNumber}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
                <View style={styles.expressBox}>
                    <View style={styles.rowViewStyle}>
                        <Text style={styles.defaultFont}>{Lang[Lang.default].distributionType}</Text>
                        {/*<Text style={styles.expressTypeText}>{expressType}</Text>*/}
                    </View>
                    <Text style={styles.expressText}>
                        {Lang[Lang.default].express + ': '}
                        <Text style={styles.redColor}>{Lang[Lang.default].RMB + expressMoney}</Text>
                    </Text>
                </View>
                <View style={styles.buyerMessageBox}>
                    <Text style={styles.buyerMessageText}>{Lang[Lang.default].buyerMessage}</Text>
                    <InputText
                        style={{flex: 1, borderWidth: 0}} 
                        pText={Lang[Lang.default].buyerMessagePlaceholder} 
                        onChange={(txt)=>this.message = txt} 
                    />
                </View>
                <View style={styles.totalBox}>
                    <Text style={styles.totalNumber}>{str_replace(Lang[Lang.default].totalProductNumberL, totalNum)}</Text>
                    <Text style={styles.defaultFont}>
                        <Text>{Lang[Lang.default].total + ' '}</Text>
                        <Text style={styles.redColor}>{Lang[Lang.default].RMB + totalMoney}</Text>
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
    defaultFont2: {
        color: Color.lightBack,
        fontSize: 13,
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
    carefulImage: {
        width: 14,
        height: 14,
        marginRight: 5,
    },
    addressTextStyle: {
        fontSize: 13,
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
        marginBottom: PX.marginTB,
        backgroundColor: '#fff',
    },
    storeNameBox: {
        flexDirection: 'row',
        height: PX.rowHeight2,
        alignItems: 'center',
        paddingLeft: PX.marginLR,
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
    },
    headImgStyle: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    goodItemBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: PX.marginLR,
        marginBottom: 3,
        backgroundColor: Color.floralWhite,
    },
    goodImageStyle: {
        width: 90,
        height: 90,
    },
    goodRightBox: {
        flex: 1,
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
        paddingRight: 10,
    },
    timeLimit: {
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 2,
        color: '#fff',
        fontSize: 12,
        backgroundColor: Color.red,
    },
    expressBox: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: Color.lavender,
        borderBottomWidth: pixel,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
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
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
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
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
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
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        marginBottom: PX.marginTB,
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
        marginBottom: PX.marginTB,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
    },
    integralBoxHead: {
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
    },
    integralSelectItem: {
        flex: 1,
        height: 44,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingRight: 18,
    },
    selectBeforeImage: {
        width: 18,
        height: 18,
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
    priceListBox: {
        backgroundColor: '#fff',
        marginBottom: PX.marginTB,
    },
    priceRowBox: {
        height: 50,
        marginLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        borderBottomColor: Color.lavender,
        borderBottomWidth: pixel,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footRowBox: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopColor: Color.lavender,
        borderTopWidth: pixel,
    },
    footRowLeft: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 18,
    },
    footRowRight: {
        width: 106,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.mainColor,
    },
    footRowLeftText: {
        fontSize: 13,
        color: Color.lightBack,
    },
    footRowRightText: {
        fontSize: 14,
        color: '#fff',
    },
});