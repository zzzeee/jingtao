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
    ListView,
} from 'react-native';

import { Size, Color, pixel, PX } from '../public/globalStyle';
import lang from '../public/language';
import BtnIcon from '../public/BtnIcon';
import ProductItem from '../other/ProductItem';

export default class CityItem extends Component {
    // 默认参数
    static defaultProps = {
        city: {},
    };
    // 参数类型
    static propTypes = {
        city: React.PropTypes.object.isRequired,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            productNumber: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
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
                dataSource: this.state.dataSource.cloneWithRows(list),
            });
        }
    };

    linkList = (_id, _index) => {
        if(_id > 0 && this.nav) {
            this.nav.navigate('CityGoodShopList', {
                index: _index,
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
        return (
            <View>
                <View style={styles.cityNameRow}>
                    <Text style={styles.cityNameText} numberOfLines={1}>{name}</Text>
                    <BtnIcon width={26} src={img_down} style={{padding: 5}} press={(e)=>{
                        if(this.props.showFloatMenu && e && e.nativeEvent && name) {
                            this.props.showFloatMenu(e.nativeEvent, name, {
                                img: img,
                                cityId: id,
                            });
                        }
                    }} />
                </View>
                <View style={styles.cityTitleRow}>
                    <Text style={styles.cityTitleText} numberOfLines={3}>{info}</Text>
                    <Image source={{uri: img}} style={styles.cityImage} />
                </View>
                <ListView
                    horizontal={true}
                    initialListSize={2}
                    enableEmptySections={true} 
                    contentContainerStyle={styles.listViewStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderItem.bind(this)}
                    showsHorizontalScrollIndicator={false}
                />
                <View style={styles.cityItemFootBox}>
                    <View style={styles.noLeftBorder}>
                        <BtnIcon 
                            width={16}
                            size={13}
                            color={Color.lightBack}
                            src={img_enter}
                            text={lang.cn.goin + name}
                            press={()=>this.linkList(id, 0)}
                        />
                    </View>
                    <View style={styles.leftBorder}>
                        <BtnIcon
                            width={16}
                            size={13}
                            color={Color.lightBack}
                            src={img_mark}
                            text={lang.cn.allSeller}
                            press={()=>this.linkList(id, 1)}
                        />
                    </View>
                    <View style={styles.leftBorder}>
                        <BtnIcon
                            width={16}
                            size={13}
                            color={Color.lightBack}
                            src={img_share}
                            text={lang.cn.sharePruduct}
                        />
                    </View>
                </View>
            </View>
        );
    }

    _renderItem = (obj, sessonid, rowid, num) => {
        let margin_left = this.state.productNumber > 1 ? 15 : ((Size.width - PX.productWidth1) / 2);
        return (
            <ProductItem 
                product={obj} 
                key={rowid} 
                navigation={this.props.navigation}
                boxStyle={{
                    marginLeft: margin_left, 
                    marginTop: 15,
                    marginBottom: 15,
                    marginRight: 0
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