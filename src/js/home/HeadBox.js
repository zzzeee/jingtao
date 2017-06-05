/**
 * 首页 - 头部卡片列表
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
    TouchableOpacity,
} from 'react-native';

import Util from '../public/utils';
import urls from '../public/apiUrl';
import lang from '../public/language';
import { Size, Color } from '../public/globalStyle';
import BtnIcon from '../public/BtnIcon';

export default class HeadBox extends Component {
    // 参数类型
    static propTypes = {
        datas: React.PropTypes.object.isRequired,
    };
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
        this.nav = this.props.navigation;
    }

    componentWillMount() {
        if(this.props.datas) {
            this.initDatas(this.props.datas);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.datas != this.props.datas) {
            this.initDatas(nextProps.datas);
        }
    }

    initDatas = (datas) => {
        let list = datas.cityProduct || [];
        this.setState({
            datas: datas,
            dataSource: this.state.dataSource.cloneWithRows(list),
        });
    };

    render() {
        if(!this.state.datas) return null;
        
        let pinfo = this.state.datas || {};
        let fimg = pinfo.griImg || null;
        let name = pinfo.region_name || null;
        let text = pinfo.griInfo || null;
        
        return (
            <View style={{backgroundColor: '#fff'}}>
                <Image source={{uri: fimg}} style={styles.firstRowImage}>
                    <View style={styles.firstRowImageView}>
                        <Text style={styles.bigText} numberOfLines={1}>{name}</Text>
                        <Text style={styles.smlText} numberOfLines={3}>{text}</Text>
                    </View>
                </Image>
                <ListView
                    horizontal={true}
                    initialListSize={2}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem.bind(this)}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        );
    }

    linkList = (_id, _name, _index) => {
        if(_id > 0 && this.nav) {
            this.nav.navigate('CityGoodShopList', {
                index: _index,
                name: _name,
                cid: _id,
            });
        }
    };

    renderItem = (obj, sectionID, rowID) => {
        let name = obj.region_name || '';
        let cimg = obj.griImg || null;
        let img_down = require("../../images/down.png");
        let img_enter = require("../../images/home/enter.png");
        let img_mark = require("../../images/home/market.png");
        let margin_left = this.state.datas.cityProduct.length == 1 ? 35 : 25;
        let margin_right = this.state.datas.cityProduct.length - 1 == rowID ? margin_left : 0;

        return (
            <View key={rowID} style={[styles.cityItem, {
                marginLeft: margin_left,
                marginRight: margin_right,
            }]}>
                <View style={styles.cityHead}>
                    <Text style={{color: Color.lightBack,}}>{name}</Text>
                    {/*<BtnIcon width={20} src={img_down} />*/}
                </View>
                <TouchableOpacity onPress={()=>this.linkList(obj.region_id, name, 0)}>
                    <Image source={{uri: cimg}} style={styles.cityImage} />
                </TouchableOpacity>
                <View style={styles.cityfoot}>
                    <BtnIcon src={img_enter} size={12} text={lang.cn.goin + name} press={()=>this.linkList(obj.region_id, name, 0)} />
                    <BtnIcon src={img_mark} size={12} text={lang.cn.allSeller} press={()=>this.linkList(obj.region_id, name, 1)} />
                </View>
            </View>
        );
    };
}

var itemWidth = Size.width - 70;
var itemImgHeight = (Size.width - 70) * 0.64 + 90;
itemImgHeight = 160;
var itemHeight = itemImgHeight + 90;

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    bigText : {
        fontSize : 24,
        paddingBottom: 5,
        color: '#fff'
    },
    smlText : {
        fontSize : 11,
        color: '#fff',
        lineHeight: 18,
    },
    firstRowImage: {
        width: Size.width,
        height: Size.width * 0.344,
    },
    firstRowImageView: {
        flex: 1,
        padding: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    cityItem: {
        width: itemWidth,
        marginTop: 25,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 2,
    },
    cityHead: {
        height: 39,
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 5,
    },
    cityImage : {
        width: itemWidth - 2,
        height: itemImgHeight,
    },
    cityfoot: {
        flexDirection : 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 49,
    },
});