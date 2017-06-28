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
import Utils from '../public/utils';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import InputText from '../public/InputText';
import PayOrder from './PayOrder';
import Coupons from '../product/Coupons';
import OrderGood from './OrderGood';

export default class AddOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectSwapIntegral: 0,
            showPayModal: false,
            tmpOrderInfo: [],
            addressInfo: null,
            integral: null,
            inputIntegral: 0,
            showCouponList: false,
            uCoupons: [],
        };
        this.mToken = null;
        this.carIDs = null;
        this.addressID = null;
        this.ref_scroll = null;
        this.useIntegral = 0;
        this.productTotal = 0;
        this.freightTotal = 0;
        this.couponDiscount = 0;
        this.actualTotal = 0;
        this.messages = [];
        this.selCoupon = null;
        this.orderParam = null;
    }

    componentWillMount() {
        this.initDatas();
    }

    componentDidMount() {
        if(this.carIDs) {
            this.getTmpOrderInfo();
        }else {
            this.getTmpOrderInfo2();
        }
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { mToken, carIDs, addressID, orderParam } = params;
            this.mToken = mToken || null;
            this.carIDs = carIDs || null;
            this.addressID = addressID || null;
            this.orderParam = orderParam || null;
        }
    };

    //从购物车跳转过来
    getTmpOrderInfo = () => {
        if(this.mToken && this.carIDs && this.carIDs.length) {
            Utils.fetch(Urls.confirmOrder, 'post', {
                mToken: this.mToken,
                cartID: this.carIDs.join(','),
                addressID: this.addressID ? this.addressID : '',
            }, this.orderInfoCallBack, null , {
                catchFunc: (err)=>{
                    console.log(err);
                }
            });
        }
    };

    //商品详情直接购买
    getTmpOrderInfo2 = () => {
        if(this.orderParam && this.mToken) {
            let obj = Object.assign({
                mToken: this.mToken,
                addressID: this.addressID,
            }, this.orderParam);
            this.orderParam.mToken = this.mToken;
            Utils.fetch(Urls.buyNowAPI, 'post', obj, this.orderInfoCallBack, null, {
                catchFunc: (err)=>console.log(err),
            });
        }
    };

    //处理订单数据
    orderInfoCallBack = (result) => {
        console.log(result);
        if(result && result.sTatus == 1 && result.oOrder) {
            let that = this;
            let list = result.oOrder || [];
            let addressList = result.addressAry || [];
            let mIntegral = parseInt(result.mIntegral) || 0;
            let mCoupon = result.mCoupon || [];
            for(let i in list) {
                let gPrice = parseFloat(list[i].soPrice) || 0;
                let fPrice = parseFloat(list[i].expressMoney) || 0;
                that.productTotal += gPrice;
                that.freightTotal += fPrice;
            }
            this.actualTotal = that.productTotal + that.freightTotal;
            this.setState({
                tmpOrderInfo: list,
                integral: mIntegral = parseInt(mIntegral / 100),
                addressInfo: addressList,
                uCoupons: mCoupon,
            })
        }
    };

    //显示优惠券列表
    showCouponBox = () => {
        this.setState({showCouponList: true});
    };

    //隐藏优惠券列表
    hideCouponBox = () => {
        this.setState({showCouponList: false});
    };

    //选择优惠券
    selectCoupon = (coupon) => {
        console.log(coupon);
        if(coupon && coupon.hMoney && coupon.hUseMoney) {
            this.couponDiscount = this.productTotal > coupon.hUseMoney ? coupon.hMoney : 0;
            this.selCoupon = coupon;
            this.hideCouponBox();
        }
    };

    render() {
        let that = this;
        let { navigation } = this.props;
        let name = mobile = address = '';
        if(this.state.addressInfo) {
            name = this.state.addressInfo.saName || '';
            mobile = this.state.addressInfo.saPhone || '';
            let province = this.state.addressInfo.saProvince || '';
            let city = this.state.addressInfo.saCity || '';
            let regoin = this.state.addressInfo.saDistinct || '';
            address = this.state.addressInfo.saAddress || '';
            address = province + city + regoin + address;
            name = name ? (Lang[Lang.default].consignee + name) : '';
        }
        this.actualTotal = (this.actualTotal - this.couponDiscount > 0) ? this.actualTotal - this.couponDiscount : 0;
        this.useIntegral = this.getIntegralSession()[this.state.selectSwapIntegral].integral || 0;
        this.actualTotal = (this.actualTotal - this.useIntegral).toFixed(2);
        return (
            <View style={styles.flex}>
                <AppHead
                    title={Lang[Lang.default].updateOrder}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                         navigation.navigate('Car');
                    }} src={require("../../images/back.png")} />)}
                />
                <View style={styles.body}>
                <ScrollView contentContainerStyle={styles.scrollviewStyle} ref={(_ref)=>this.ref_scroll=_ref}>
                    <View style={styles.addressSession}>
                        <Image style={styles.addressBgStyle} resizeMode="stretch" source={require('../../images/car/address_bg.png')}>
                            <TouchableOpacity onPress={()=>{
                                navigation.navigate('AddressList', {
                                    mToken: this.mToken,
                                    previou: 'AddOrder',
                                    carIDs: this.carIDs,
                                    orderParam: this.orderParam,
                                });
                            }} style={styles.addressBox}>
                                <Image style={styles.addressLeftImage} source={require('../../images/car/address_nav.png')} />
                                <View style={styles.centerTextBox}>
                                    <View style={styles.rowViewStyle}>
                                        <Text style={styles.addressTextStyle}>{name}</Text>
                                        <Text style={[styles.addressTextStyle, styles.mobileStyle]}>{mobile}</Text>
                                    </View>
                                    <Text numberOfLines={3} style={[styles.addressTextStyle, styles.addressStyle]}>{address}</Text>
                                </View>
                                <Image style={styles.addressRightImage} source={require('../../images/list_more.png')} />
                            </TouchableOpacity>
                        </Image>
                    </View>
                    {this.state.tmpOrderInfo.map((item, index)=>this.storeSession(item, index))}
                    {this.state.uCoupons.length ?
                        <TouchableOpacity activeOpacity={1} onPress={this.showCouponBox}>
                            <View style={styles.couponBox}>
                                <Text style={styles.defaultFont}>{Lang[Lang.default].coupon}</Text>
                                <View style={styles.rowViewStyle}>
                                    {this.couponDiscount > 0 ?
                                        <Text style={styles.redColor}>{this.couponDiscount}</Text> :
                                        <Text style={styles.couponExplainStyle}>{Lang[Lang.default].haveCoupon}</Text>
                                    }
                                    <Image source={require('../../images/list_more.png')} style={styles.couponMoreImage} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        : null
                    }
                    <View style={styles.integralBox}>
                        <View style={styles.integralBoxHead}>
                            <Text style={styles.defaultFont}>{Lang[Lang.default].integralSwap}</Text>
                            <Text style={styles.defaultFont}>
                                {Lang[Lang.default].canUseIntegral + ' '}
                                <Text style={styles.redColor}>{this.state.integral}</Text>
                            </Text>
                        </View>
                        <View>
                            {this.getIntegralSession().map(this.changeIntegral)}
                        </View>
                        <View style={styles.integralSelectItem}>
                            <Image source={require('../../images/car/careful.png')} style={styles.carefulImage} />
                            <Text style={styles.goodAttrStyle}>{'注意: 现金支付满148元, 可获得30积分哟!'}</Text>
                        </View>
                        <View style={styles.integralBoxFoot}>
                            <Text>
                                {Lang[Lang.default].used}
                                <Text style={styles.redColor}>{this.useIntegral}</Text>
                                {Lang[Lang.default].integral + ', ' + Lang[Lang.default].swap}
                                <Text style={styles.redColor}>{Lang[Lang.default].RMB + this.useIntegral}</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={styles.priceListBox}>
                        {this.priceRow(Lang[Lang.default].productTotalPrice, this.productTotal,false, false)}
                        {this.priceRow(Lang[Lang.default].freightTotal, this.freightTotal, false, false)}
                        {this.priceRow(Lang[Lang.default].couponReduction, this.couponDiscount, true, true)}
                        {this.priceRow(Lang[Lang.default].integralSwap, this.useIntegral, true, true)}
                    </View>
                </ScrollView>
                </View>
                <View style={styles.footRowBox}>
                    <View style={styles.footRowLeft}>
                        <Text style={styles.footRowLeftText}>
                            {Lang[Lang.default].actualMoney + ': '}
                            <Text style={styles.redColor}>{Lang[Lang.default].RMB + this.actualTotal}</Text>
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.footRowRight} onPress={this.updateOrder}>
                        <Text style={styles.footRowRightText}>{Lang[Lang.default].updateOrder}</Text>
                    </TouchableOpacity>
                </View>
                {this.state.showCouponList ?
                    <Coupons
                        type={3}
                        userid={this.mToken}
                        coupons={this.state.uCoupons}
                        isShow={this.state.showCouponList}
                        hideCouponBox={this.hideCouponBox}
                        navigation={navigation}
                        callback={this.selectCoupon}
                        userCoupons={this.selCoupon ? this.selCoupon.hId || null : null}
                    />
                    : null
                }
                {this.state.showPayModal?
                    <PayOrder 
                        mToken={this.mToken}
                        visible={this.state.showPayModal} 
                        navigation={navigation} 
                    />
                    : null
                }
            </View>
        );
    }

    //积分块
    getIntegralSession = () => {
        let { inputIntegral, integral } = this.state;
        let input = inputIntegral ? (inputIntegral + '') : '';
        let content1 = <Text style={styles.defaultFont}>{Lang[Lang.default].fullSwap}</Text>;
        let content2 = <Text style={styles.defaultFont}>{Lang[Lang.default].noUseSwap}</Text>;
        let content3 = (
            <View style={styles.rowViewStyle}>
                <Text style={styles.defaultFont}>{Lang[Lang.default].diySwapIntegral + ': '}</Text>
                <InputText
                    style={styles.integralInput}
                    keyType="numeric"
                    vText={input}
                    length={12}
                    onChange={this._inputIntegral}
                    disEdit={integral > 0 ? false : true}
                />
            </View>
        );
        return [{
            content: content1,
            integral: integral > this.actualTotal ? this.actualTotal : integral,
        }, {
            content: content2,
            integral: 0,
        }, {
            content: content3,
            integral: inputIntegral > this.actualTotal ? this.actualTotal : inputIntegral,
        }];
    };

    //用户输入了多少积分
    _inputIntegral = (value) => {
        let integral = this.state.integral || 0;
        let num = parseInt(value) || 0;
        if(integral > 0 && num >= 0 && num <= integral) {
            this.setState({inputIntegral: num});
        }else {
            this.setState({inputIntegral: this.state.inputIntegral, });
        }
    };

    //使用、不使用、使用多少积分
    changeIntegral = (item, index) => {
        let img = this.state.selectSwapIntegral == index ?
            require('../../images/car/select.png') : 
            require('../../images/car/no_select.png');
        return (
            <TouchableOpacity key={index} style={styles.integralSelectItem} onPress={()=>{
                this.setState({selectSwapIntegral: index});
            }}>
                <Image source={img} style={styles.selectBeforeImage} />
                {item.content}
            </TouchableOpacity>
        );
    };

    //价格明细
    priceRow = (title, price, isDiscount, isRed) => {
        if(price > 0) {
            let money = isDiscount ? '- ' + Lang[Lang.default].RMB + price : Lang[Lang.default].RMB + price;
            return (
                <View style={styles.priceRowBox}>
                    <Text style={styles.defaultFont2}>{title}</Text>
                    {isRed ?
                        <Text style={[styles.defaultFont2, styles.redColor]}>{money}</Text>
                        : <Text style={styles.defaultFont2}>{money}</Text>
                    }
                </View>
            );
        }else {
            return null;
        }
    };

    //订单内的商家
    storeSession = (item, index) => {
        let shopname = item.sShopName || '';
        let productList = item.cPro || [];
        let expressType = item.expressType || '';
        let expressMoney = parseFloat(item.expressMoney) || 0;
        let productMoney = parseFloat(item.soPrice) || 0;
        let totalNum = item.soNum || 0;
        let totalMoney = expressMoney + productMoney;
        return (
            <View key={index} style={styles.storeSessionStyle}>
                <View style={styles.storeNameBox}>
                    <Image source={require('../../images/car/shophead.png')} style={styles.headImgStyle} />
                    <Text style={styles.goodNameStyle}>{shopname}</Text>
                </View>
                <View>
                    {productList.map((good, i)=>(<OrderGood good={good} key={i} />))}
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
                        onChange={(txt)=>this.messages[index]=txt}
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

    //即将生成的订单信息
    createOrderInfo = () => {
        let that = this;
        let shopOrder = [];
        let { tmpOrderInfo, addressInfo } = this.state;
        if(tmpOrderInfo) {
            for(let i in tmpOrderInfo) {
                if(tmpOrderInfo[i]) {
                    let obj = {
                        soPrice: tmpOrderInfo[i].soPrice,
                        soNum: tmpOrderInfo[i].cPro.length,
                        oExpressMoney: tmpOrderInfo[i].expressMoney || 0,
                        oMessage: that.messages[i] || '',
                        sId: tmpOrderInfo[i].sId,
                    };
                    shopOrder.push(obj);
                }
            }

            let order = {
                goodsOrder: {
                    gPrice: this.actualTotal,
                    oNum: tmpOrderInfo.length,
                    saID: addressInfo.saID || '',
                    hID: '',
                    oIntegral: this.useIntegral || 0,
                },
                shopOrder: shopOrder,
            }
            console.log(order);
            return JSON.stringify(order);
        }
        return null;
    };

    //点击提交订单按钮
    updateOrder = () => {
        // let orders = this.createOrderInfo();
        // if(this.mToken && orders && this.carIDs) {
        //     let obj = {
        //         mToken: this.mToken,
        //         oAry: orders,
        //         cAry: this.carIDs.join(','),
        //     };
        //     console.log(obj);
        //     Utils.fetch(Urls.updateOrder, 'post', obj, (result) => {
        //         console.log(result);
        //     }, null, {catchFunc: (err)=>{
        //         console.log(err);
        //     }});
        // }
        this.setState({showPayModal: true, });
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    body: {
        flex: 1,
        backgroundColor: Color.lightGrey,
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
        width: Size.width,
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
    goodNameStyle: {
        fontSize: 14,
        color: Color.lightBack,
    },
    goodAttrStyle: {
        fontSize: 12,
        color: Color.gainsboro,
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