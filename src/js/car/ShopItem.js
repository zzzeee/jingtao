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
        let { shop, updateCarDatas, key1, carDatas, keyword, changeKEY1, changeKEY2 } = this.props;
        if(!shop) return null;
        let that = this;
        let name = shop.name || '';
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
                                let newState = !this.state.isSelect;
                                this.setState({
                                    isSelect: newState,
                                    ctrlSelect: newState,
                                });
                            }}
                            style={{padding: 0}}
                        />
                        <BtnIcon 
                            width={20} 
                            src={require('../../images/car/shophead.png')} 
                            text={name} 
                            style={{marginLeft: 20, padding: 0}} 
                            txtStyle={{marginLeft: 6}}
                        />
                    </View>
                    <View style={[styles.rowStyle, {justifyContent: 'flex-end'}]}>
                        <Text style={styles.shopCouponText}>{Lang[Lang.default].coupon}</Text>
                        <Image source={require('../../images/list_more_red.png')} style={styles.rightIconStyle} />
                    </View>
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