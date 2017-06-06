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

import CtrlNumber from '../other/CtrlNumber';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import { Size, PX, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class GoodItem extends Component {
    // 默认参数
    static defaultProps = {
        key1: null,
        key2: null,
    };
    // 参数类型
    static propTypes = {
        updateCarDatas: React.PropTypes.func,
        good: React.PropTypes.object.isRequired,
        carDatas: React.PropTypes.array.isRequired,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            isSelect: null,
        };
        this.number = null;
        this.maxNum = null;
        this.error = null;
        this.message = null;
    }

    componentWillMount() {
        if(this.props.good) {
            this.setState({
                isSelect: this.props.ctrlSelect,
            }, ()=>this.updateCar(null, null));
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.ctrlSelect !== null) {
            this.setState({
                isSelect: nextProps.ctrlSelect,
            }, ()=>this.updateCar(nextProps.key1, null));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.ctrlSelect !== null ||
            (nextProps.ctrlSelect === null && 
                nextProps.changeKEY1 === nextProps.key1 &&
                nextProps.changeKEY2 === nextProps.key2 &&
                nextState.isSelect != this.state.isSelect
            ) ||
            nextState.isSelect != this.state.isSelect
        ) {
            return true;
        }else {
            return false;
        }
    }

    render() {
        if(!this.props.good) return null;
        let good = this.props.good;
        this.maxNum = good.whNum || null;
        let gid = good.gID || 0;
        let selectIcon = this.state.isSelect ? 
            require('../../images/car/select.png') : 
            require('../../images/car/no_select.png');
        let img = good.gPicture || null;
        let goodImg = img ? {uri: img} : require('../../images/empty.png');
        let goodName = good.gName || '';
        let goodAttr = good.mcAttr || '';
        let goodPrice = good.gPrice || null;
        let goodType = good.type || 0;
        let goodNum = parseInt(good.gNum);

        return (
            <View style={styles.goodBox}>
                <View style={styles.selectIconView}>
                    <BtnIcon 
                        src={selectIcon} 
                        width={20} 
                        press={this.changeSelectState} 
                        style={{
                            paddingLeft: PX.marginLR,
                            paddingRight: 12,
                            paddingTop: 35,
                            paddingBottom: 35,
                        }} 
                    />
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
                        <CtrlNumber 
                            num={goodNum} 
                            callBack={this.callBack} 
                            checkFunc={this.checkFunc} 
                            addFailFunc={this.addFailFunc}
                        />
                    </View>
                </View>
            </View>
        );
    }

    //数量检查
    checkFunc = (num) => {
        if(isNaN(num)) {
            this.error = 1;
            this.message = Lang[Lang.default].missParam;
        }else if(num < 0) {
            this.error = 2;
            this.message = Lang[Lang.default].stockNothing;
        }else if(num === 0) {
            this.error = 3;
            this.message = Lang[Lang.default].shopNumberLessOne;
        }else if(num > this.maxNum) {
            this.error = 4;
            this.message = Lang[Lang.default].insufficientStock;
        }else {
            return true;
        }
        return false;
    };

    callBack = (num) => {
        this.number = num;
        this.updateCar(this.props.key1, this.props.key2);
    };

    //数量添加失败
    addFailFunc = (num) => {
        if(this.error) {
            alert(this.message);
        }
    };

    //隐藏提示框
    hideReturnMsg = () => {
        this.error = null;
        this.message = null;
        this.setState({
            showReturnMsg: false,
        });
    };

    // 更新购物车数据
    updateCar = (index1, index2) => {
        let newSelectState = this.state.isSelect;
        let { key1, key2, keyword, carDatas, updateCarDatas } = this.props;
        if(key1 !== null && key2 !== null && keyword !== null && carDatas && carDatas[key1] && updateCarDatas) {
            carDatas[key1][keyword][key2].select = newSelectState;
            carDatas[key1][keyword][key2].number = this.number;
            updateCarDatas(carDatas, index1, index2);
        }
    };

    // 改变商品选中状态
    changeSelectState = () => {
        this.setState({isSelect: !this.state.isSelect}, ()=>{
            this.updateCar(this.props.key1, this.props.key2);
        });
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    goodBox: {
        height: 122,
        flexDirection: 'row',
        padding: PX.marginLR,
        paddingLeft: 0,
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
});