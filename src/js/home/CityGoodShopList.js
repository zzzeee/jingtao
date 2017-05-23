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

import Util from '../public/utils';
import Urls from '../public/apiUrl';
import Lang, {str_replace} from '../public/language';
import { Size, pixel, PX, Color, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import cityGoods from '../datas/cityGoods.json';
import ProductItem from '../other/ProductItem';

export default class CityGoodShopList extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            datas2: null,
            cityName: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            leftValue: new Animated.Value(0),
        };
    }

    componentDidMount() {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params && navigation.state.params.pid) {
            this.initList(navigation.state.params.pid);
            this.playAnimated(navigation.state.params.index);
        }
    }

    initList = (id) => {
        if(id && id > 0) {
            this.setState({
                datas: cityGoods,
                cityName: '宁波馆',
                totalNum: cityGoods.length,
                dataSource: this.state.dataSource.cloneWithRows(cityGoods),
            });
        }
    };

    changeList = (datas) => {
        let _datas = datas ? datas : [];
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(_datas),
        });
    };

    //播放动画
    playAnimated = (value) => {
        let val = this.state.leftValue._value;
        if(!!val != !!value) {
            Animated.timing(this.state.leftValue, {
                toValue: val ? 0 : (Size.width / 2),
                duration: 150,
            }).start();
        }
    };
    
    // 获取数据
    initDatas = (id) => {
        if(id && id > 0) {
            let that = this;
            Util.fetch(Urls.getCityAndProduct, 'post', {
                pID: id,
            }, function(result) {
                if(result && result.sTatus) {
                    let ret = result.provinceAry || {};
                    let list = ret.cityProduct || [];
                    that.setState({
                        datas: ret,
                        dataSource: that.state.dataSource.cloneWithRows(list),
                    });
                }
            });
        }
    };

    render() {
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
                    <View>
                        <ListView
                            ref={(ref)=>this.ref_listview=ref}
                            dataSource={this.state.dataSource}
                            contentContainerStyle={styles.listViewStyle}
                            renderRow={(obj, sectionID, rowID)=>{
                                if(this.state.dataSource._cachedRowCount > 3) {
                                    return this._renderItem(obj, sectionID, rowID, this.state.totalNum);
                                }else {
                                    return this._renderItem2(obj, sectionID, rowID);
                                }
                            }}
                            enableEmptySections={true}  //允许空数据
                            renderHeader={this.pageTop}
                        />
                    </View>
                    {this.state.dataSource._cachedRowCount === 0 ?
                        <View style={styles.centerStyle}>
                            <Image source={require('../../images/home/noContent.png')} style={styles.noContentImg}>
                                <Text style={styles.fontStyle1}>该地区还没有信息。</Text>
                                <Text style={styles.fontStyle1}>小二正在努力补充中!</Text>
                            </Image>
                        </View>
                        : null
                    }
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
    pageTop = () => {
        return (
            <View style={styles.topBgBox}>
                <View style={styles.topBgImgBox}>
                    <Image style={styles.topBgImg} source={require('../../images/empty.png')} />
                </View>
                <View style={styles.topBtnBox}>
                    <View style={styles.btnTopLineBox}>
                        <Animated.View style={[styles.btnTopLine, {
                            left: this.state.leftValue,
                        }]}>
                        </Animated.View>
                    </View>
                    <View style={styles.topBtnRow}>
                        <TouchableOpacity onPress={()=>{
                            this.playAnimated(0);
                            this.changeList(this.state.datas);
                        }} style={styles.flex}>
                            <View style={[styles.topBtnView, {
                                borderRightWidth: 1,
                                borderRightColor: Color.lavender,
                            }]}>
                                <Text style={styles.defaultFont}>{Lang[Lang.default].product}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.playAnimated(1);
                            this.changeList(this.state.datas2);
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
            </View>
        );
    };

    // 列表的行内容(多于3行)
    _renderItem = (obj, sectionID, rowID, num) => {
        let width = (Size.width - 6) / 2 - 5;
        let ad = null;
        let _marginTop = 0;
        let end = null;
        if(rowID > 0 && rowID % 2 === 0) _marginTop = -64;
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
            _marginTop = -width - 65;
        }

        return (
            <View key={rowID} style={{
                width: width,
                marginRight: 5,
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
                height: Size.width * 0.507,
                marginTop: PX.marginTB,
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
        paddingLeft: 5,
        paddingBottom: 15,
    },
    centerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noContentImg: {
        width: 185,
        height: 102,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    topBgBox: {
        width: Size.width,
        marginLeft: -5,
    },
    topBtnBox: {
        paddingBottom: 5,
    },
    topBgImg: {
        height: Size.width * 0.48,
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
        height: Size.width * 0.507,
        justifyContent: 'space-between',
        paddingLeft: 7,
        paddingRight: PX.marginLR,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: 'green',
    },
});