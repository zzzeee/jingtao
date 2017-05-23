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
} from 'react-native';

import Util from '../public/utils';
import Urls from '../public/apiUrl';
import Lang, {str_replace} from '../public/language';
import { Size, pixel, PX, Color } from '../public/globalStyle';
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
            cityName: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
    }

    componentDidMount() {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params && navigation.state.params.pid) {
            this.initList(this.props.navigation.state.params.pid);
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
        if(!this.state.datas) return null;
        console.log(this.state.dataSource);
        return (
            <View style={styles.flex}>
                <View>
                    <AppHead
                        center={<BtnIcon 
                                width={20} 
                                text={this.state.cityName} 
                                src={require("../../images/car/address_nav.png")} 
                            />}
                        left={<BtnIcon width={PX.headIconSize} press={()=>{
                                this.props.navigation.goBack(null);
                        }} src={require("../../images/back.png")} />}
                    />
                </View>
                <View style={[styles.flex, {backgroundColor: '#123'}]}>
                    <ListView
                        ref={(ref)=>this.ref_listview=ref}
                        dataSource={this.state.dataSource}
                        contentContainerStyle={styles.listViewStyle}
                        renderRow={(this.state.datas && this.state.datas.length > 3) ? this._renderItem.bind(this) : this._renderItem2}
                        enableEmptySections={true}  //允许空数据
                        renderHeader={this.pageTop}
                    />
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
                        <View style={styles.btnTopLine}>
                        </View>
                    </View>
                    <View style={styles.topBtnRow}>
                        <TouchableOpacity style={styles.flex}>
                            <View style={[styles.topBtnView, {
                                borderRightWidth: 1,
                                borderRightColor: Color.lavender,
                            }]}>
                                <Text style={styles.defaultFont}>{Lang[Lang.default].product}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flex}>
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

    // 列表的行内容
    _renderItem = (obj, sectionID, rowID) => {
        let num = this.state.totalNum || 0;
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
    },
    listViewStyle : {
        backgroundColor: Color.floralWhite,
        flexDirection : 'row',
        flexWrap: 'wrap',
        paddingLeft: 5,
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
});