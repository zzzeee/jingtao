/**
 * 首页 - 选中省份 - 城市列表 - 商品列表
 * @auther linzeyong
 * @date   2017.04.18
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import { CachedImage } from "react-native-img-cache";
import PropTypes from 'prop-types';
import { Size, Color, pixel, PX } from '../public/globalStyle';
import lang from '../public/language';
import ProductItem from '../other/ProductItem';

export default class CityItem extends Component {
    // 默认参数
    static defaultProps = {
        city: {},
    };
    // 参数类型
    static propTypes = {
        city: PropTypes.object.isRequired,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            productNumber: null,
            dataSource: null,
        };
        this.nav = this.props.navigation;
    }

    componentWillMount() {
        if(this.props.city) {
            this.initDatas(this.props.city);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.city != this.props.city) {
            this.initDatas(nextProps.city);
        }
    }

    initDatas = (city) => {
        if(typeof(city) == 'object') {
            let list = city.proAdsAry || [];
            this.setState({
                datas: city,
                productNumber: list.length,
                dataSource: list,
            });
        }
    };

    linkList = (_id, _name, _index) => {
        if(_id > 0 && this.nav) {
            this.nav.navigate('CityGoodShopList', {
                index: _index,
                name: _name,
                cid: _id,
            });
        }
    };

    render() {
        if(!this.state.datas) return null;
        let city = this.state.datas || {};
        let id = city.region_id || 0;
        let name = city.region_name || '';
        let info = city.griInfo || '';
        let img = city.griImg || '';
        let img_down = require("../../images/down.png");
        let img_enter = require("../../images/home/enter.png");
        let img_mark = require("../../images/home/market.png");
        let img_share = require("../../images/home/share.png");
        let shareObj = {
            img: img,
            cityId: id,
        };
        return (
            <View>
                <View style={styles.cityNameRow}>
                    <Text style={styles.cityNameText} numberOfLines={1}>{name}</Text>
                    <TouchableOpacity onPress={(e)=>{
                        if(this.props.showFloatMenu && e && e.nativeEvent && name) {
                            this.props.showFloatMenu(e.nativeEvent, name, shareObj);
                        }
                    }} style={{
                        padding: 5,
                        flexDirection: 'row',
                    }}>
                        <Image source={img_down} style={{
                            width: 26,
                            height: 26,
                        }} />
                    </TouchableOpacity>
                </View>
                <View style={styles.cityTitleRow}>
                    <Text style={styles.cityTitleText} numberOfLines={3}>{info}</Text>
                    <CachedImage source={{uri: img}} style={styles.cityImage} />
                </View>
                {(this.state.dataSource && this.state.dataSource.length > 0) ?
                    <FlatList
                        horizontal={true}
                        contentContainerStyle={styles.listViewStyle}
                        keyExtractor={(item, index)=>{return item.gID ? item.gID : index}}
                        enableEmptySections={true}
                        data={this.state.dataSource}
                        renderItem={this._renderItem}
                        showsHorizontalScrollIndicator={false}
                    />
                    : null
                }
                <View style={styles.cityItemFootBox}>
                    <View style={styles.noLeftBorder}>
                        <TouchableOpacity onPress={()=>this.linkList(id, name, 0)} style={{
                            padding: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Image source={img_enter} style={{
                                width: 16,
                                height: 16,
                            }} />
                            <Text style={{
                                fontSize: 13,
                                color: Color.lightBack,
                            }}>{lang[lang.default].goin + name}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.leftBorder}>
                        <TouchableOpacity onPress={()=>this.linkList(id, name, 1)} style={{
                            padding: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Image source={img_mark} style={{
                                width: 16,
                                height: 16,
                            }} />
                            <Text style={{
                                fontSize: 13,
                                color: Color.lightBack,
                            }}>{lang[lang.default].allSeller}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.leftBorder}>
                        <TouchableOpacity onPress={()=>{
                            this.props.setStartShare(true, name, shareObj);
                        }} style={{
                            padding: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Image source={img_share} style={{
                                width: 16,
                                height: 16,
                            }} />
                            <Text style={{
                                fontSize: 13,
                                color: Color.lightBack,
                            }}>{lang[lang.default].sharePruduct}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    _renderItem = ({item, index}) => {
        let margin_left = this.state.productNumber > 1 ? 15 : ((Size.width - PX.productWidth1) / 2);
        return (
            <ProductItem 
                product={item}
                navigation={this.props.navigation}
                boxStyle={{
                    marginLeft: margin_left, 
                    marginTop: 15,
                    marginBottom: 15,
                }} 
            />
        );
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    listViewStyle : {
        marginTop : 10,
        marginBottom: 10,
        paddingRight: 15,
    },
    cityNameRow: {
        height: 40,
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    },
    cityNameText: {
        fontSize: 20,
        color: Color.lightBack,
        paddingTop: 12,
        textShadowColor: '#ddd',
        textShadowOffset: {
            width: 3,
            height: 2,
        },
        textShadowRadius: 2,
    },
    cityTitleRow: {
        height: 60,
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    },
    cityTitleText: {
        flex: 3,
        fontSize: 11,
        paddingRight: 8,
        color: Color.gainsboro,
        lineHeight: 20,
    },
    headDownIcon: {
        width: 22,
        height: 22,
    },
    cityImage: {
        height: 60,
        width: 100,
    },
    cityItemFootBox: {
        width: Size.width - 30,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 15,
        borderTopWidth: pixel,
        borderTopColor : Color.lavender,
    },
    buttonText: {
        fontSize: 14,
        color: Color.lightBack,
    },
    noLeftBorder: {
        flex: 1,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftBorder: {
        flex: 1,
        height: 16,
        borderLeftWidth: pixel,
        borderLeftColor: Color.lavender,
        alignItems: 'center',
        justifyContent: 'center',
    },
});