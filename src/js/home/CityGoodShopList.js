/**
 * 首页 - 头部卡片列表(点击) - 城市商品、店铺列表
 * @auther linzeyong
 * @date   2017.05.23
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    Animated,
    Modal,
    ScrollView,
    PanResponder,
} from 'react-native';

import { CachedImage } from "react-native-img-cache";
import Swiper from 'react-native-swiper';
import Util from '../public/utils';
import Urls from '../public/apiUrl';
import Lang, {str_replace} from '../public/language';
import { Size, pixel, PX, Color, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import ProductItem from '../other/ProductItem';
import CityTopImgs from './CityTopImgs';
import { EndView } from '../other/publicEment';

/**
 * 拉线总长         70
 * 露出部份         26
 * startTop 默认偏移量top = 26 - 70 = -44
 * endTop   动画结束后被标题栏摭住的长度，往上为正值
 */
var startTop = -44; 
var endTop = 10;
var topImgHeight = Size.width * 0.48;

export default class CityGoodShopList extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            provinceID: null,
            cityName: null,
            datas: null,
            datas2: null,
            dataNum: null,
            data2Num: null,
            totalNum: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            leftValue: new Animated.Value(0),
            load_or_error: null,
            isFloat: false,
            visiable: false,
            showSort: true,
            cityInfo: null,
            cityImgs: [],
            sortIndex: 0,
            btnDisable: false,
        };
        this.sort = 1;
        this.page = 1;
        this.number = 10;
        this.page2 = 1;
        this.number2 = 10;
        this.cid = null;
        this.index = null;
        this.loadMoreLock = false;
        this.topValue = new Animated.Value(startTop);
        this.lastOffsetY = 0;
        this.btnSortList = [{
            'text': Lang[Lang.default].comprehensive,
            'isRepeat': false,
            'press': ()=>{},
        }, {
            'text': Lang[Lang.default].price,
            'isRepeat': true,
            'press': ()=>{},
        }, {
            'text': '同城日达', // Lang[Lang.default].newGood,
            'isRepeat': false,
            'press': ()=>{},
        }, {
            'text': Lang[Lang.default].popularity,
            'isRepeat': true,
            'press': ()=>{},
        }];
    }

    componentWillMount() {
        let name = this.props.navigation.state.params.name || null;
        this.setState({
            cityName: name,
        });
    }

    componentDidMount() {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params && navigation.state.params.cid) {
            this.cid = navigation.state.params.cid;
            this.index = navigation.state.params.index || 0;
            this.playAnimated();
            this.getCityInfo();
            this.initDatas();
        }
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    //播放动画
    playAnimated = () => {
        if(this.index !== null) {
            let val = this.state.leftValue._value;
            val = !!val;
            if(val != !!this.index) {
                Animated.timing(this.state.leftValue, {
                    toValue: val ? 0 : (Size.width / 2),
                    duration: 150,
                }).start();
            }
        }
    };

    //城市的基本信息
    getCityInfo = () => {
        let that = this;
        Util.fetch(Urls.getCityImgBanner, 'post', {
            cityID: this.cid,
        }, (result) => {
            // console.log(result);
            if(result && result.sTatus == 1 && result.adData) {
                let datas = result.adData || {};
                let areaInfo = datas.areaInfo || [];
                let adsInfo = datas.adsImg || [];
                let obj = {
                    cityImgs: [].concat(areaInfo, adsInfo),
                };
                if(areaInfo && areaInfo[0]) obj.cityInfo = areaInfo[0];
                that.setState(obj);
            }
        }, null, {catchFunc: (err)=>{
            console.log(err);
        }});
    };
    
    // 获取新数据
    initDatas = () => {
        if(this.index == 0) {
            if(this.state.totalNum && ((this.page - 1) * this.number) >= this.state.totalNum) {
                console.log('无更多商品可以加载。');
            }else {
                console.log('开始加载更多商品。');
                this.getProudctList();
            }
        }else if(this.index == 1) {
            if(this.state.totalNum && ((this.page2 - 1) * this.number2) >= this.state.totalNum) {
                console.log('无更多店铺可以加载。');
            }else {
                console.log('开始加载更多店铺。');
                this.getShopList();
            }
        }
    };

    //获取商品列表
    getProudctList = () => {
        if(this.cid !== null && this.cid > 0 && this.index !== null && !this.loadMoreLock) {
            let that = this;
            this.loadMoreLock = true;
            Util.fetch(Urls.getProductList, 'get', {
                poType: this.sort,
                pCity: this.cid,
                pPage: this.page,
                pPerNum: this.number,
            }, function(result) {
                console.log(result);
                if(result && result.sTatus && result.proAry && result.proAry.length) {
                    let ret = result.proAry || [];
                    let num = parseInt(result.proNum) || 0;
                    if(that.index == 0) {
                        that.page++;
                        that.loadMoreLock = false;
                        let _datas = that.state.datas ? that.state.datas.concat(ret) : ret;
                        that.setState({
                            datas: _datas,
                            dataNum: num,
                            totalNum: num,
                            dataSource: that.state.dataSource.cloneWithRows(_datas),
                            load_or_error: null,
                            btnDisable: false,
                        });
                        return;
                    }
                }
                that.setState({
                    load_or_error: null,
                    btnDisable: false,
                });
            }, function(view) {
                that.setState({load_or_error: view});
            }, {
                hideLoad: true,
                catchFunc: (err)=>console.log(err),
            });
        }
    };

    //获取商铺列表
    getShopList = () => {
        if(this.cid !== null && this.cid > 0 && this.index !== null && !this.loadMoreLock) {
            let that = this;
            // console.log('开始查询');
            Util.fetch(Urls.getCityShopList, 'get', {
                sCityID: this.cid,
                sPage: that.page2,
                sPerNum: that.number2,
            }, function(result){
                // console.log(result);
                if(result && result.sTatus && result.shopAry && result.shopAry.length) {
                    // console.log('查询结果可用');
                    let ret = that.getNoEmptyData(result.shopAry);
                    let num = result.shopNum || 0;
                    if(that.index == 1) {
                        that.page2++;
                        that.loadMoreLock = false;
                        let _datas = that.state.datas2 ? that.state.datas2.concat(ret) : ret;
                        // console.log(_datas);
                        that.setState({
                            datas2: _datas,
                            data2Num: num,
                            totalNum: num,
                            dataSource: that.state.dataSource.cloneWithRows(_datas),
                            load_or_error: null,
                        });
                        return;
                    }
                }
                that.setState({load_or_error: null});
            }, function(view) {
                that.setState({load_or_error: view});
            }, {
                hideLoad: true,
            });
        }
    };

    //过滤店铺下无商品的数据
    getNoEmptyData = (data) => {
        let list = [];
        if(data) {
            for(let i in data) {
                let goods = data[i].recomdProduct || [];
                if(goods.length) list.push(data[i]);
            }
        }
        return list;
    };

    //切换列表
    changeList = (_index) => {
        if(_index == 0 || _index == 1) {
            //重置部分属性
            this.index = _index;
            this.playAnimated();
            this.loadMoreLock = false;
            //更换列表数据
            let _datas = this.index ? this.state.datas2 : this.state.datas;
            let _total = this.index ? this.state.data2Num : this.state.dataNum;
            if(_datas && _total) {
                this.setState({
                    totalNum: _total,
                    dataSource: this.state.dataSource.cloneWithRows(_datas),
                });
            }else {
                this.initDatas();
            }
        }
    };

    //拉环伸缩动画
    lineSwitchPlay = (val) => {
        Animated.spring(this.topValue, {
            toValue: val,
            friction: 4,        //摩擦力
            tension: 40,        //张力
        }).start();
    };

    //拉环触屏事件
    _panResponder = PanResponder.create({
        // 要求成为响应者：
        onStartShouldSetPanResponder: (evt, gestureState) => false,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderGrant: (evt, gestureState) => {
            //console.group('触屏开始');
        },
        onPanResponderMove: (evt, gestureState) => {
            //console.group('触屏过程');
            const {dy} = gestureState;
            let y = startTop + dy;
            if(y < 0) {
                this.topValue.setValue(y);
            }
        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
            //console.group('触屏结束');
            const {dy} = gestureState;
            if(dy > 10) {
                Animated.spring(this.topValue, {
                    toValue: -endTop,
                    friction: 4,        //摩擦力
                    tension: 40,        //张力
                }).start();
                this.setState({visiable: true});
            } else {
                Animated.spring(this.topValue, {
                    toValue: startTop,
                    friction: 4,        //摩擦力
                    tension: 40,        //张力
                }).start();
            }
        },
        onShouldBlockNativeResponder: (evt, gestureState) => {
            // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
            // 默认返回true。目前暂时只支持android。
            return true;
        },
    });

    render() {
        let _style = {};
        let { navigation } = this.props;
        if(this.state.isFloat) {
            _style = {
                position: 'absolute',
                left: 0,
                top: 0,
            };
        }
        let btnBox = (
            <View style={[styles.topBtnBox, _style]}>
                <View style={styles.btnTopLineBox}>
                    <Animated.View style={[styles.btnTopLine, {
                        left: this.state.leftValue,
                    }]}>
                    </Animated.View>
                </View>
                <View style={[styles.topBtnRow, {backgroundColor: '#f8f8f8'}]}>
                    <TouchableOpacity onPress={()=>{
                        this.changeList(0);
                    }} style={styles.flex}>
                        <View style={[styles.topBtnView, {
                            borderRightWidth: 1,
                            borderRightColor: Color.lavender,
                        }]}>
                            <Text style={styles.defaultFont}>{Lang[Lang.default].product}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        this.changeList(1);
                    }} style={styles.flex}>
                        <View style={styles.topBtnView}>
                            <Text style={styles.defaultFont}>{Lang[Lang.default].shop}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {(this.state.showSort && this.index === 0) ?
                    <View style={styles.topBtnRow}>
                        {this.btnSortList.map(this.rendSortItem)}
                    </View>
                    : null
                }
            </View>
        );
        let isSimple = true;
        let body = (
            <View style={styles.flex}>
                <View>
                    <ListView
                        ref={(ref)=>this.ref_listview=ref}
                        dataSource={this.state.dataSource}
                        onScroll={this._onScroll}
                        contentContainerStyle={styles.listViewStyle}
                        removeClippedSubviews={false}
                        renderRow={(obj, sectionID, rowID) => {
                            if(this.index == 0) {
                                //商品列表
                                if(this.state.dataSource._cachedRowCount > 3) {
                                    return isSimple ?
                                        this._renderItem_simple(obj, sectionID, rowID, this.state.totalNum)
                                        : this._renderItem(obj, sectionID, rowID, this.state.totalNum);
                                }else {
                                    return this._renderItem2(obj, sectionID, rowID);
                                }
                            }else {
                                //店铺列表
                                return this._renderItem3(obj, sectionID, rowID);
                            }
                        }}
                        enableEmptySections={true}  //允许空数据
                        renderHeader={()=>this.pageTop(this.state.isFloat ? null : btnBox)}
                        renderFooter={()=>{
                            let list = this.state.dataSource || null;
                            if((this.index == 1 || isSimple) && list && list._cachedRowCount > 1) {
                                return <EndView style={{width: Size.width, }} />;
                            }else {
                                return <View />;
                            }
                        }}
                        onEndReached={()=>{
                            if(!this.loadMoreLock) {
                                this.initDatas();
                            }else {
                                console.log('加载更多已被锁住。');
                            }
                        }}
                        // onEndReachedThreshold={50}
                    />
                </View>
                {this.isEmptyList() ?
                    <View style={styles.noContentBox}>
                        <Image source={require('../../images/home/noContent.png')} style={styles.noContentImg}>
                            <Text style={styles.fontStyle1}>该地区还没有信息。</Text>
                            <Text style={styles.fontStyle1}>小二正在努力补充中!</Text>
                        </Image>
                    </View>
                    : null
                }
            </View>
        );
        return (
            <View style={styles.flex}>
                <View style={{height: PX.headHeight, }}>
                    <AppHead
                        center={
                            <TouchableOpacity onPress={()=>{
                                if(this.ref_listview) {
                                    this.ref_listview.scrollTo({x: 0, y: 0, animated: true})
                                }
                            }} style={{flexDirection: 'row',}}>
                                <Image source={require("../../images/car/address_nav.png")} style={{
                                    width: 20,
                                    height: 20,
                                }} />
                                <Text style={{
                                    color: Color.mainColor,
                                    fontSize: FontSize.headFontSize,
                                    fontWeight: FontSize.headFontWeight,
                                }}>{this.state.cityName}</Text>
                            </TouchableOpacity>
                        }
                        goBack={true}
                        navigation={navigation}
                        float={true}
                    />
                </View>
                <View style={styles.bodyStyle}>
                    {this.state.load_or_error ?
                        this.state.load_or_error : body
                    }
                    {this.state.isFloat ? btnBox : null}
                    <Animated.View style={[styles.topSwitchBox, {top: this.topValue}]} {...this._panResponder.panHandlers}>
                        <TouchableOpacity onPress={()=>{
                            // this.lineSwitchPlay(-endTop);
                            // this.setState({visiable: true});
                        }} style={styles.centerStyle}>
                            <Image 
                                resizeMode="stretch"
                                style={styles.topSwitchImg}
                                source={require('../../images/home/lahuan.png')} 
                            />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                <ModalContent cityInfo={this.state.cityInfo} visiable={this.state.visiable} hideModal={()=>{
                    this.lineSwitchPlay(startTop);
                    this.setState({visiable: false});
                }} />
            </View>
        );
    }

    rendSortItem = (item, index) => {
        let color = this.state.sortIndex == index ? Color.mainColor : Color.lightBack;
        let icon = (this.state.sortIndex == index && this.sort != (index + 1)) ?
            require('../../images/more_up.png') : 
            require('../../images/more_down.png');
        return (
            <TouchableOpacity disabled={this.state.btnDisable} key={index} onPress={()=>{
                if(item.isRepeat || this.state.sortIndex != index) {
                    this.page = 1;
                    this.loadMoreLock = false;
                    if(item.isRepeat) {
                        if(this.state.sortIndex == index) {
                            if(this.sort == 2) {
                                this.sort = 5;
                            }else if(this.sort == 4) {
                                this.sort = 6;
                            }else if(this.sort == 5) {
                                this.sort = 2;
                            }else if(this.sort == 6) {
                                this.sort = 4;
                            }
                        }else {
                            this.sort = (index == 1) ? 5 : (index + 1);
                        }
                    }else {
                        this.sort = (index == 1) ? 5 : (index + 1);
                    }
                    this.setState({
                        sortIndex: index,
                        datas: null,
                        dataNum: null,
                        btnDisable: true,
                    }, this.getProudctList);
                }
            }} style={styles.flex}>
                <View style={styles.topBtnView}>
                    <Text style={[styles.defaultFont, {color: color}]}>{item.text}</Text>
                    {item.isRepeat ?
                        <Image source={icon} style={styles.btnRightIcon} />
                        : null
                    }
                </View>
            </TouchableOpacity>
        )
    };

    isEmptyList = () => {
        let datas = this.index ? this.state.datas2 : this.state.datas;
        if(this.state.dataSource._cachedRowCount === 0) {
            return true;
        }else if(datas && datas[0] && datas[0].recomdProduct) {
            let empty = true;
            for(let i in datas) {
                if(datas[i].recomdProduct.length > 0) {
                    empty = false;
                }
            }
            return empty;
        }else {
            return false;
        }
    };

    //页面头部
    pageTop = (btnBox) => {
        return (
            <View style={styles.topBgBox}>
                <View style={styles.topBgImgBox}>
                    <CityTopImgs 
                        width={Size.width} 
                        height={topImgHeight} 
                        cityImgs={this.state.cityImgs} 
                        navigation={this.props.navigation} 
                    />
                </View>
                {btnBox}
            </View>
        );
    };

    // 商品列表的行内容(多于3行, 规格排列)
    _renderItem_simple = (obj, sectionID, rowID, num) => {
        return (
            <ProductItem 
                product={obj} 
                key={rowID}
                showLimit={true}
                goodNameViewStyle={{height: 30}}
                goodPriceStyle={{height: 35}}
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

    // 商品列表的行内容(多于3行)
    _renderItem = (obj, sectionID, rowID, num) => {
        let marginNumber = 4;
        let width = (Size.width - marginNumber) / 2;
        let _height = width + 65 + marginNumber;
        let ad = null;
        let _marginTop = 0;
        let _marginRight = 0;
        let end = null;
        if(rowID % 2 === 0) _marginRight = marginNumber;
        if(rowID > 0 && rowID % 2 === 0) _marginTop = -64 - marginNumber;
        if(rowID == 1) {
            _height += 64 + marginNumber;
            ad = (
                <View style={{
                    width: width,
                    height: 64,
                    marginBottom: marginNumber,
                }}>
                    <Image source={require('../../images/home/listBanner.jpg')} style={{
                        width: width,
                        height: 64,
                    }} />
                </View>
            );
        }

        if(rowID == (num - 2)) {
            let end_height = 64;
            if(num % 2) {
                end_height = width + 65 - 64;
            }
            end = (
                <View style={{
                    width: width,
                    height: end_height,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image source={require('../../images/home/onEnd.png')} style={styles.onEndImgStyle}>
                        <Text style={styles.fontStyle1}>{Lang[Lang.default].inTheEnd}</Text>
                    </Image>
                </View>
            );
            _height += end_height;
        }else if (rowID == (num - 1) && num % 2) {
            _marginTop = -width - 64 - marginNumber;
        }

        return (
            <View key={rowID} style={{
                width: width,
                height: _height,
                marginRight: _marginRight,
                marginTop: _marginTop,
                // marginBottom: 5,
            }}>
                {ad}
                <ProductItem
                    key={rowID}
                    width={width}
                    product={obj}
                    goodNameViewStyle={{height: 30}}
                    goodPriceStyle={{height: 35}}
                    navigation={this.props.navigation}
                    showLimit={true}
                />
                {end}
            </View>
        );
    };

    // 商品列表的行内容(不多于3行)
    _renderItem2 = (obj, sectionID, rowID) => {
        let imgurl = obj.gThumBPic || null;
        let img = imgurl ? {uri: imgurl} : require('../../images/empty.jpg');
        let name = obj.gName || '';
        let sname = obj.sShopName || '';
        let stock = obj.stock || 0;
        let price = obj.gDiscountPrice || null;

        return (
            <View key={rowID} style={[styles.rowStyle, {
                width: Size.width,
                height: Size.width * 0.507,
                marginBottom: PX.marginTB,
                backgroundColor: '#fff',
            }]}>
                <View style={styles.goodLeftView}>
                    <CachedImage style={styles.goodImgStyle} source={img} />
                </View>
                <View style={styles.goodRightView}>
                    <View>
                        <TouchableOpacity style={{
                            marginBottom: 13, 
                            marginTop: 10,
                            paddingTop: 0,
                            paddingBottom: 0,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Image source={require("../../images/car/shophead.png")} style={{
                                width: 15,
                                height: 15,
                            }} />
                            <Text style={styles.fontStyle6}>{sname}</Text>
                        </TouchableOpacity>
                        <Text style={styles.fontStyle3}>{name}</Text>
                    </View>
                    <View>
                        <Text style={[styles.fontStyle5, {paddingBottom: 15,}]}>
                            {Lang[Lang.default].RMB}
                            <Text style={{fontSize: 19}}>{price}</Text>
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    // 店铺列表
    _renderItem3 = (obj, sectionID, rowID) => {
        let { navigation } = this.props;
        let sid = obj.sId || null;
        let name = obj.sShopName || '';
        let list = obj.recomdProduct || [];
        if(list.length == 0) return <View key={rowID}></View>;
        return (
            <View key={rowID} style={[styles.shopItemBox, styles.shadowStyle]}>
                <View style={styles.shopItemTop}>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Image source={require('../../images/car/shophead.png')} style={{
                            width: 26,
                            height: 26,
                        }} />
                        <Text style={styles.fontStyle6}>{name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.btnGoToShop} onPress={()=>{
                        if(sid) {
                            navigation.navigate('Shop', {shopID: sid,})
                        }
                    }}>{Lang[Lang.default].gotoShop}</Text>
                </View>
                <View style={{width: Size.width - 25}}>
                <Swiper
                    width={Size.width - 25}
                    height={(Size.width - 25) * 0.4 + 26}
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
                            backgroundColor:'rgba(0, 0, 0, .8)',
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            margin: 5,
                        }}
                    />)}
                    autoplay={false}
                    showsButtons={false}>
                    {list.map(function(item, index) {
                        let gid = item.gID || 0;
                        let gimg = item.gThumBPic || null;
                        let img = gimg ? {uri: gimg} : require('../../images/empty.jpg');
                        let gname = item.gName || null;
                        let gstock = 99;
                        let gprice = item.gDiscountPrice || null;
                        if(gid > 0) {
                            return (
                                <TouchableOpacity key={index} style={styles.swiperGoodItem} onPress={()=>{
                                    navigation.navigate('Product', {gid: gid});
                                }}>
                                    <View>
                                        <Image source={img} style={styles.swiperGoodImg} />
                                    </View>
                                    <View style={styles.swiperItemRight}>
                                        <View>
                                            <Text style={styles.fontStyle3}>{gname}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.fontStyle5}>
                                                {Lang[Lang.default].RMB}
                                                <Text style={{fontSize: 19}}>{gprice}</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        }else {
                            return null;
                        }
                    })}
                </Swiper>
                </View>
            </View>
        );
    };

    _onScroll = (e) => {
        let offsetY = e.nativeEvent.contentOffset.y || 0;
        //判断浮动
        if(offsetY > topImgHeight && !this.state.isFloat) {
            this.setState({isFloat: true});
        }else if(offsetY < topImgHeight && this.state.isFloat) {
            this.setState({isFloat: false});
        }

        if(this.index === 0) {
            //判断是否显示排序
            let minY = 20; // 显示/隐藏 至少需移动的最小距离
            if(offsetY > topImgHeight && (offsetY - minY) > this.lastOffsetY && this.state.showSort) {
                //当移动距离大于顶部背景图的高度时,向上不显示排序按钮行
                this.setState({showSort: false});
            }else if(offsetY > topImgHeight && offsetY < (this.lastOffsetY - minY) && !this.state.showSort) {
                //当移动距离大于顶部背景图的高度时,向下显示排序按钮行
                this.setState({showSort: true});
            }else if(offsetY < topImgHeight && !this.state.showSort) {
                //当移动距离小于顶部背景图的高度时,不隐藏
                this.setState({showSort: true});
            }
        }
        this.lastOffsetY = offsetY;
    };
}

// 城市简介
class ModalContent extends Component {
    render() {
        let {cityInfo, visiable} = this.props;
        if(!cityInfo) return null;
        let name = cityInfo.region_name || '';
        let pingying = cityInfo.griSpell || '';
        let content = cityInfo.griInfo || '';
        let details = [content]
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={visiable}
                onRequestClose={() => {
                }}
            >
                <View style={styles.modalBody}>
                    <View style={[styles.modalMain, styles.shadowStyle]}>
                        <View style={styles.modalTopView}>
                            <Image style={styles.overNameImg} source={require('../../images/home/citybg.jpg')}>
                                <TouchableOpacity onPress={this.props.hideModal} style={{
                                    marginLeft: 7,
                                }}>
                                    <Image style={styles.closeImg} source={require('../../images/close.png')} />
                                </TouchableOpacity>
                            </Image>
                        </View>
                        <View style={styles.circleImgBox}>
                            <Image
                                resizeMode="stretch"
                                style={styles.topSwitchImg}
                                source={require('../../images/home/lahuan.png')} 
                            />
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <View style={styles.nameBorder}>
                                <Text style={styles.cityNameStyle}>{name}</Text>
                            </View>
                            <Text style={styles.cityPingYingStyle}>{pingying}</Text>
                        </View>
                        <View style={styles.pTextBox}>
                            <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                                {details.map(function(item, index) {
                                    let img = index % 2 ? 
                                        require('../../images/home/locationorange.png') : 
                                        require('../../images/home/locationyellow.png');
                                    return (
                                        <View key={index} style={styles.pTextItem}>
                                            <Image source={img} style={styles.pTextImg} />
                                            <Text style={styles.pTextStyle}>{item}</Text>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    bodyStyle: {
        flex: 1,
        overflow: 'hidden',
    },
    centerStyle: {
        flex: 1,
        alignItems: 'center',
    },
    shadowStyle: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 0.5,
        shadowOffset: {"height": 0.5},
        elevation: 2,
    },
    defaultFont: {
        color: Color.lightBack,
        fontSize: 14,
    },
    fontStyle1: {
        fontSize: 12,
        color: Color.gainsboro2,
        lineHeight: 18,
    },
    fontStyle2: {
        fontSize: 12,
        color: Color.gray,
    },
    fontStyle3: {
        fontSize: 14,
        color: Color.lightBack,
        lineHeight: 17,
    },
    fontStyle4: {
        fontSize: 11,
        color: Color.gray,
    },
    fontStyle5: {
        fontSize: 10,
        color: Color.red,
    },
    fontStyle6: {
        fontSize: 12,
        color: Color.lightBack,
        paddingLeft: 5,
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listViewStyle : {
        backgroundColor: Color.floralWhite,
        flexDirection : 'row',
        flexWrap: 'wrap',
    },
    noContentBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.floralWhite,
    },
    noContentImg: {
        width: 185,
        height: 102,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    topBgBox: {
        width: Size.width,
    },
    topBtnBox: {
        paddingBottom: 5,
    },
    topBgImgBox: {
        height: topImgHeight,
        width: Size.width,
    },
    topBgImg: {
        height: topImgHeight,
        width: Size.width,
    },
    topSwitchBox: {
        width: 10 + 20,
        height: 70 + 15,
        position: 'absolute',
        right: Size.width * 0.128 - 10,
        paddingBottom: 15,
    },
    topSwitchImg: {
        width: 10,
        height: 70,
    },
    btnTopLineBox: {
        width: Size.width,
        height: 3,
        backgroundColor: Color.floralWhite,
    },
    btnTopLine: {
        width: Size.width / 2,
        height: 3,
        backgroundColor: Color.mainColor,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    topBtnRow: {
        height: PX.rowHeight2,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
        backgroundColor: '#fff',
    },
    topBtnView: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnRightIcon: {
        width: 15,
        height: 15,
    },
    onEndImgStyle: {
        width: 100,
        height: 64,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    goodLeftView: {
        borderRightColor: Color.lavender,
        borderRightWidth: pixel,
    },
    goodImgStyle: {
        width: Size.width * 0.507,
        height: Size.width * 0.507,
    },
    goodRightView: {
        width: Size.width - (Size.width * 0.507) - 7 - 15,
        height: Size.width * 0.507,
        justifyContent: 'space-between',
        paddingLeft: 7,
    },
    modalBody: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalMain: {
        width: Size.width * 0.853,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginTop: PX.headHeight + 70 - 16 - endTop,
        paddingBottom: 15,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
    },
    overNameImg: {
        width: Size.width * 0.853,
        height: 92,
        justifyContent: 'space-between',
        marginTop: 8,
    },
    closeImg: {
        width: 26,
        height: 26,
    },
    circleImgBox: {
        width: 10,
        height: 70,
        position: 'absolute',
        right: Size.width * 0.128 - (((Size.width * (1 - 0.853))) / 2) - 0.14,
        top: -54,
    },
    nameBorder: {
        borderBottomColor: Color.lightBack,
        borderBottomWidth: 1,
        padding: 3,
    },
    cityNameStyle: {
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: 14,
        color: Color.lightBack,
    },
    cityPingYingStyle: {
        fontSize: 10,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 5,
        paddingRight: 5,
        color: Color.lightBack,
    },
    pTextBox: {
        paddingTop: PX.marginLR,
        paddingBottom: PX.marginLR,
        maxHeight: Size.height - ((PX.headHeight + 70 - 16 - endTop) * 2) - 150,
    },
    pTextItem: {
        marginBottom: PX.marginLR,
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
    },
    pTextImg: {
        width: PX.iconSize26,
        height: PX.iconSize26,
    },
    pTextStyle: {
        flex: 1,
        paddingLeft: 5,
        fontSize: 12,
        color: Color.lightBack,
        lineHeight: 18,
    },
    shopItemBox: {
        paddingLeft: 10,
        paddingRight: PX.marginLR,
        backgroundColor: '#fff',
        marginBottom: PX.marginTB,
    },
    shopItemTop: {
        width: Size.width - 25,
        height: PX.rowHeight2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btnGoToShop: {
        fontSize: 11,
        color: Color.gainsboro,
        paddingTop: 6,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: Color.gray,
    },
    paginationStyle: {
        position: 'absolute',
        left: 0,
        right: 0, 
        bottom: 0,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    swiperGoodItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderWidth: pixel,
        borderColor: Color.lavender,
    },
    swiperGoodImg: {
        width: (Size.width - 25) * 0.4,
        height: (Size.width - 25) * 0.4,
    },
    swiperItemRight: {
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 5,
        borderLeftWidth: pixel,
        borderLeftColor: Color.lavender,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
});