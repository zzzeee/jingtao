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
} from 'react-native';

import PropTypes from 'prop-types';
import Urls from '../public/apiUrl';
import { Size, PX, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import GoodItem from './GoodItem';

// 购物车内的商家
export default class ShopItem extends Component {
    // 参数类型
    static propTypes = {
        shop: PropTypes.object.isRequired,
        carDatas: PropTypes.array.isRequired,
        updateCarDatas: PropTypes.func,
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
            ctrlSelect: this.props.ctrlSelect,
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.ctrlSelect !== null) {
            this.setState({
                isSelect: nextProps.ctrlSelect,
                ctrlSelect: nextProps.ctrlSelect,
            });
        }else if(nextProps.ctrlSelect === null &&
            nextProps.changeKEY1 === nextProps.key1 && 
            nextProps.carDatas && 
            nextProps.carDatas[nextProps.key1] &&
            nextProps.keyword &&
            nextProps.carDatas[nextProps.key1][nextProps.keyword]
        ) {
            let selectAll = true;
            let productList = nextProps.carDatas[nextProps.key1][nextProps.keyword];
            for(let i in productList) {
                if(productList[i].select === false) selectAll = false;
            }
            this.setState({
                isSelect: selectAll,
                ctrlSelect: null,
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.changeKEY1 === nextProps.key1 ||
            nextState.isSelect != this.state.isSelect
        ) {
            return true;
        }else {
            return false;
        }
    }

    render() {
        let { 
            shop, 
            updateCarDatas, 
            key1, 
            carDatas, 
            keyword, 
            changeKEY1, 
            changeKEY2, 
            showAutoModal,
            showCouponBox,
            userinfo,
            navigation,
        } = this.props;
        if(!shop) return null;
        let that = this;
        let sid = shop.sId || 0;
        let name = shop.sShopName || '';
        let selectIcon = this.state.isSelect ? 
            require('../../images/car/select.png') : 
            require('../../images/car/no_select.png');
        return (
            <View style={styles.shopBox}>
                <View style={styles.shopBoxHead}>
                    <View style={styles.rowStyle}>
                        <TouchableOpacity onPress={()=>{
                            let newState = !this.state.isSelect;
                            this.setState({
                                isSelect: newState,
                                ctrlSelect: newState,
                            });
                        }} style={{
                            paddingLeft: PX.marginLR,
                            paddingTop: 5,
                            paddingBottom: 5,
                        }}>
                            <Image source={selectIcon} style={{
                                width: 20,
                                height: 20,
                            }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>navigation.navigate('Shop', {shopID: sid})} style={{
                            marginLeft: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Image source={require('../../images/car/shophead.png')} style={{
                                width: 20,
                                height: 20,
                            }} />
                            <Text style={{
                                marginLeft: 6,
                                color: Color.lightBack,
                                fontSize: 14,
                            }}>{name}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={()=>{
                        showCouponBox(sid);
                    }} style={[styles.rowStyle, {justifyContent: 'flex-end'}]}>
                        <Text style={styles.shopCouponText}>{Lang[Lang.default].coupon}</Text>
                        <Image source={require('../../images/list_more_red.png')} style={styles.rightIconStyle} />
                    </TouchableOpacity>
                </View>
                {shop[keyword].map(function(good, i) {
                    return (
                        <GoodItem 
                            good={good} 
                            ctrlSelect={that.state.ctrlSelect} 
                            key={i} 
                            key1={key1}
                            key2={i}
                            keyword={keyword}
                            carDatas={carDatas}
                            updateCarDatas={updateCarDatas}
                            changeKEY1={changeKEY1}
                            changeKEY2={changeKEY2}
                            showAutoModal={showAutoModal}
                            userinfo={userinfo}
                            navigation={navigation}
                        />
                    );
                })}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
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
        // paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
    },
    rowStyle: {
        flexDirection : 'row',
        alignItems: 'center',
    },
    shopCouponText: {
        color: Color.mainColor,
        fontSize: 12,
        padding: 5,
    },
    rightIconStyle: {
        width: 14,
        height: 14,
    },
});