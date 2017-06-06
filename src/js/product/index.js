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
    WebView,
} from 'react-native';

import User from '../public/user';
import Swiper from 'react-native-swiper';
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, PX, pixel, Color, errorStyles } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import Goods from '../datas/goods.json';
import ProductItem from '../other/ProductItem';
import CountDown from '../find/CountDown';
import ProductDetail from './productDetail';
import ProductAttr from './productAttr';
import ReturnAlert from './returnAlert';
import Areas from './Areas';
import Coupons from './Coupons';

var _User = new User();
var footHeight = 50;
var moreHeight = 45;
var bodyHeight = Size.height - 20 - PX.headHeight - footHeight;

export default class ProductScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: false,
            goodList: [],     //猜你喜欢的商品列表
            goodIofo: {},
            webViewHeight: 0,
            fetchError: null,
            selected: [],   // 已选规格
            showAttrBox: false,
            attrType: null,
            showReturnMsg: false,
            showAreas: false,
            showCouponList: false,
        };
        this.page = 1;
        this.pageNumber = 10;
        this.loadMoreLock = false;
        this.error = null;
        this.message = null;
        this.attrDatas = null;
        this.province = null;
        this.city = null;
        this.freight = null;
        this.userinfo = null;
    }

    componentDidMount() {
        let that = this;
        _User.getUserInfo().then((_user) => {
            console.log(_user);
            that.userinfo = _user;
            that.initDatas();
        });
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    //初始化数据
    initDatas = async () => {
        let gid = this.props.navigation && 
            this.props.navigation.state &&
            this.props.navigation.state.params && 
            this.props.navigation.state.params.gid ?
            this.props.navigation.state.params.gid : 0;
        if(gid > 0) {
            let obj = Object.assign({gID: gid}, this.userinfo);
            let info = await Utils.async_fetch(Urls.getProductInfo, 'post', obj);
            let list = await Utils.async_fetch(Urls.getRecommendList, 'get', {
                pPage: this.page, 
                pPerNum: this.pageNumber,
            });
            let state = {};
            console.log(info);
            // console.log(list);
            if(info && info.sTatus && info.proInfo) {
                state.fetchError = false;
                state.goodIofo = info.proInfo;
                // state.goodIofo.gDel = 1;
                state.isFavorite = info.proInfo.fStatus == 1 ? true : false;
                if(list && list.sTatus && list.proAry && list.proAry.length) {
                    state.goodList = list.proAry;
                    this.page++;
                }
            }else {
                state.fetchError = true;
            }
            this.setState(state);
        }
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

    //商品属性选择结果
    attrCallBack = (datas, tourist) => {
        if(datas && datas.names) {
            this.attrDatas = datas;
            this.error = 0;
            this.message = Lang[Lang.default].successfullyJoinCar;
        }else {
            this.error = 9;
            this.message = Lang[Lang.default].paramError;
        }
        if(tourist) this.userinfo = tourist;
        this.setState({
            selected: datas.names,
            showAttrBox: false,
            showReturnMsg: true,
        }, () => {
            this.timer = setTimeout(()=>{
                if(this.state.showReturnMsg) {
                    this.hideReturnMsg();
                }
            }, 2500);
        });
    };

    //隐藏提示框
    hideReturnMsg = () => {
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

    render() {
        let { navigation } = this.props;
        let good = this.state.goodIofo || {};
        let gdel = good.gDel && good.gDel != '0' ? true : false;
        let left = <BtnIcon width={PX.headIconSize} press={()=>{navigation.goBack(null);}} src={require("../../images/back.png")} />;
        let right = (
            <View style={styles.rowStyle}>
                <BtnIcon width={PX.headIconSize} src={
                    this.state.isFavorite ? 
                    require("../../images/product/favorite_on.png") :
                    require("../../images/product/favorite.png")} 
                />
                <BtnIcon width={PX.headIconSize} style={{marginLeft: 5}} src={require("../../images/product/share_orange.png")} />
            </View>
        );
        return (
            <View style={styles.flex}>
                <AppHead 
                    title={Lang[Lang.default].productDetails}
                    left={left}
                    right={right}
                    onPress={()=>{
                        this.ref_flatList && this.ref_flatList.scrollToOffset({offset: 0, animated: true});
                    }}
                />
                <View style={styles.flex}>
                    {this.state.fetchError === null ?
                        null : (this.state.fetchError ?
                            <View style={errorStyles.bodyView}>
                                <Text style={errorStyles.refaceBtn} onPress={this.initDatas}>{Lang[Lang.default].reconnect}</Text>
                                <Text style={errorStyles.errRemind}>{Lang[Lang.default].fetchError}</Text>
                            </View>
                            : this.pageBody()
                        )
                    }
                </View>
                <View style={styles.footRow}>
                    <View style={styles.rowStyle}>
                        <BtnIcon 
                            src={require('../../images/product/custem_center.png')} 
                            width={22} 
                            style={styles.productContactImg} 
                            text={Lang[Lang.default].customer}
                            txtStyle={styles.productContactTxt}
                            txtViewStyle={{minHeight: 12}}
                        />
                        <BtnIcon 
                            src={require('../../images/navs/carSelect.png')} 
                            width={22} 
                            style={styles.productContactImg} 
                            text={Lang[Lang.default].tab_car}
                            txtStyle={styles.productContactTxt}
                            txtViewStyle={{minHeight: 12}}
                        />
                    </View>
                    <View style={styles.rowStyle}>
                        <TouchableOpacity 
                            activeOpacity ={1} 
                            style={[styles.btnProductShopping, {
                                backgroundColor: gdel ? Color.lightGrey : Color.orange,
                            }]}
                        >
                            <Text style={styles.txtStyle8}>{Lang[Lang.default].buyNow}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity ={1} 
                            style={[styles.btnProductShopping, {
                                backgroundColor: gdel ? Color.gray : Color.mainColor,
                            }]}
                            onPress={() => {this.showAttr(0)}}
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
                        hideMsg={this.hideReturnMsg}
                    />
                    : null
                }
            </View>
        );
    }

    pageBody = () => {
        let good = this.state.goodIofo || {};
        let gid = parseInt(good.gID) || 0;
        if(gid && gid > 0) {
            let attrs = good.attrs || [];
            let chlidAtrrs = good.chlidAtrrs || [];
            let priceAtrrs = good.priceAtrrs || [];
            let pWarehouse = good.pWarehouse || [];
            let areas = good.areas || [];
            let mCoupon = good.mCoupon || [];
            return (
                <View>
                    <FlatList
                        ref={(_ref)=>this.ref_flatList=_ref} 
                        data={this.state.goodList}
                        numColumns={2}
                        onScroll={this._onScroll}
                        removeClippedSubviews={false}
                        contentContainerStyle={styles.flatListStyle}
                        keyExtractor={(item, index) => (index)}
                        enableEmptySections={true}
                        renderItem={this._renderItem}
                        ListHeaderComponent={this.pageHead}
                        onEndReached={()=>{
                            if(!this.loadMoreLock) {
                                console.log('正在加载更多 ..');
                                this.loadMore();
                            }else {
                                console.log('加载更多已被锁住。');
                            }
                        }}
                    />
                    <ProductAttr 
                        isShow={this.state.showAttrBox}
                        gid={gid}
                        userid={this.userinfo}
                        attrs={attrs}
                        chlidAtrrs={chlidAtrrs}
                        hideModal={this.hideAttr}
                        type={this.state.attrType}
                        attrCallBack={this.attrCallBack}
                        productImg={good.gThumbPic}
                        productPrice={good.gDiscountPrice}
                        priceAtrrs={priceAtrrs}
                        pWarehouse={good.pWarehouse}
                    />
                    <Areas
                        gid={gid}
                        areas={good.areas}
                        isShow={this.state.showAreas} 
                        hideAreasBox={this.hideAreasBox}
                        getSelectArea={this.getSelectArea}
                    />
                    <Coupons
                        gid={gid}
                        userinfo={this.userinfo}
                        coupons={mCoupon}
                        isShow={this.state.showCouponList} 
                        hideCouponBox={this.hideCouponBox}
                    />
                </View>
            );
        }else {
            return null;
        }
    };

    //商品主要信息
    productInfo = () => {
        if(!this.state.goodIofo) return null;
        let good = this.state.goodIofo || {};
        let gid = good.gID;
        let gdel = good.gDel && good.gDel != '0' ? true : false;
        let name = good.gName || null;
        let price = good.gDiscountPrice || null;
        let marketPrice = good.gPrices || null;
        let shopName = good.sName || null;
        let shopHead = good.sLogo || null;
        shopHead = shopHead ? {uri: shopHead} : require('../../images/empty.png');
        let isGive = parseInt(good.gIntegral) || 0;
        let isExchange = (good.gIsIntegral && good.gIsIntegral !== '0') ? true : false;
        let isLimit = good.aStatus == 1 ? true : false;
        let endTime = good.aEndtime || null;
        let coupons = (good.mCoupon && good.mCoupon.length) ? good.mCoupon : null;
        let productArea = good.pAttribution || '';
        let price_arr = [];
        let img_arr = [];
        if(price) {
            price_arr = price.split('.');
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
                                autoplay={true}
                                autoplayTimeout={3}
                                showsButtons={false}
                            >
                                {img_arr.map((item, index)=>{
                                    return <Image key={index} source={{uri: item}} style={styles.productImg} />;
                                })}
                            </Swiper>
                        }
                        <View style={styles.areaStockView}>
                            <Text style={styles.txtStyle1}>{Lang[Lang.default].origin + ': ' + productArea}</Text>
                        </View>
                        <View style={styles.namePriceBoxBg}>
                            <View style={styles.namePriceBox}>
                                <View style={[styles.centerBox, {
                                    height: 47, 
                                    borderBottomColor: Color.lavender,
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
                                <View style={[styles.centerBox, {height: 42}]}>
                                    <Text style={[styles.txtStyle2, {
                                        lineHeight: 17,
                                        color: gdel ? Color.gainsboro : Color.lightBack,
                                    }]} numberOfLines={2}>{name}</Text>
                                </View>
                                <View style={[styles.centerBox, {height: 20}]}>
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
                            <CountDown endTime={endTime} />
                        </View>
                        : null
                    }
                    <View style={styles.selectLineBg}>
                        <View style={styles.selectLineSide}></View>
                        <View style={styles.selectLineMiddle}></View>
                        <View style={styles.selectLineSide}></View>
                    </View>
                    <View style={styles.SelectsBox}>
                        {this.createSelectBox(Lang[Lang.default].selected , 
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
                                <BtnIcon 
                                    src={require('../../images/product/7day.png')} 
                                    width={20} 
                                    style={styles.shopMarkImg} 
                                    text={Lang[Lang.default].sevenDays} 
                                    txtStyle={styles.shopMarkText}
                                    txtViewStyle={{minHeight: 12}}
                                />
                                <BtnIcon 
                                    src={require('../../images/product/origin.png')} 
                                    width={20} 
                                    style={styles.shopMarkImg} 
                                    text={Lang[Lang.default].certifiedGuarantee} 
                                    txtStyle={styles.shopMarkText}
                                    txtViewStyle={{minHeight: 12}}
                                />
                                <BtnIcon 
                                    src={require('../../images/product/quick.png')} 
                                    width={20} 
                                    style={styles.shopMarkImg} 
                                    text={Lang[Lang.default].lightningConsignment} 
                                    txtStyle={styles.shopMarkText}
                                    txtViewStyle={{minHeight: 12}}
                                />
                                <BtnIcon 
                                    src={require('../../images/product/direct.png')} 
                                    width={20} 
                                    style={styles.shopMarkImg} 
                                    text={Lang[Lang.default].directDeal} 
                                    txtStyle={styles.shopMarkText}
                                    txtViewStyle={{minHeight: 12}}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.shopBtnBox}>
                        <Text style={[styles.shopBtn, {marginRight: 55}]}>{Lang[Lang.default].shopStroll}</Text>
                        <Text style={styles.shopBtn}>{Lang[Lang.default].shopCollection}</Text>
                    </View>
                </View>
            </View>
        );
    };

    //页面头部 - 商品详情
    pageHead = () => {
        if(!this.state.goodIofo) return null;
        return (
            <View>
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
        let list = this.state.selected;
        let attrText = Lang[Lang.default].nothing;
        if(typeof(list) == 'object' && list && list.length) {
            attrText = list.join(', ');
        }
        return (
            <View style={styles.selectedBox}>
                <Text style={[styles.txtStyle1, {lineHeight: 19}]} numberOfLines={2}>{attrText}</Text>
            </View>
        );
    };

    //运费信息
    getFreightInfo = () => {
        let province = this.province && this.province.name ? this.province.name : null;
        let city = this.city && this.city.name ? this.city.name : '';
        let freight = this.freight || '';
        if(province && freight) {
            let str = Lang[Lang.default].to + ' ' + province + ' ' + city;
            return (
                <View style={styles.selectedBox}>
                    <Text style={styles.txtStyle7} numberOfLines={2}>{str}</Text>
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

    //优惠券列表信息
    couponListInfo = (list) => {
        if(typeof(list) == 'object' && list && list.length) {
            let i = 0;
            return (
                <View style={{paddingRight: 5}}>
                    {list.map((item, index)=>{
                        let name = item.hName || '';
                        let isable = (item.isable && item.isable !== '0') ? true : false;
                        let stime = item.hStartTime || null;
                        let etime = item.hSendTime || null;
                        let ntime = new Date().getTime();
                        stime = new Date(stime).getTime();
                        etime = new Date(etime).getTime();
                        if(i < 2 && isable && stime < ntime && etime > ntime) {
                            i++;
                            return (
                                <View key={index} style={styles.couponRow}>
                                    <Text style={styles.couponIcon}>领</Text>
                                    <Text style={styles.txtStyle7} numberOfLines={1}>{name}</Text>
                                </View>
                            );
                        }else {
                            return null;
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
                width={(Size.width - 5) / 2}
                navigation={this.props.navigation}
                boxStyle={{
                    marginRight: 5,
                    marginBottom: 5,
                }} 
            />
        );
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    whiteBg: {
        backgroundColor: '#fff',
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
    flatListStyle: {
        backgroundColor: Color.lightGrey,
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
    wrapper: {
        // borderBottomWidth: pixel,
        // borderBottomColor: Color.lavender,
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
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 27,
        left: Size.width * (1 - 0.66) / 2,
    },
    namePriceBox: {
        flex: 1,
        margin: 3,
        borderRadius: 3,
        borderWidth: 3,
        borderColor: Color.lightGrey,
        padding: 5,
    },
    timeLimit: {
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 2,
        backgroundColor: Color.red,
        color: '#fff',
        paddingTop: 3,
        paddingBottom: 3,
        fontSize: 12,
        marginRight: 5,
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
        borderRadius: 5,
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
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },
    footRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderTopColor: Color.lavender,
        borderTopWidth: pixel,
    },
    productContactImg: {
        marginLeft: 10,
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