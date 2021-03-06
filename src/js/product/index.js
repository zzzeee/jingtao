/**
 * 商品详情页
 * @auther linzeyong
 * @date   2017.06.01
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Animated,
    Linking,
    Platform,
} from 'react-native';

import User from '../public/user';
import AppHead from '../public/AppHead';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, PX, pixel, Color, errorStyles } from '../public/globalStyle';
import Lang, {ShareText, str_replace, TABKEY} from '../public/language';
import ProductItem from '../other/ProductItem';
import CountDown from '../find/CountDown';
import ProductDetail from './productDetail';
import ProductAttr from './productAttr';
import ReturnAlert from './returnAlert';
import AlertMoudle from '../other/AlertMoudle';
import Areas from './Areas';
import Coupons from './Coupons';
import { EndView } from '../other/publicEment';
// import SwiperDIY from '../other/SwiperDIY';
import Swiper from 'react-native-swiper';
import ShareMoudle from '../other/ShareMoudle';

var isCanShare = true;
var _User = new User();
var footHeight = 50;
var moreHeight = 45;
var bodyHeight = Size.height - 20 - PX.headHeight - footHeight;

export default class ProductScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: false,
            shopFavorite: false,
            goodList: [],     //猜你喜欢的商品列表
            goodIofo: {},
            webViewHeight: 0,
            fetchError: null,
            lastSelected: {},   // 已选规格
            showAttrBox: false,
            attrType: null,
            showReturnMsg: false,
            showAreas: false,
            showCouponList: false,
            msgPositon: new Animated.Value(0),  //收藏显示位置
            collectionMsg: null,                //收藏结果
            deleteAlert: false,
            isRefreshing: true,
            showShare: false,
        };
        this.goodid = 0;
        this.carNumber = 0;
        this.page = 1;
        this.pageNumber = 10;
        this.loadMoreLock = false;
        this.error = null;
        this.message = null;
        this.carDatas = [];
        this.province = null;
        this.city = null;
        this.freight = null;
        this.userinfo = null;
        this.alertObject = {};
        this.timer = [];
    }

    componentWillMount() {
        this.goodid = this.props.navigation && 
            this.props.navigation.state &&
            this.props.navigation.state.params && 
            this.props.navigation.state.params.gid ?
            this.props.navigation.state.params.gid : 0;
    }

    componentDidMount() {
        _User.getUserInfo().then((_user) => {
            this.userinfo = _user;
            this.initDatas();
        });
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        let times = this.timer;
        for(let _time of times) {
            clearTimeout(_time);
        }
    }

    //初始化数据
    initDatas = async () => {
        let state = {isRefreshing: false, };
        if(this.goodid > 0) {
            let obj = Object.assign({gID: this.goodid}, this.userinfo);
            let info = await Utils.async_fetch(Urls.getProductInfo, 'post', obj);
            if(info && info.sTatus && info.proInfo) {
                if(info.proInfo.mCartNum && 
                info.proInfo.mCartNum.length && 
                typeof(info.proInfo.mCartNum) == 'object') {
                    this.carDatas = info.proInfo.mCartNum;
                    this.carNumber = info.proInfo.mCartNum.length;
                }
                state.fetchError = false;
                state.goodIofo = info.proInfo;
                state.isFavorite = info.proInfo.fStatus == 1 ? true : false;
                state.shopFavorite = info.proInfo.fShopStatus == 1 ? true : false;
                let list = await Utils.async_fetch(Urls.getRecommendList, 'get', {
                    pPage: this.page, 
                    pPerNum: this.pageNumber,
                });
                if(list && list.sTatus && list.proAry && list.proAry.length) {
                    state.goodList = list.proAry;
                    this.page++;
                }
            }else {
                state.fetchError = true;
            }
        }
        this.setState(state);
    };

    // 加载更多
    loadMore = () => {
        if(!this.loadMoreLock) {
            let that = this;
            this.loadMoreLock = true;
            Utils.fetch(Urls.getRecommendList, 'get', {
                pPage: this.page, 
                pPerNum: this.pageNumber,
            }, function(result){
                if(result && result.sTatus && result.proAry && result.proAry.length) {
                    let goodList = that.state.goodList.concat(result.proAry);
                    console.log(goodList);
                    that.page++;
                    that.loadMoreLock = false;
                    that.setState({ goodList });
                }
            });
        }
    };

    hideAttr = () => {
        this.setState({showAttrBox: false,});
    };

    showAttr = (type) => {
        this.setState({
            attrType: type,
            showAttrBox: true,
        });
    }

    //显示删除提示框
    showAlertMoudle = (msg, func, rText = null) => {
        this.alertObject = {
            text: msg,
            leftText: Lang[Lang.default].cancel,
            rightText: rText || Lang[Lang.default].determine,
            leftClick: ()=>this.setState({deleteAlert: false,}),
            rightClick: func,
            leftColor: Color.lightBack,
            leftBgColor: '#fff',
            rightColor: Color.lightBack,
            rightBgColor: '#fff',
        };
        this.setState({deleteAlert: true,});
    };

    //联系客服/商家
    cancotShop = () => {
        if(Platform.OS === 'ios') {
            this.callPhone();
        }else {
            this.showAlertMoudle(Lang.telephone2, ()=>{
                this.setState({deleteAlert: false,}, this.callPhone);
            }, Lang[Lang.default].call);
        }
    };

    //打电话
    callPhone = () => {
        Linking.openURL('tel: ' + Lang.telephone)
        .catch(err => console.error('调用电话失败！', err));
    };

    //商品属性选择结果
    attrCallBack = (datas, obj, tourist) => {
        if(datas) {
            this.carDatas = datas;
            this.carNumber = datas.length;
            this.error = 0;
            this.message = Lang[Lang.default].successfullyJoinCar;
        }else {
            this.error = 9;
            this.message = Lang[Lang.default].paramError;
        }
        this.userinfo = tourist;
        this.showReturnBox({
            lastSelected: obj,
            showAttrBox: false,
            showReturnMsg: true,
        });
    };

    //点击立即购买
    clickBuyNow = () => {
        let { navigation } = this.props;
        if(this.goodid > 0) {
            if(this.userinfo && this.userinfo[_User.keyMember]) {
                let order = this.state.lastSelected;
                if(order.gID && order.gAttr && order.gNum) {
                    navigation.navigate('AddOrder', {
                        orderParam: {
                            gID: order.gID,
                            mcAttr: order.gAttr,
                            mcAttrSub: order.gAttrSub,
                            gNum: order.gNum,
                        },
                        mToken: this.userinfo[_User.keyMember],
                    });
                }else {
                    this.showAttr(2);
                }
            }else {
                navigation.navigate('Login', {
                    back: 'Product',
                    backObj: {
                        gid: this.goodid,
                    },
                });
            }
        }
    }

    //获取新增的购物车数量
    getCarNumber = () => {
        let tmp = [];
        let goodid = this.state.goodIofo.gID;
        let oldAttr = this.state.goodIofo.mCartNum || [];
        let data = this.carDatas;
        for(let o in oldAttr) {
            let gid = oldAttr[o].gID || null;
            let name = oldAttr[o].mcAttr || null;
            let index = oldAttr[o].mcAttrSub || null;
            if(gid && name && index) {
                tmp.push(gid + name + index);
            }
        }

        for(let i in data) {
            let nameStr = data[i].names.join(',');
            let subStr = data[i].index.join(',');
            if(nameStr && subStr) {
                let str = goodid + nameStr + subStr;
                let isok = true;
                for(let j in tmp) {
                    if(str == tmp[j]) isok = false;
                }
                if(isok) tmp.push(str);
            }
        }
        return tmp.length;
    };

    //显示提示框
    showReturnBox = (obj) => {
        this.setState(obj, () => {
            let _time = setTimeout(()=>{
                if(this.state.showReturnMsg) {
                    this.hideReturnBox();
                }
            }, 2500);
            this.timer.push(_time);
        });
    };

    //隐藏提示框
    hideReturnBox = () => {
        this.error = null;
        this.message = null;
        this.setState({
            showReturnMsg: false,
        });
    };

    //显示地区列表
    showAreasBox = () => {
        this.setState({showAreas: true});
    };

    //隐藏地区列表
    hideAreasBox = () => {
        this.setState({showAreas: false});
    };

    //显示优惠券列表
    showCouponBox = () => {
        this.setState({showCouponList: true});
    };

    //隐藏优惠券列表
    hideCouponBox = () => {
        this.setState({showCouponList: false});
    };

    //获取查询运费的省市
    getSelectArea = (province, city, freight) => {
        if(province && freight >= 0) {
            this.province = province;
            this.city = city;
            this.freight = freight;
        }
        this.hideAreasBox();
    };

    //收藏等操作结果通知
    resultMsgAnimated = () => {
        Animated.timing(this.state.msgPositon, {
            toValue: PX.rowHeight1,
            duration: 450,
        }).start(()=>{
            let _time = setTimeout(()=>{
                Animated.timing(this.state.msgPositon, {
                    toValue: 0,
                    duration: 300,
                }).start();
            }, 2000);
            this.timer.push(_time);
        });
    };

    //收藏、取消收藏
    toggleCollection = (type = 1, sid = 0) => {
        if(type == 2 && !sid) return;
        let that = this;
        let goodid = this.state.goodIofo.gID;
        let obj = {
            fType: type,
            flID: type == 1 ? goodid : sid,
        };
        if(this.userinfo && this.userinfo[_User.keyMember]) {
            if(type == 2 && this.state.shopFavorite) {
                this.error = 11;
                this.message = Lang[Lang.default].shopCollectioned;
                this.showReturnBox({
                    showReturnMsg: true,
                });
            }else {
                // obj = Object.assign(obj, this.userinfo);
                obj.mToken = this.userinfo[_User.keyMember];
                Utils.fetch(Urls.collection, 'post', obj, (result) => {
                    // console.log(result);
                    if(result) {
                        let ret = result.sTatus || 0;
                        let msg = result.sMessage || null;
                        let obj = {
                            collectionMsg: msg,
                        };
                        if(ret == 4) {
                            this.error = 12;
                            this.message = Lang[Lang.default].logInAgain;
                            this.showReturnBox({
                                showReturnMsg: true,
                            });
                        }else {
                            if(type == 1) {
                                if(ret == 1) {
                                    obj.isFavorite = true;
                                    obj.collectionMsg = Lang[Lang.default].productCollectionSuccess;
                                }else if(ret == 2) {
                                    obj.isFavorite = false;
                                    obj.collectionMsg = Lang[Lang.default].cancelProductCollection;
                                }
                            }
                            if(type == 2 && ret == 1) {
                                obj.shopFavorite = true;
                                obj.collectionMsg = Lang[Lang.default].shopCollectionSuccess;
                            }
                            that.resultMsgAnimated();
                            that.setState(obj);
                        }
                    }
                });
            }
        }else {
            this.error = 11;
            this.message = Lang[Lang.default].notLoggedIn;
            this.showReturnBox({
                showReturnMsg: true,
            });
        }
    };

    render() {
        let { navigation } = this.props;
        let good = this.state.goodIofo || {};
        let gdel = good.gDel && good.gDel != '0' ? true : false;
        if(good.hasOwnProperty('gShelves') && good.gShelves == 0) gdel = true;
        if(this.state.fetchError) gdel = true;
        let right = (
            <View style={styles.rowStyle}>
                <TouchableOpacity onPress={()=>this.toggleCollection(1, 0)} style={{
                    padding: 5,
                }}>
                    <Image source={this.state.isFavorite ? 
                        require("../../images/product/favorite_on.png") :
                        require("../../images/product/favorite.png")
                    } style={{
                        width: PX.headIconSize,
                        height: PX.headIconSize,
                    }} />
                </TouchableOpacity>
                {isCanShare ?
                    <TouchableOpacity onPress={()=>this.setStartShare(true)} style={{
                        padding: 5,
                        marginLeft: 5,
                    }}>
                        <Image source={require("../../images/product/share_orange.png")} style={{
                            width: PX.headIconSize,
                            height: PX.headIconSize,
                        }} />
                    </TouchableOpacity>
                    : null
                }
            </View>
        );
        let goodId = good.gID || '';
        let goodName = good.gName || '';
        let goodImg = good.gThumbPic || '';
        let shareInfo = {
            title: goodName, 
            details: ShareText, 
            imgUrl: goodImg, 
            clickUrl: Urls.weixinShareUrl + goodId,
        };
        return (
            <View style={styles.flex}>
                <AppHead 
                    title={Lang[Lang.default].productDetails}
                    goBack={true}
                    navigation={navigation}
                    right={right}
                    onPress={()=>{
                        this.ref_flatList && this.ref_flatList.scrollToOffset({offset: 0, animated: true});
                    }}
                />
                <View style={styles.flex}>
                    {this.state.fetchError ?
                        <View style={errorStyles.bodyView}>
                            <Text style={errorStyles.refaceBtn} onPress={()=>{
                                this.page = 1;
                                this.setState({
                                    isRefreshing: true,
                                    fetchError: null,
                                }, this.initDatas);
                            }}>
                                {Lang[Lang.default].reconnect}
                            </Text>
                            <Text style={errorStyles.errRemind}>{Lang[Lang.default].fetchError}</Text>
                        </View>
                        : this.pageBody()
                    }
                </View>
                <Animated.View style={[styles.ctrlResultView, {bottom: this.state.msgPositon}]}>
                    <Text style={styles.ctrlResultText}>{this.state.collectionMsg}</Text>
                </Animated.View>
                <View style={styles.footRow}>
                    <View style={styles.rowStyle}>
                        <TouchableOpacity onPress={this.cancotShop} style={[styles.productContactImg, {
                            marginLeft: 10,
                            padding: 5,
                            alignItems: 'center',
                            minHeight: 12,
                        }]}>
                            <Image source={require('../../images/product/custem_center.png')} style={{
                                width: 22,
                                height: 22,
                            }} />
                            <Text style={styles.productContactTxt}>{Lang[Lang.default].customer}</Text>
                        </TouchableOpacity>
                        <View style={styles.btnCarBox}>
                            <TouchableOpacity onPress={()=>{
                                navigation.navigate('TabNav', {
                                    PathKey: TABKEY.car,
                                    goGoodDetails: true,
                                });
                            }} style={[styles.productContactImg, {
                                padding: 5,
                                alignItems: 'center',
                                minHeight: 12,
                            }]}>
                                <Image source={require('../../images/navs/carSelect.png')} style={{
                                    width: 22,
                                    height: 22,
                                }} />
                                <Text style={styles.productContactTxt}>{Lang[Lang.default].tab_car}</Text>
                            </TouchableOpacity>
                            {(this.carNumber && this.carNumber > 0) ?
                                <TouchableOpacity disabled={gdel} onPress={()=>{
                                    navigation.navigate('TabNav', {
                                        PathKey: TABKEY.car,
                                        goGoodDetails: true,
                                    });
                                }} style={styles.carNumberStyle}>
                                    <Text  style={styles.carNumberTextStyle}>{this.carNumber > 99 ? '99+' : this.carNumber}</Text>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                    </View>
                    <View style={styles.rowStyle}>
                        <TouchableOpacity 
                            activeOpacity ={1} 
                            disabled={gdel}
                            style={[styles.btnProductShopping, {
                                backgroundColor: gdel ? Color.lightGrey : Color.orange,
                            }]}
                            onPress={this.clickBuyNow}
                        >
                            <Text style={styles.txtStyle8}>{Lang[Lang.default].buyNow}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity ={1} 
                            disabled={gdel}
                            style={[styles.btnProductShopping, {
                                backgroundColor: gdel ? Color.gray : Color.mainColor,
                            }]}
                            onPress={()=>{this.showAttr(0)}}
                        >
                            <Text style={styles.txtStyle8}>{Lang[Lang.default].joinCar}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.showReturnMsg ?
                    <ReturnAlert 
                        isShow={this.state.showReturnMsg} 
                        error={this.error}
                        message={this.message}
                        hideMsg={this.hideReturnBox}
                    />
                    : null
                }
                {this.state.deleteAlert ?
                    <AlertMoudle visiable={this.state.deleteAlert} {...this.alertObject} />
                    : null
                }
                {this.state.showShare ?
                    <ShareMoudle shareInfo={shareInfo} visible={this.state.showShare} setStartShare={this.setStartShare} />
                    : null
                }
            </View>
        );
    }

    //设置是否显示分享选项
    setStartShare = (isShow) => {
        this.setState({showShare: isShow});
    };

    pageBody = () => {
        let { 
            isRefreshing, 
            goodList,
            showAttrBox,
            showAreas,
            showCouponList
        } = this.state;
        let good = this.state.goodIofo || {};
        let gid = parseInt(good.gID) || 0;
        let attrs = good.attrs || [];
        let chlidAtrrs = good.chlidAtrrs || [];
        let priceAtrrs = good.priceAtrrs || [];
        let pWarehouse = good.pWarehouse || [];
        let areas = good.areas || [];
        let mCoupon = good.mCoupon || [];
        let mToken = (this.userinfo && this.userinfo[_User.keyMember]) ? this.userinfo[_User.keyMember] : null;
        return (
            <View style={styles.container}>
                <FlatList
                    ref={(_ref)=>this.ref_flatList=_ref} 
                    data={goodList}
                    numColumns={2}
                    onScroll={this._onScroll}
                    removeClippedSubviews={false}
                    contentContainerStyle={styles.whiteBg}
                    keyExtractor={(item, index) => (index)}
                    enableEmptySections={true}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this.pageHead}
                    refreshing={isRefreshing}
                    onRefresh={()=>{
                        this.page = 1;
                        this.setState({isRefreshing: true});
                        this.initDatas();
                    }}
                    onEndReached={()=>{
                        if(!this.loadMoreLock) {
                            // this.loadMore();
                        }
                    }}
                    ListFooterComponent={()=>{
                        if(goodList && goodList.length > 1) {
                            return <EndView />;
                        }else {
                            return <View />;
                        }
                    }}
                />
                {showAttrBox ?
                    <ProductAttr 
                        isShow={showAttrBox}
                        gid={gid}
                        userid={this.userinfo}
                        attrs={attrs}
                        chlidAtrrs={chlidAtrrs}
                        carDatas={this.carDatas}
                        hideModal={this.hideAttr}
                        type={this.state.attrType}
                        attrCallBack={this.attrCallBack}
                        productImg={good.gThumbPic}
                        productPrice={good.gDiscountPrice}
                        priceAtrrs={priceAtrrs}
                        pWarehouse={good.pWarehouse}
                        navigation={this.props.navigation}
                    />
                    : null
                }
                {showAreas ?
                    <Areas
                        gid={gid}
                        areas={good.areas}
                        isShow={showAreas} 
                        hideAreasBox={this.hideAreasBox}
                        getSelectArea={this.getSelectArea}
                    />
                    : null
                }
                {showCouponList ?
                    <Coupons
                        gid={gid}
                        userid={mToken}
                        coupons={mCoupon}
                        isShow={showCouponList} 
                        hideCouponBox={this.hideCouponBox}
                        navigation={this.props.navigation}
                        back={'Product'}
                        backObj={{gid: gid}}
                    /> 
                    : null
                }
                
            </View>
        );
    };

    //商品主要信息
    productInfo = () => {
        let { navigation } = this.props;
        let good = this.state.goodIofo || {};
        let gid = good.gID || null;
        if(!gid) return null;
        let gdel = good.gDel && good.gDel != '0' ? true : false;
        if(good.hasOwnProperty('gShelves') && good.gShelves == 0) gdel = true;
        if(this.state.fetchError) gdel = true;
        let name = good.gName || null;
        let price = good.gDiscountPrice || null;
        let marketPrice = good.gPrices || null;
        let shopId = good.sId || null;
        let shopName = good.sName || null;
        let shopHead = good.sLogo || null;
        shopHead = shopHead ? {uri: shopHead} : require('../../images/empty.jpg');
        let isGive = parseInt(good.gIntegral) || 0;
        isGive = isGive > 0 ? true : false;
        let isExchange = (good.gIsIntegral && good.gIsIntegral !== '0') ? true : false;
        let isLimit = good.aStatus == 1 ? true : false;
        let endTime = good.aEndtime || null;
        let nowTime = good.nowTime || null;
        let coupons = (good.mCoupon && good.mCoupon.length) ? good.mCoupon : null;
        let productArea = good.pAttribution || '';
        let price_arr = [];
        let img_arr = [];
        endTime = new Date(this.checkTimeString(endTime)).getTime();
        nowTime = new Date(this.checkTimeString(nowTime)).getTime();
        if(price) {
            price_arr = String(price).split('.');
        }
        for(let i in good.gImgs) {
            let _img = good.gImgs[i].gThumBPic || null;
            _img && img_arr.push(_img);
        }
        return (
            <View>
                <View style={styles.whiteBg}>
                    <View style={styles.productImgBox}>
                        {gdel ?
                            <View style={styles.productDeleteBox}>
                                <Image style={styles.productDelete} source={require('../../images/product/product_deleted.png')}>
                                    <Text style={styles.txtStyle6}>{Lang[Lang.default].productDelete}</Text>
                                </Image> 
                            </View> :
                            <View style={styles.wrapperBox}>
                                <Swiper
                                    width={Size.width}
                                    height={Size.width}
                                    style={styles.wrapper}
                                    horizontal={true}
                                    showsPagination={true}
                                    paginationStyle={styles.paginationStyle}
                                    dot={(<View 
                                        style={{
                                            backgroundColor:'rgba(0, 0, 0, .3)',
                                            width: 6,
                                            height: 6,
                                            borderRadius: 3,
                                            margin: 5,
                                        }}
                                    />)}
                                    activeDot={(<View 
                                        style={{
                                            backgroundColor:'rgba(229, 86, 69, 1)',
                                            width: 6,
                                            height: 6,
                                            borderRadius: 3,
                                            margin: 5,
                                        }}
                                    />)}
                                    autoplay={false}
                                    showsButtons={false}
                                >
                                    {img_arr.map((item, index)=>{
                                        return <Image key={index} source={{uri: item}} style={styles.productImg} />;
                                    })}
                                </Swiper>
                            </View>
                        }
                        <View style={styles.areaStockView}>
                            <Text style={styles.txtStyle1}>{Lang[Lang.default].origin + ': ' + productArea}</Text>
                        </View>
                        <View style={styles.namePriceBoxBg}>
                            <View style={styles.namePriceBox}>
                                <View style={[styles.centerBox, {
                                    height: 47, 
                                    borderBottomColor: Color.lightGrey,
                                    borderBottomWidth: pixel,
                                }]}>
                                    {isLimit ?
                                        <Text style={styles.timeLimit}>{Lang[Lang.default].timeLimit}</Text>
                                        : null
                                    }
                                    <Text style={[styles.txtStyle3, {
                                        paddingRight: 5, 
                                        paddingTop: 4,
                                        color: gdel ? Color.gainsboro : Color.mainColor,
                                    }]}>{Lang[Lang.default].RMB}</Text>
                                    {price_arr[0] ?
                                        <Text style={[styles.txtStyle4, {
                                            color: gdel ? Color.gainsboro : Color.mainColor,
                                        }]}>{price_arr[0]}</Text>
                                        : null
                                    }
                                    {price_arr[1] ?
                                        <Text style={[styles.txtStyle5, {
                                            paddingRight: 5, 
                                            paddingTop: 8,
                                            color: gdel ? Color.gainsboro : Color.mainColor,
                                        }]}>{'.' + price_arr[1]}</Text>
                                        : null
                                    }
                                    <Text style={[styles.txtStyle6, {
                                        paddingTop: 7,
                                        textDecorationLine: 'line-through',
                                    }]}>{marketPrice}</Text>
                                </View>
                                <View style={[styles.centerBox, {height: (isExchange || isGive) ? 42 : 60}]}>
                                    <Text style={[styles.txtStyle2, {
                                        lineHeight: 18,
                                        color: gdel ? Color.gainsboro : Color.lightBack,
                                    }]} numberOfLines={2}>{name}</Text>
                                </View>
                                <View style={[styles.centerBox, {height: (isExchange || isGive) ? 20 : 0}]}>
                                {isExchange ?
                                    <View style={styles.rowStyle}>
                                        <Text style={styles.couponIcon}>抵</Text>
                                        <Text style={styles.txtStyle1}>{Lang[Lang.default].integralSwap}</Text>
                                    </View>
                                    : null
                                }
                                {isGive ?
                                    <View style={[styles.rowStyle, {marginLeft: 20}]}>
                                        <Text style={[styles.couponIcon, {
                                            backgroundColor: Color.yellow,
                                            marginRight: 5,
                                        }]}>赠</Text>
                                        <Text style={styles.txtStyle1}>{Lang[Lang.default].integralSend}</Text>
                                    </View>
                                    : null
                                }
                                </View>
                            </View>
                        </View>
                    </View>
                    {isLimit ?
                        <View style={styles.CountDownBox}>
                            <CountDown endTime={endTime} nowTime={nowTime} startTime={nowTime} />
                        </View>
                        : null
                    }
                    <View style={styles.selectLineBg}>
                        <View style={styles.selectLineSide}></View>
                        <View style={styles.selectLineMiddle}></View>
                        <View style={styles.selectLineSide}></View>
                    </View>
                    <View style={styles.SelectsBox}>
                        {this.createSelectBox(Lang[Lang.default].specification, 
                            this.selectAttrInfo(), 
                            ()=>this.showAttr(1)
                        )}
                        {this.createSelectBox(Lang[Lang.default].freight, 
                            this.getFreightInfo(),
                            this.showAreasBox
                        )}
                        {coupons ?
                            this.createSelectBox(Lang[Lang.default].takeCoupon, 
                                this.couponListInfo(coupons),
                                this.showCouponBox
                            ) : null
                        }
                    </View>
                </View>
                <View style={styles.shopBox}>
                    <View style={styles.headNameBox}>
                        <View style={styles.shopHeadLeft}>
                            <Image style={styles.shopHeadImg} source={shopHead} />
                        </View>
                        <View style={styles.shopHeadRight}>
                            <View style={[styles.rowStyle, {marginBottom: 10}]}>
                                <Image source={require('../../images/product/vip.png')} style={styles.vipImg} />
                                <Text numberOfLines={1} style={styles.txtStyle2}>{shopName}</Text>
                            </View>
                            <View style={styles.rowStyle}>
                                <View style={styles.shopMarkImg}>
                                    <Image source={require('../../images/product/7day.png')} style={{
                                        width: 20,
                                        height: 20,
                                    }} />
                                    <Text style={styles.shopMarkText}>{Lang[Lang.default].sevenDays}</Text>
                                </View>
                                <View style={styles.shopMarkImg}>
                                    <Image source={require('../../images/product/origin.png')} style={{
                                        width: 20,
                                        height: 20,
                                    }} />
                                    <Text style={styles.shopMarkText}>{Lang[Lang.default].certifiedGuarantee}</Text>
                                </View>
                                <View style={styles.shopMarkImg}>
                                    <Image source={require('../../images/product/quick.png')} style={{
                                        width: 20,
                                        height: 20,
                                    }} />
                                    <Text style={styles.shopMarkText}>{Lang[Lang.default].lightningConsignment}</Text>
                                </View>
                                <View style={styles.shopMarkImg}>
                                    <Image source={require('../../images/product/direct.png')} style={{
                                        width: 20,
                                        height: 20,
                                    }} />
                                    <Text style={styles.shopMarkText}>{Lang[Lang.default].directDeal}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.shopBtnBox}>
                        <Text style={[styles.shopBtn, {marginRight: 55}]} onPress={()=>{
                            if(navigation && shopId) {
                                navigation.navigate('Shop', {shopID: shopId});
                            }
                        }}>{Lang[Lang.default].shopStroll}</Text>
                        <Text style={styles.shopBtn} onPress={()=>{
                            if(navigation && shopId) {
                                this.toggleCollection(2, shopId)
                            }
                        }}>{Lang[Lang.default].shopCollection}</Text>
                    </View>
                </View>
            </View>
        );
    };

    //页面头部 - 商品详情
    pageHead = () => {
        if(!this.state.goodIofo || !this.state.goodIofo.gID) return null;
        return (
            <View style={styles.grayBg}>
                {this.productInfo()}
                <ProductDetail moreHeight={moreHeight} productID={parseInt(this.state.goodIofo.gID)} />
                <View style={styles.goodlistTop}>
                    <View style={styles.goodTopLine}></View>
                    <View>
                        <Text style={styles.goodlistTopText}>{Lang[Lang.default].recommendGoods}</Text>
                    </View>
                    <View style={styles.goodTopLine}></View>
                </View>
            </View>
        );
    };

    //生成选择框
    createSelectBox = (title, ement, press) => {
        return (
            <TouchableOpacity activeOpacity={1} style={styles.SelectBox} onPress={press}>
                <View style={styles.SelectBoxChild1}>
                    <View style={styles.SelectBoxChild2}>
                        {ement}
                    </View>
                </View>
                <View style={styles.selectTitleView}>
                    <Text style={styles.SelectTitleText}>{title}</Text>
                </View>
                <View style={styles.selectSpotView}>
                    <Image source={require('../../images/product/more_dot.png')} style={styles.dotImg} />
                </View>
            </TouchableOpacity>
        );
    };

    //已选规格
    selectAttrInfo = () => {
        let attr = this.state.lastSelected.gAttr || Lang[Lang.default].nothing;
        return (
            <View style={styles.selectedBox}>
                <Text style={[styles.txtStyle1, {lineHeight: 19}]} numberOfLines={2}>{attr}</Text>
            </View>
        );
    };

    //运费信息
    getFreightInfo = () => {
        let province = (this.province && this.province.name) ? this.province.name : null;
        let city = (this.city && this.city.name) ? this.city.name : null;
        let freight = this.freight || 0;
        if(province) {
            let str = 
            <Text style={styles.txtStyle7} numberOfLines={2}>
                {Lang[Lang.default].to + ' '}
                {province ?
                    <Text>
                        {province}
                        <Text style={styles.txtStyle9}>省</Text>
                    </Text>
                    : null    
                }
                {city ?
                    <Text>
                        {city}
                        <Text style={styles.txtStyle9}>市</Text>
                    </Text>
                    : null    
                }
            </Text>;
            return (
                <View style={styles.selectedBox}>
                    {str}
                    <Text style={[styles.txtStyle9, {paddingTop: 4}]}>{'' + freight}</Text>
                </View>
            );
        }else {
            return (
                <View style={styles.selectedBox}>
                    <Text style={styles.txtStyle1}>{Lang[Lang.default].nothing}</Text>
                </View>
            );
        }
    };

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

    //优惠券列表信息
    couponListInfo = (list) => {
        if(typeof(list) == 'object' && list && list.length) {
            let i = 0, that = this;
            return (
                <View style={{paddingRight: 5}}>
                    {list.map((item, index)=>{
                        let name = item.hName || '';
                        let isable = (item.isable && item.isable !== '0') ? true : false;
                        let stime = item.hStartTime || null;
                        let etime = item.hSendTime || null;
                        let ntime = new Date().getTime();
                        stime = new Date(that.checkTimeString(stime)).getTime();
                        etime = new Date(that.checkTimeString(etime)).getTime();
                        if(i < 2 && isable && stime < ntime && etime > ntime) {
                            i++;
                            return (
                                <View key={index} style={styles.couponRow}>
                                    <Text style={styles.couponIcon}>领</Text>
                                    <Text style={styles.txtStyle7} numberOfLines={1}>{name}</Text>
                                </View>
                            );
                        }else {
                            return <View key={index}></View>;
                        }
                    })}
                </View>
            );
        }
        return null;
    };

    //猜你喜欢商品
    _renderItem = ({item, index}) => {
        return (
            <ProductItem 
                product={item} 
                key={index}
                showDiscount={true}
                width={(Size.width - 20) / 2}
                navigation={this.props.navigation}
                boxStyle={{
                    marginLeft: 5,
                    marginRight: 5,
                    marginBottom: 8,
                }} 
            />
        );
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        // backgroundColor: Color.lightGrey,
    },
    whiteBg: {
        backgroundColor: '#fff',
    },
    grayBg: {
        backgroundColor: Color.lightGrey,
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txtStyle1 : {
        fontSize: 12,
        color: Color.gainsboro,
    },
    txtStyle2 : {
        fontSize: 14,
        color: Color.lightBack,
    },
    txtStyle3 : {
        color: Color.mainColor,
        fontSize: 20,
    },
    txtStyle4 : {
        color: Color.mainColor,
        fontSize: 26,
    },
    txtStyle5 : {
        color: Color.mainColor,
        fontSize: 12,
    },
    txtStyle6: {
        color: Color.gainsboro,
        fontSize: 14,
    },
    txtStyle7 : {
        fontSize: 12,
        color: Color.lightBack,
    },
    txtStyle8: {
        color: '#fff',
        fontSize: 14,
    },
    txtStyle9: {
        color: Color.red,
        fontSize: 12,
    },
    productDeleteBox: {
        backgroundColor: Color.lightGrey,
        width: Size.width, 
        height: Size.width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productDelete: {
        width: 180,
        height: 150,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    wrapperBox: {
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
    },
    paginationStyle: {
        position: 'absolute',
        left: 0,
        right: 0, 
        top: 15,
        height: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImg: {
        width: Size.width, 
        height: Size.width,
    },
    areaStockView: {
        height: 102,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    namePriceBoxBg: {
        height: 130,
        width: Size.width * 0.66,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, .7)',
        position: 'absolute',
        bottom: 29,
        left: Size.width * (1 - 0.66) / 2,
    },
    namePriceBox: {
        flex: 1,
        margin: 3,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: Color.gainsboro2,
        padding: 5,
    },
    timeLimit: {
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 3,
        backgroundColor: Color.red,
        color: '#fff',
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 11,
        marginRight: 10,
    },
    centerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    CountDownBox: {
        paddingTop: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectLineBg: {
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        marginTop: 25,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectLineSide: {
        flex: 1,
        height: 0,
        borderBottomWidth: pixel,
        borderBottomColor: Color.gainsboro2,
    },
    selectLineMiddle: {
        height: 5,
        width: 50,
        backgroundColor: Color.mainColor,
    },
    SelectsBox: {
        marginRight: PX.marginLR,
        flexDirection: 'row',
        marginBottom: 20,
    },
    SelectBox: {
        height: 92,
        flex: 1,
        marginLeft: PX.marginLR,
        paddingTop: 8,
    },
    SelectBoxChild1: {
        borderWidth: 2,
        borderColor: Color.gainsboro2,
        borderRadius: 4,
        height: 84,
    },
    SelectBoxChild2: {
        borderWidth: pixel,
        borderColor: Color.gainsboro2,
        borderRadius: 2,
        flex: 1,
        margin: 5,
        justifyContent: 'center',
        paddingBottom: 5,
        paddingLeft: 3,
        paddingRight: 3,
    },
    selectTitleView: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        alignItems: 'center',
    },
    SelectTitleText: {
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        fontSize: 12,
        color: Color.lightBack,
    },
    selectSpotView: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 4,
        alignItems: 'center',
    },
    dotImg: {
        width: 26,
        height: 26,
    },
    selectedBox: {
        alignItems: 'center',
        paddingBottom: 4,
    },
    couponRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingBottom: 5,
        paddingLeft: 2,
    },
    couponIcon: {
        fontSize: 11,
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 1,
        paddingBottom: 1,
        color: '#fff',
        backgroundColor: Color.red,
        borderRadius: 2,
        marginRight: 5,
    },
    shopBox: {
        marginTop: PX.marginTB,
        backgroundColor: '#fff',
    },
    headNameBox: {
        margin: 15,
        flexDirection: 'row',
    },
    shopHeadLeft: {
        marginRight: PX.marginLR,
    },
    shopHeadImg: {
        width: 80,
        height: 80,
        borderColor: Color.lavender,
        borderWidth: pixel,
    },
    shopHeadRight: {
        justifyContent: 'center',
    },
    vipImg: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    shopMarkImg: {
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
    },
    shopMarkText: {
        color: Color.red,
        fontSize: 10,
        paddingLeft: 0,
    },
    shopBtnBox: {
        marginTop: 6,
        height: 55,
        borderTopWidth: 1,
        borderTopColor: Color.lavender,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shopBtn: {
        color: Color.mainColor,
        borderColor: Color.mainColor,
        borderWidth: 1,
        fontSize: 11,
        borderRadius: 8,
        paddingTop: 6,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },
    ctrlResultView: {
        position: 'absolute',
        width: Size.width,
        height: PX.rowHeight1,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ctrlResultText: {
        fontSize: 16,
        color: '#fff',
    },
    footRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderTopColor: Color.lavender,
        borderTopWidth: pixel,
    },
    btnCarBox: {
        marginLeft: 10,
    },
    carNumberStyle: {
        position: 'absolute',
        left: 21,
        top: 8,
        height: 13,
        borderRadius: 6.5,
        paddingLeft: 7,
        paddingRight: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Color.red,
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    carNumberTextStyle: {
        fontSize: 9,
        color: Color.red,
        paddingBottom: 1,
        backgroundColor: 'transparent',
    },
    productContactImg: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        height: footHeight,
        width: 52,
    },
    productContactTxt: {
        color: Color.lightBack,
        fontSize: 10,
        paddingLeft: 0,
    },
    btnProductShopping: {
        width: Size.width * 0.283,
        height: footHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goodlistTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: PX.rowHeight1,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        marginTop: PX.marginTB,
        backgroundColor: '#fff',
    },
    goodTopLine: {
        flex: 1,
        borderBottomWidth: pixel,
        borderBottomColor: Color.mainColor,
    },
    goodlistTopText: {
        fontSize: 16,
        color: Color.mainColor,
        paddingLeft: 25,
        paddingRight: 25,
    },
});