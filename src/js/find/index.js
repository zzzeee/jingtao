/**
 * APP发现
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    ListView,
} from 'react-native';

// import Swiper from 'react-native-swiper';
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, Color, PX } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import ProductItem from '../other/ProductItem';
import CountDown from "./CountDown";

export default class FindScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: null,
            endTime: null,
            datas: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };

        this.pageOffest = 1;
        this.pageNumber = 10;
    }

    componentDidMount() {
        this.initPage();
    }

    initPage = async () => {
        let ret1 = await this.getXSQGDatas();
        let ret2 = await this.getMDYPDatas();
        let xsqg = ret1.proAry || {};
        let start = xsqg.pbStartTime || null;
        let end = xsqg.pbEndTime || null;
        let proList = xsqg.activityAry || [];

        this.setState({
            startTime: new Date(start).getTime(),
            endTime: new Date(end).getTime(),
            datas: xsqg,
            dataSource: this.state.dataSource.cloneWithRows(proList),
        });
    };

    // 获取限时抢购商品
    getXSQGDatas = () => {
        // let that = this;
        // return Utils.fetch(Urls.getPanicBuyingProductList, 'post', {
        // }, function(result) {
        //     if(result && result.sTatus && result.proAry) {
        //         return result;
        //     }
        // });
        return fetch(Urls.getPanicBuyingProductList, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then((response) => response.json())
        .then((responseText) => {
            return responseText;
        })
        .catch((error) => {
            return null;
        });
    };

    // 获取名店列表
    getMDYPDatas = () => {
        return fetch(Urls.getFindShopList, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'sPage=' + this.pageOffest + '&sPerNum' + this.pageNumber
        })
        .then((response) => response.json())
        .then((responseText) => {
            return responseText;
        })
        .catch((error) => {
            return null;
        });
    };

    getPanicBuying = () => {
        let timer = new Date().getTime();
        return (
            <View style={styles.panicBuyingHead}>
                <Image source={require('../../images/find/xsqg.png')} resizeMode="stretch" style={styles.xsqgImgStyle} />
                <View style={styles.countDownBox}>
                {this.beOverdue() ?
                    <CountDown startTime={this.state.startTime} endTime={this.state.endTime} />
                    : null
                }
                </View>
            </View>
        );
    };

    // 判断活动是否在有效期内
    beOverdue = () => {
        let timer = new Date().getTime();
        if(!this.state.startTime || !this.state.endTime || timer > this.state.endTime || timer < this.state.startTime) {
            return false;
        }else {
            return true;
        }
    };

    render() {
        return (
            <View style={styles.flex}>
                <AppHead
                    title={Lang.cn.tab_find}
                    center={<BtnIcon 
                        width={100} 
                        height={PX.headHeight - 10} 
                        imageStyle={{marginTop: 10}} 
                        src={require("../../images/logoTitle.png")} 
                    />}
                    right={<BtnIcon style={styles.btnRight} width={PX.headIconSize} src={require("../../images/search.png")} />}
                />
                <ScrollView>
                    <View style={styles.panicBuyingBox}>
                        {this.getPanicBuying()}
                        <ListView
                            horizontal={true}
                            contentContainerStyle={styles.listViewStyle}
                            enableEmptySections={true}
                            dataSource={this.state.dataSource}
                            renderRow={this._renderItem}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    <View style={styles.couponBox}>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // 列表的行内容
    _renderItem = (obj, sectionID, rowID) => {
        return (
            <View style={styles.ProductItemBox}>
                <ProductItem 
                    product={obj} 
                    _key={rowID} 
                    panicBuying={true}
                    width={160} 
                    showDiscount={true} 
                />
                {this.beOverdue() ?
                    null : 
                    <View style={[styles.productAboveImg]}>
                        <Image 
                            source={require('../../images/find/activity_expired.png')} 
                            resizeMode="stretch" 
                            style={styles.productAboveImg} 
                        />
                    </View>
                }
            </View>
        );
    };
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.lightGrey,
    },
    flex: {
        flex: 1,
    },
    btnRight: {
        paddingRight: 12,
    },
    panicBuyingBox: {
        height: 340,
        marginTop: 10,
        backgroundColor: '#fff',
        paddingTop: 18,
    },
    panicBuyingHead: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    xsqgImgStyle: {
        width: 69,
        height: 20,
    },
    countDownBox: {
        height: 20,
        marginTop: 8,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listViewStyle: {
        paddingLeft: 15,
        paddingRight: 5,
    },
    ProductItemBox: {
        marginRight: 10,
    },
    productAboveImg: {
        position: 'absolute', 
        left: 0, 
        top: 0, 
        right: 0, 
        bottom: 0,
    },
    couponBox: {
        height: 200,
        marginTop: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
});