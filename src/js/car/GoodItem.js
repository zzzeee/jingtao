/**
 * APP购物车 - 已加入购物车的商品
 * @auther linzeyong
 * @date   2017.05.16
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import { Size, PX, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class GoodItem extends Component {
    // 默认参数
    static defaultProps = {
        ctrlSelect: false,
        key1: null,
        key2: null,
        keyword: null,
    };
    // 参数类型
    static propTypes = {
        updateCarDatas: React.PropTypes.func,
        good: React.PropTypes.object.isRequired,
        ctrlSelect: React.PropTypes.bool.isRequired,
        carDatas: React.PropTypes.array.isRequired,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            isSelect: null,
            number: null,
        };
    }

    componentWillMount() {
        if(this.props.good && this.props.good.number) {
            this.setState({
                number: parseInt(this.props.good.number),
                isSelect: this.props.ctrlSelect,
            }, this.updateCar);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isSelect: nextProps.ctrlSelect,
        }, this.updateCar);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.ctrlSelect != this.state.isSelect || 
            nextState.isSelect != this.state.isSelect || 
            nextState.number != this.state.number
        ) {
            return true;
        }else {
            return false;
        }
    }

    render() {
        if(!this.props.good) return null;
        let good = this.props.good;
        let gid = good.id || 0;
        let number = parseInt(this.state.number) || 0;
        if(gid > 0 && number > 0) {
            let selectIcon = this.state.isSelect ? 
                require('../../images/car/select.png') : 
                require('../../images/car/no_select.png');
            let img = good.goodImgUrl || null;
            let goodImg = img ? {uri: img} : require('../../images/empty.png');
            let goodName = good.name || '';
            let goodAttr = good.attr || '';
            let goodPrice = good.price || null;
            let goodMartPrice = good.martPrice || null;
            let goodType = good.type || 0;
            return (
                <View style={styles.goodBox}>
                    <View style={styles.selectIconView}>
                        <BtnIcon src={selectIcon} width={20} press={this.changeSelectState} />
                    </View>
                    <Image source={goodImg} style={styles.goodImg} />
                    <View style={styles.gItemRight}>
                        <Text style={styles.goodName}>{goodName}</Text>
                        <Text style={styles.goodAttr}>{Lang[Lang.default].specification + ': ' + goodAttr}</Text>
                        <View style={styles.gItemRightFoot}>
                            <View style={styles.goodPriceBox}>
                                <Text style={styles.goodPrice}>{Lang[Lang.default].RMB + goodPrice}</Text>
                                {goodType == 1 ?
                                    <Text style={styles.timeLimit}>{Lang[Lang.default].timeLimit}</Text>
                                    : null
                                }
                            </View>
                            <View style={styles.ctrlNumberBox}>
                                <TouchableOpacity 
                                    style={[styles.btnCtrlNumber, {borderRightWidth: 1}]}
                                    onPress={()=>{this.changeNumber(-1)}}
                                >
                                    <Text style={styles.btnCtrlNumberText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.btnCtrlNumberText}>{number}</Text>
                                <TouchableOpacity 
                                    style={[styles.btnCtrlNumber, {borderLeftWidth: 1}]}
                                    onPress={()=>{this.changeNumber(1)}}
                                >
                                    <Text style={styles.btnCtrlNumberText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }else {
            return null;
        }
    }

    // 更新购物车数据
    updateCar = () => {
        let newSelectState = this.state.isSelect;
        let { key1, key2, keyword, carDatas, updateCarDatas } = this.props;
        if(key1 !== null && key2 !== null && keyword !== null && carDatas && carDatas[key1] && updateCarDatas) {
            carDatas[key1][keyword][key2].select = newSelectState;
            carDatas[key1][keyword][key2].number = this.state.number;
            updateCarDatas(carDatas);
        }
    };

    // 改变商品选中状态
    changeSelectState = () => {
        this.setState({isSelect: !this.state.isSelect}, this.updateCar);
    };

    // 改变商品数量
    changeNumber = (x) => {
        if(x === 1 || x === -1) {
            let number = this.state.number + x;
            if(number > 0) {
                this.setState({number: number }, this.updateCar);
            }
        }
    }
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    goodBox: {
        height: 122,
        flexDirection: 'row',
        padding: PX.marginLR,
        borderTopWidth: 1,
        borderTopColor: Color.lavender,
    },
    selectIconView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    goodImg: {
        width: 90,
        height: 90,
        marginLeft: 12,
        marginRight: 12,
    },
    gItemRight: {
        flex: 1,
        justifyContent: 'space-between',
    },
    goodName: {
        color: Color.lightBack,
        fontSize: 14,
    },
    goodAttr: {
        color: Color.gainsboro,
        fontSize: 12,
    },
    gItemRightFoot: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    goodPriceBox: {
        flexDirection: 'row',
    },
    goodPrice: {
        fontSize: 16,
        color: Color.red,
    },
    timeLimit: {
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 2,
        color: '#fff',
        fontSize: 12,
        backgroundColor: Color.red,
        marginLeft: 10,
    },
    ctrlNumberBox: {
        flexDirection: 'row',
        width: 80,
        height: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: Color.lavender,
        borderWidth: 1,
    },
    btnCtrlNumber: {
        width: 24,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Color.lavender,
        backgroundColor: Color.floralWhite,
    },
    btnCtrlNumberText: {
        color: Color.lightBack,
        fontSize: 11,
    },
});