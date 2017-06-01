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

import Swiper from 'react-native-swiper';
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import Goods from '../datas/goods.json';
import ProductItem from '../other/ProductItem';
import CountDown from '../find/CountDown';

export default class ProductScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: false,
            goodList: null,     //猜你喜欢的商品列表
            goodIofo: null,
            details: null,
            webViewHeight: 0,
        };
    }

    componentDidMount() {
        let gid = this.props.navigation && 
            this.props.navigation.state &&
            this.props.navigation.state.params && 
            this.props.navigation.state.params.gid ?
            this.props.navigation.state.params.gid : 0;
        if(gid && gid > 0) {
            this.initDatas(gid);
        }
    }

    //初始化数据
    initDatas = async (id) => {
        let info = await Utils.async_fetch(Urls.getProductInfo, 'get', {gID: id});
        // let detail = await Utils.async_fetch(Urls.getProductDetails, 'get', {gID: id});
        let html = '<p style="white-space: normal;"><img src="http://www.jingtaomart.com/bdimages/upload1/20160822/1471854636374275.png" title="五常大米-款2详情图_01.png"/></p><p style="white-space: normal;"><img src="http://www.jingtaomart.com/bdimages/upload1/20160820/1471654771409435.png" title="五常大米-款2详情图_02.png"/></p><p style="white-space: normal;"><img src="http://www.jingtaomart.com/bdimages/upload1/20160820/1471654771766714.png" title="五常大米-款2详情图_03.png"/></p><p style="white-space: normal;"><img src="http://www.jingtaomart.com/bdimages/upload1/20160820/1471654773812607.png" title="五常大米-款2详情图_04.png"/></p><p style="white-space: normal;"><img src="http://www.jingtaomart.com/bdimages/upload1/20160820/1471654774857299.png" title="五常大米-款2详情图_05.png"/></p><p style="white-space: normal;"><img src="http://www.jingtaomart.com/bdimages/upload1/20160820/1471654775754350.png" title="五常大米-款2详情图_06.png"/></p><p><br/></p>';
        html = '<div id="box">' + html + '</div>';
        let script = 
        '<script type="text/javascript">' + 
            'window.onload = function(){' +
                'var width = document.body.offsetWidth;' +
                'var height = document.body.offsetHeight;' +
                'console.log(height);' +
                'document.title = "640*6154";' +
                'window.location.hash = "#" + height;' +
            '}' +
        '</script>';
        // console.log(info);
        if(info && info.sTatus && info.proAry) {
            console.log(info.proAry);
            this.setState({
                goodList: Goods,
                goodIofo: info.proAry,
                details: html + script,
            });
        }
    };

    render() {
        let { navigation } = this.props;
        let gid = navigation.state.params.gid || 0;
        let left = <BtnIcon width={PX.headIconSize} press={()=>{navigation.goBack(null);}} src={require("../../images/back.png")} />;
        let right = (
            <View style={styles.rowStyle}>
                <BtnIcon width={PX.headIconSize} src={
                    this.state.isFavorite ? 
                    require("../../images/favorite_on.png") :
                    require("../../images/favorite.png")} 
                />
                <BtnIcon width={PX.headIconSize} style={{marginLeft: 5}} src={require("../../images/share_orange.png")} />
            </View>
        );
        return (
            <View style={styles.flex}>
                <AppHead 
                    title={Lang[Lang.default].productDetails}
                    left={left}
                    right={right}
                    onPress={()=>{
                        this.ref_flatList && this.ref_flatList.scrollToOffset({x: 0, y: 0, animated: true});
                    }}
                />
                <View style={styles.flex}>
                    {gid && gid > 0 ?
                        <FlatList
                            ref={(_ref)=>this.ref_flatList=_ref} 
                            data={this.state.goodList}
                            numColumns={2}
                            removeClippedSubviews={false}
                            contentContainerStyle={styles.flatListStyle}
                            keyExtractor={(item, index) => (index)}
                            enableEmptySections={true}
                            renderItem={this._renderItem}
                            ListHeaderComponent={this.pageHead}
                            onEndReached={()=>{
                                // this.loadMore();
                            }}
                        />
                        : null
                    }
                </View>
            </View>
        );
    }

    //页面头部 - 商品详情
    pageHead = () => {
        if(!this.state.goodIofo) return null;
        
        let good = this.state.goodIofo || {};
        let webStyle = {
            width: Size.width,
            height: this.state.webViewHeight,
        };
        let name = good.gName || null;
        let price = good.gDiscountPrice || null;
        let marketPrice = good.gPrices || null;
        let price_arr = [];
        let img_arr = [];
        if(price) {
            price_arr = price.split('.');
        }
        for(let i in good.gImgs) {
            let _img = good.gImgs[i].pUrl || null;
            let _isDel = parseInt(good.gImgs[i].pDel) || false;
            if(_img && !_isDel) {
                img_arr.push(_img);
            }
        }
        let startTime = new Date().getTime();
        let endTime = new Date('2017/6/28 23:59:59').getTime();
        let shopHead = good.gShop.sLogo || null;
        shopHead = shopHead ? {uri: shopHead} : require('../../images/empty.png');
        let shopName = good.gShop.sShopName || null;

        return (
            <View>
                <View style={styles.whiteBg}>
                    <View style={styles.productImgBox}>
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
                                return <Image key={index} source={{uri: item}} style={{width: Size.width, height: Size.width}} />;
                            })}
                        </Swiper>
                        <View style={styles.areaStockView}>
                            <Text style={[styles.txtStyle1, {paddingRight: 20}]}>{Lang[Lang.default].stock + ': 1000'}</Text>
                            <Text style={styles.txtStyle1}>{Lang[Lang.default].origin + ': 宁波'}</Text>
                        </View>
                        <View style={styles.namePriceBoxBg}>
                            <View style={styles.namePriceBox}>
                                <View style={[styles.centerBox, {
                                    height: 47, 
                                    borderBottomColor: Color.lavender,
                                    borderBottomWidth: pixel,
                                }]}>
                                    <Text style={[styles.txtStyle3, {paddingRight: 5, paddingTop: 4}]}>{Lang[Lang.default].RMB}</Text>
                                    {price_arr[0] ?
                                        <Text style={styles.txtStyle4}>{price_arr[0]}</Text>
                                        : null
                                    }
                                    {price_arr[1] ?
                                        <Text style={[styles.txtStyle5, {paddingRight: 5, paddingTop: 8}]}>{'.' + price_arr[1]}</Text>
                                        : null
                                    }
                                    <Text style={[styles.txtStyle6, {paddingTop: 7}]}>{marketPrice}</Text>
                                </View>
                                <View style={[styles.centerBox, {height: 42}]}>
                                    <Text style={[styles.txtStyle2, {lineHeight: 17}]} numberOfLines={2}>{name}</Text>
                                </View>
                                <View style={[styles.centerBox, {height: 20}]}>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.CountDownBox}>
                        <CountDown startTime={startTime} endTime={endTime} />
                    </View>
                    <View style={styles.selectLineBg}>
                        <View style={styles.selectLineSide}></View>
                        <View style={styles.selectLineMiddle}></View>
                        <View style={styles.selectLineSide}></View>
                    </View>
                    <View style={styles.SelectsBox}>
                        {this.createSelectBox('规格', null)}
                        {this.createSelectBox('运费', null)}
                        {this.createSelectBox('领券', null)}
                    </View>
                </View>
                <View style={styles.shopBox}>
                    <View style={styles.headNameBox}>
                        <View style={styles.shopHeadLeft}>
                            <Image style={styles.shopHeadImg} source={shopHead} />
                        </View>
                        <View style={styles.shopHeadRight}>
                            <View style={styles.rowStyle}>
                                <Image source={require('../../images/vip.png')} style={styles.vipImg} />
                                <Text numberOfLines={1} style={styles.txtStyle2}>{shopName}</Text>
                            </View>
                            <View style={styles.rowStyle}>
                                <BtnIcon 
                                    src={require('../../images/7day.png')} 
                                    width={20} 
                                    style={styles.shopMarkImg} 
                                    text={Lang[Lang.default].sevenDays} 
                                    txtStyle={styles.shopMarkText}
                                    txtViewStyle={{minHeight: 12}}
                                />
                                <BtnIcon 
                                    src={require('../../images/origin.png')} 
                                    width={20} 
                                    style={styles.shopMarkImg} 
                                    text={Lang[Lang.default].certifiedGuarantee} 
                                    txtStyle={styles.shopMarkText}
                                    txtViewStyle={{minHeight: 12}}
                                />
                                <BtnIcon 
                                    src={require('../../images/quick.png')} 
                                    width={20} 
                                    style={styles.shopMarkImg} 
                                    text={Lang[Lang.default].lightningConsignment} 
                                    txtStyle={styles.shopMarkText}
                                    txtViewStyle={{minHeight: 12}}
                                />
                                <BtnIcon 
                                    src={require('../../images/direct.png')} 
                                    width={20} 
                                    style={styles.shopMarkImg} 
                                    text={Lang[Lang.default].directDeal} 
                                    txtStyle={styles.shopMarkText}
                                    txtViewStyle={{minHeight: 12}}
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text></Text>
                        <Text></Text>
                    </View>
                </View>
                <View style={webStyle}>
                    <WebView
                        javaScriptEnabled={true}
                        scalesPageToFit={false}
                        source={{html: this.state.details}}
                        style={webStyle}
                        onNavigationStateChange={(info)=>{
                            // console.log(info);
                            let arr = info.title.split('*');
                            let width = parseInt(arr[0]) || 0;
                            let height = parseInt(arr[1]) || 0;
                            let _height = Size.width * height / width || 0;
                            if(_height < 999999 && _height > 0 && _height != this.state.webViewHeight) {
                                console.log('更新webview高度为：' + _height);
                                this.setState({webViewHeight: _height})
                            }
                        }}
                    />
                </View>
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
    createSelectBox = (title, ement) => {
        return (
            <View style={styles.SelectBox}>
                <View style={styles.SelectBoxChild1}>
                    <View style={styles.SelectBoxChild2}>
                        {ement}
                    </View>
                </View>
                <View style={styles.selectTitleView}>
                    <Text style={styles.SelectTitleText}>{title}</Text>
                </View>
                <View style={styles.selectSpotView}>
                    <Image source={require('../../images/more_dot.png')} style={styles.dotImg} />
                </View>
            </View>
        );
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
        textDecorationLine: 'line-through',
    },
    flatListStyle: {
        backgroundColor: Color.lightGrey,
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
        alignItems: 'center',
        justifyContent: 'center',
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
        bottom: 5,
        alignItems: 'center',
    },
    dotImg: {
        width: 26,
        height: 26,
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
    },
    shopHeadRight: {
        justifyContent: 'space-around',
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