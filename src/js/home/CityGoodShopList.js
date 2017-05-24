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
} from 'react-native';

import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Util from '../public/utils';
import Urls from '../public/apiUrl';
import Lang, {str_replace} from '../public/language';
import { Size, pixel, PX, Color, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import cityGoods from '../datas/cityGoods.json';
import ProductItem from '../other/ProductItem';

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
        };
        this.page = 1;
        this.number = 10;
        this.pid = null;
        this.index = null;
    }

    componentDidMount() {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params && navigation.state.params.pid) {
            this.pid = navigation.state.params.pid;
            this.index = navigation.state.params.index || 0;
            this.playAnimated(this.index);
            this.initDatas();
        }
    }

    //播放动画
    playAnimated = () => {
        if(this.index !== null) {
            let val = this.state.leftValue._value;
            if(!!val != !!this.index) {
                Animated.timing(this.state.leftValue, {
                    toValue: val ? 0 : (Size.width / 2),
                    duration: 150,
                }).start();
            }
        }
    };
    
    // 获取新数据
    initDatas = () => {
        // console.log('initDatas: ' + this.index);
        if(this.index == 0) {
            this.getProudctList();
        }else if(this.index == 1) {
            this.getShopList();
        }
    };

    //获取商品列表
    getProudctList = () => {
        if(this.pid !== null && this.pid > 0 && this.index !== null) {
            let that = this;
            Util.fetch(Urls.getProductList, 'get', {
                pCity: this.pid,
                pPage: that.page,
                pPerNum: that.number,
            }, function(result) {
                // console.log(result);
                if(result && result.sTatus && result.proAry && result.proAry.length > 0) {
                    let ret = result.proAry || [];
                    let num = parseInt(result.proNum) || 0;
                    if(that.index == 0) {
                        that.page++;
                        let _datas = that.state.datas ? that.state.datas.concat(ret) : ret;
                        that.setState({
                            datas: _datas,
                            dataNum: num,
                            totalNum: num,
                            dataSource: that.state.dataSource.cloneWithRows(_datas),
                        });
                    }
                }
            }, function(view) {
                that.setState({load_or_error: view});
            }, {
                hideLoad: true,
            });
        }
    };

    //获取商铺列表
    getShopList = () => {
        let that = this;
        let _datas = [];
        let num = 0;
        if(that.index == 1) {
            that.setState({
                datas2: _datas,
                data2Num: num,
                totalNum: num,
                dataSource: that.state.dataSource.cloneWithRows(_datas),
                load_or_error: null,
            });
        }
    };

    // 切换列表
    changeList = () => {
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
    };

    render() {
        let _style = {};
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
                <View style={styles.topBtnRow}>
                    <TouchableOpacity onPress={()=>{
                        this.index = 0;
                        this.playAnimated();
                        this.changeList();
                    }} style={styles.flex}>
                        <View style={[styles.topBtnView, {
                            borderRightWidth: 1,
                            borderRightColor: Color.lavender,
                        }]}>
                            <Text style={styles.defaultFont}>{Lang[Lang.default].product}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        this.index = 1;
                        this.playAnimated();
                        this.changeList();
                    }} style={styles.flex}>
                        <View style={styles.topBtnView}>
                            <Text style={styles.defaultFont}>{Lang[Lang.default].shop}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.topBtnRow}>
                    <TouchableOpacity style={styles.flex}>
                        <View style={styles.topBtnView}>
                            <Text style={styles.defaultFont}>{Lang[Lang.default].comprehensive}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flex}>
                        <View style={styles.topBtnView}>
                            <Text style={styles.defaultFont}>{Lang[Lang.default].price}</Text>
                            <Image source={require('../../images/down.png')} style={styles.btnRightIcon} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flex}>
                        <View style={styles.topBtnView}>
                            <Text style={styles.defaultFont}>{Lang[Lang.default].newGood}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flex}>
                        <View style={styles.topBtnView}>
                            <Text style={styles.defaultFont}>{Lang[Lang.default].popularity}</Text>
                            <Image source={require('../../images/down.png')} style={styles.btnRightIcon} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
        let body = (
            <View style={styles.flex}>
                <View>
                    <ListView
                        ref={(ref)=>this.ref_listview=ref}
                        dataSource={this.state.dataSource}
                        onScroll={this._onScroll}
                        contentContainerStyle={styles.listViewStyle}
                        renderRow={(obj, sectionID, rowID)=>{
                            if(this.state.dataSource._cachedRowCount > 3) {
                                return this._renderItem(obj, sectionID, rowID, this.state.totalNum);
                            }else {
                                return this._renderItem2(obj, sectionID, rowID);
                            }
                        }}
                        enableEmptySections={true}  //允许空数据
                        renderHeader={()=>this.pageTop(this.state.isFloat ? null : btnBox)}
                        onEndReached={()=>{
                            if(this.state.totalNum && (this.page - 1) * this.number < this.state.totalNum) {
                                this.initDatas();
                            }
                        }}
                        onEndReachedThreshold={50}
                    />
                </View>
                {this.state.dataSource._cachedRowCount === 0 ?
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
                <View>
                    <AppHead
                        center={<BtnIcon 
                            width={20} 
                            text={this.state.cityName} 
                            src={require("../../images/car/address_nav.png")} 
                            txtStyle={{
                                color: Color.mainColor,
                                fontSize: FontSize.headFontSize,
                                fontWeight: FontSize.headFontWeight,
                            }}
                        />}
                        left={<BtnIcon width={PX.headIconSize} press={()=>{
                                this.props.navigation.goBack(null);
                        }} src={require("../../images/back.png")} />}
                    />
                </View>
                <View style={styles.flex}>
                    {this.state.load_or_error ?
                        this.state.load_or_error : body
                    }
                    {this.state.isFloat ? btnBox : null}
                    <View style={styles.topSwitchBox}>
                        <Image 
                            resizeMode="stretch"
                            style={styles.topSwitchImg}
                            source={require('../../images/home/lahuan.png')} 
                        />
                    </View>
                </View>
            </View>
        );
    }

    //页面头部
    pageTop = (btnBox) => {
        return (
            <View style={styles.topBgBox}>
                <View style={styles.topBgImgBox}>
                    <Image style={styles.topBgImg} source={require('../../images/empty.png')} />
                </View>
                {btnBox}
            </View>
        );
    };

    // 列表的行内容(多于3行)
    _renderItem = (obj, sectionID, rowID, num) => {
        let width = (Size.width - 5) / 2;
        let ad = null;
        let _marginTop = 0;
        let _marginRight = 0;
        let end = null;
        if(rowID % 2 === 0) _marginRight = 5;
        if(rowID > 0 && rowID % 2 === 0) _marginTop = -64 - 5;
        if(rowID == 1) {
            ad = (
                <View style={{
                    width: width,
                    height: 64,
                    marginBottom: 5,
                }}>
                    <Image source={require('../../images/home/listBanner.png')} style={{
                        width: width,
                        height: 64,
                    }} />
                </View>
            );
        }

        if(rowID == (num - 2)) {
            let _height = 64;
            if(num % 2) {
                _height = width + 65 - 64;
            }
            end = (
                <View style={{
                    width: width,
                    height: _height,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image source={require('../../images/home/onEnd.png')} style={styles.onEndImgStyle}>
                        <Text style={styles.fontStyle1}>{Lang[Lang.default].inTheEnd}</Text>
                    </Image>
                </View>
            );
        }else if (rowID == (num - 1) && num % 2) {
            _marginTop = -width - 64 - 5;
        }

        return (
            <View key={rowID} style={{
                width: width,
                marginRight: _marginRight,
                marginBottom: 5,
                marginTop: _marginTop,
            }}>
                {ad}
                <ProductItem
                    key={rowID}
                    width={width}
                    product={obj}
                    goodNameViewStyle={{height: 30}}
                    goodPriceStyle={{height: 35}}
                />
                {end}
            </View>
        );
    };

    // 列表的行内容(不多于3行)
    _renderItem2 = (obj, sectionID, rowID, num) => {
        let imgurl = obj.gThumbPic || null;
        let img = imgurl ? {uri: imgurl} : require('../../images/empty.png');
        let name = obj.gName || '';
        let stock = obj.stock || 0;
        let price = obj.gDiscountPrice || null;

        return (
            <View style={[styles.rowStyle, {
                width: Size.width,
                height: Size.width * 0.507,
                marginBottom: PX.marginTB,
                backgroundColor: '#fff',
            }]}>
                <View style={styles.goodLeftView}>
                    <Image style={styles.goodImgStyle} source={img} />
                </View>
                <View style={styles.goodRightView}>
                    <BtnIcon 
                        src={require('../../images/market.png')} 
                        width={15} text={'abc'} 
                        txtStyle={styles.fontStyle2} 
                    />
                    <Text style={styles.fontStyle3}>{name}</Text>
                    <Text style={styles.fontStyle4}>{Lang[Lang.default].stock + ':' + stock}</Text>
                    <Text style={styles.fontStyle5}>
                        {Lang[Lang.default].RMB}
                        <Text style={{fontSize: 19}}>{price}</Text>
                    </Text>
                </View>
            </View>
        );
    }

    _onScroll = (e) => {
        // console.log(e.nativeEvent);
        let offsetY = e.nativeEvent.contentOffset.y || 0;
        if(offsetY > topImgHeight && !this.state.isFloat) {
            this.setState({isFloat: true});
        }else if(offsetY < topImgHeight && this.state.isFloat) {
            this.setState({isFloat: false});
        }
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
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
        fontSize: 13,
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
    topBgImg: {
        height: topImgHeight,
        width: Size.width,
    },
    topSwitchBox: {
        width: 10,
        height: 26 + PX.headHeight,
        position: 'absolute',
        right: Size.width * 0.128,
        top: -PX.headHeight,
    },
    topSwitchImg: {
        width: 10,
        height: 26 + PX.headHeight,
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
        borderBottomWidth: pixel,
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
        marginLeft: 5,
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
});