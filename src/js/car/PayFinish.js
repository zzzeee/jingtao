/**
 * APP购物车
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import Goods from '../datas/goods.json';
import ProductItem from '../other/ProductItem';

export default class PayFinishScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodList: null,     //猜你喜欢的商品列表
        };
    }

    componentDidMount() {
        this.initDatas();
    }

    //初始化数据
    initDatas = () => {
        this.setState({
            goodList: Goods,
        });
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead 
                    title={Lang[Lang.default].payFinish}
                    left={<BtnIcon width={PX.headIconSize} press={()=>{navigation.goBack(null);}} src={require("../../images/back.png")} />}
                />
                <View style={styles.flex}>
                    <FlatList
                        ref={(_ref)=>this.ref_flatList=_ref} 
                        data={this.state.goodList}
                        numColumns={2}
                        contentContainerStyle={styles.whiteBg}
                        keyExtractor={(item, index) => (index)}
                        enableEmptySections={true}
                        renderItem={this._renderItem}
                        ListHeaderComponent={this.pageHead}
                        onEndReached={()=>{
                            // this.loadMore();
                        }}
                    />
                </View>
            </View>
        );
    }

    //页面头部 - 订单支付成功信息
    pageHead = () => {
        return (
            <View style={styles.topBox}>
                <View style={styles.whiteBg}>
                    <View>
                        <Image source={require('../../images/car/payok_bg.png')} resizeMode="stretch" style={styles.topBoxC1}>
                            <View style={styles.topBoxC1Img}>
                                <View>
                                    <Text style={styles.topBoxC1Text1}>{str_replace(Lang[Lang.default].payFinishInfo, '115800.00')}</Text>
                                    <Text style={styles.topBoxC1Text2}>{Lang[Lang.default].packageGetReady}</Text>
                                </View>
                                <Image source={require('../../images/car/payok_right.png')} resizeMode="stretch" style={styles.topBoxC1ImgRight} />
                            </View>
                        </Image>
                    </View>
                    <View style={styles.topBoxRow}>
                        <View style={styles.rowStyle}>
                            <Text style={[styles.textStyle1, {paddingRight: 20}]}>{Lang[Lang.default].consignee + ': 汪颖凯'}</Text>
                            <Text style={styles.textStyle1}>{Lang[Lang.default].iphone + ': 188888888888'}</Text>
                        </View>
                        <View>
                            <Text style={styles.textStyle1}>{Lang[Lang.default].address + '：浙江省宁波市高新区聚贤路1299号'}</Text>
                        </View>
                    </View>
                    <View style={[styles.topBoxRow, {flexDirection : 'row', justifyContent: 'space-between',}]}>
                        <View style={styles.rowStyle}>
                            <Text style={styles.colourStyle}>{Lang[Lang.default].giveIntegral}</Text>
                            <Text style={styles.textStyle1}>赠送积分<Text style={{color: Color.mainColor}}>20</Text>点</Text>
                        </View>
                        <View style={styles.rowStyle}>
                            <Text style={styles.textStyle2}>{Lang[Lang.default].getConfirmReceipt}</Text>
                        </View>
                    </View>
                    <View style={[styles.topBoxRow, {flexDirection : 'row', justifyContent: 'center',}]}>
                        <Text style={[styles.btnTextStyle, {marginRight: 60}]}>{Lang[Lang.default].viewOrder}</Text>
                        <Text style={styles.btnTextStyle}>{Lang[Lang.default].goHome}</Text>
                    </View>
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

    //猜你喜欢商品
    _renderItem = ({item, index}) => {
        return (
            <ProductItem 
                product={item} 
                key={index}
                showDiscount={true}
                width={(Size.width - 5) / 2}
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
    topBox: {
        paddingTop: PX.marginTB,
        backgroundColor: Color.lightGrey,
    },
    topBoxC1Img: {
        height: 120,
        width: Size.width,
        flexDirection : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
    },
    topBoxC1Text1: {
        fontSize: 20,
        color: '#fff',
        paddingBottom: 6,
        // paddingTop: 35,
    },
    topBoxC1Text2: {
        fontSize: 14,
        color: '#fff',
    },
    btnTextStyle: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 13,
        color: Color.mainColor,
        borderWidth: 1,
        borderColor: Color.mainColor,
        borderRadius: 3,
    },
    topBoxC1ImgRight: {
        width: 115,
        height: 86,
        marginRight: 20,
    },
    textStyle1: {
        color: Color.lightBack,
        fontSize: 13,
        lineHeight: 20,
    },
    textStyle2: {
        color: Color.gray,
        fontSize: 14,
    },
    rowStyle: {
        flexDirection : 'row',
        alignItems: 'center',
    },
    topBoxRow: {
        minHeight: PX.rowHeight1,
        marginLeft: PX.marginLR,
        marginRight: PX.marginLR,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
        backgroundColor: '#fff',
    },
    colourStyle: {
        color: '#fff',
        backgroundColor: Color.red,
        borderRadius: 2,
        fontSize: 12,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 7,
        paddingRight: 7,
        marginRight: 10,
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