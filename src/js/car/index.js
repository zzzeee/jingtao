/**
 * APP购物车
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Image,
    Button,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import { Size, PX, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import Order from '../datas/order.json';
import GoodItem from './GoodItem';

export default class CarsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carDatas: null,
            isSelect: true,
        };
    }

    componentDidMount() {
        this.initDatas();
    }

    initDatas = () => {
        this.setState({
            carDatas: Order.orderInfo,
        });
    };

    render() {
        let { navigation } = this.props;
        let left = (navigation.state.params && navigation.state.params.goGoodDetails) ? 
            <BtnIcon width={PX.headIconSize} press={()=>{navigation.goBack(null);}} src={require("../../images/back.png")} />
            : null;
        let right = this.state.carDatas ?
            <Text style={styles.editCarText}>{Lang[Lang.default].edit}</Text> 
            : null;
        let selectIcon = this.state.isSelect ? 
            require('../../images/car/select.png') : 
            require('../../images/car/no_select.png');
        return (
            <View style={styles.flex}>
                <AppHead 
                    title={Lang[Lang.default].tab_car}
                    left={left}
                    right={right}
                />
                <View style={styles.flex}>
                    <View style={styles.flex}>
                        {this.bodyContent(this.state.isSelect)}
                    </View>
                    <View style={styles.carFooter}>
                        <View style={styles.rowStyle}>
                            <BtnIcon width={20} src={selectIcon} press={()=>{
                                this.setState({isSelect: !this.state.isSelect});
                            }} />
                        </View>
                        <View style={styles.rowStyle}>
                            <View style={styles.carFooterRightLeft}>
                                <Text style={styles.textStyle1}>{Lang[Lang.default].total2 + ':'}</Text>
                                <Text style={styles.textStyle2}>{100}</Text>
                                <Text style={styles.textStyle3}>{Lang[Lang.default].excludingFreight}</Text>
                            </View>
                            <TouchableOpacity style={styles.settlementBox} onPress={()=>navigation.navigate('AddOrder')}>
                                <Text style={styles.settlementText}>{Lang[Lang.default].settlement}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    //正文内容 (购物车商品和猜你喜欢商品)
    bodyContent = (select) => {
        let car = this.state.carDatas ? 
            <View style={styles.flex}>
                {this.state.carDatas.map(function(item, index) {
                    return <ShopItem key={index} shop={item} ctrlSelect={select} />;
                })}
            </View>
            : null;

        return (
            <ScrollView>
                <View>
                    {car}
                </View>
                <View>
                </View>
            </ScrollView>
        );
    }
}

// 购物车内不同的商家
class ShopItem extends Component {
    // 参数类型
    static propTypes = {
        shop: React.PropTypes.object.isRequired,
        ctrlSelect: React.PropTypes.bool.isRequired,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            isSelect: null,
        };
    }

    componentWillMount() {
        this.setState({
            isSelect: this.props.ctrlSelect,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isSelect: nextProps.ctrlSelect,
        });
    }

    render() {
        let _shop = this.props.shop || null;
        if(!_shop) return null;
        let that = this;
        let name = _shop.name || '';
        let img = _shop.headImg || null;
        let headImg = img ? {uri: headImgUrl} : require('../../images/empty.png');
        let selectIcon = this.state.isSelect ? 
            require('../../images/car/select.png') : 
            require('../../images/car/no_select.png');
        return (
            <View style={styles.shopBox}>
                <View style={styles.shopBoxHead}>
                    <View style={styles.rowStyle}>
                        <BtnIcon 
                            width={20} 
                            src={selectIcon} 
                            press={()=>{
                                this.setState({
                                    isSelect: !this.state.isSelect,
                                });
                            }}
                            />
                            <BtnIcon 
                                width={20} 
                                src={headImg} 
                                text={name} 
                                style={{marginLeft: 20}} 
                                txtStyle={{marginLeft: 6}}
                            />
                    </View>
                    <View style={[styles.rowStyle, {justifyContent: 'flex-end'}]}>
                        <Text style={styles.shopCouponText}>{Lang[Lang.default].coupon}</Text>
                        <Image source={require('../../images/list_more_red.png')} style={styles.rightIconStyle} />
                    </View>
                </View>
                {_shop.productList.map(function(good, i) {
                    return <GoodItem good={good} ctrlSelect={that.state.isSelect} key={i} />;
                })}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    editCarText: {
        fontSize: 14,
        color: Color.orangeRed,
        paddingRight: PX.marginLR,
    },
    shopBox: {
        marginBottom: PX.marginTB,
        backgroundColor: '#fff',
    },
    shopBoxHead: {
        height: PX.rowHeight2,
        flexDirection : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
    },
    rowStyle: {
        flexDirection : 'row',
        alignItems: 'center',
    },
    shopCouponText: {
        color: Color.mainColor,
        fontSize: 12,
    },
    rightIconStyle: {
        width: 14,
        height: 14,
    },
    carFooter: {
        height: PX.rowHeight1,
        flexDirection : 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingLeft: PX.marginLR,
        borderTopWidth: 1,
        borderTopColor: Color.lavender,
    },
    carFooterRightLeft: {
        height: PX.rowHeight1,
        paddingRight: 20,
        flexDirection : 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    textStyle1: {
        color: Color.lightBack,
        fontSize: 14,
    },
    textStyle2: {
        color: Color.orangeRed,
        fontSize: 14,
        paddingRight: PX.marginLR,
    },
    textStyle3: {
        color: Color.gainsboro,
        fontSize: 11,
    },
    settlementBox: {
        width: 100,
        height: PX.rowHeight1,
        backgroundColor: Color.orangeRed,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settlementText: {
        fontSize: 14,
        color: '#fff',
    },
});