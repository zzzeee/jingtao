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
} from 'react-native';

import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import { Size, PX, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import GoodItem from './GoodItem';

// 购物车内的商家
export default class ShopItem extends Component {
    // 参数类型
    static propTypes = {
        shop: React.PropTypes.object.isRequired,
        ctrlSelect: React.PropTypes.bool.isRequired,
        carDatas: React.PropTypes.array.isRequired,
        updateCarDatas: React.PropTypes.func,
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
        let { shop, updateCarDatas, key1, carDatas } = this.props;
        if(!shop) return null;
        let that = this;
        let name = shop.name || '';
        let img = shop.headImg || null;
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
                {shop.productList.map(function(good, i) {
                    return (
                        <GoodItem 
                            good={good} 
                            ctrlSelect={that.state.isSelect} 
                            key={i} 
                            key1={key1}
                            key2={i}
                            keyword={'productList'}
                            carDatas={carDatas}
                            updateCarDatas={updateCarDatas} 
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
});