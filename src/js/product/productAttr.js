/**
 * 商品详情 - 商品属性选择
 * @auther linzeyong
 * @date   2017.05.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';

import User from '../public/user';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import CtrlNumber from '../other/CtrlNumber';
import Lang, {str_replace} from '../public/language';
import { Size, PX, pixel, Color } from '../public/globalStyle';
import ReturnAlert from './returnAlert';

var _User = new User();

export default class ProductAttr extends Component {
    // 默认参数
    static defaultProps = {
        isShow: false,
        type: 0,
    };
    // 参数类型
    static propTypes = {
        gid: React.PropTypes.number.isRequired,
        isShow: React.PropTypes.bool.isRequired,
        attrs: React.PropTypes.array,
        chlidAtrrs: React.PropTypes.array,
        type: React.PropTypes.oneOf([0, 1]),
        attrCallBack: React.PropTypes.func,
        priceAtrrs: React.PropTypes.array,
        pWarehouse: React.PropTypes.array,
        carDatas: React.PropTypes.array,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            selects: [],
            showReturnMsg: false,
        };

        this.btnLock = false;
        this.stock = null;
        this.money = null;
        this.number = 1;
        this.error = null;
        this.message = null;
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    //数量检查
    checkFunc = (num) => {
        let maxStock = this.getAttrStock();
        if(isNaN(num)) {
            this.error = 1;
            this.message = Lang[Lang.default].missParam;
        }else if(num < 0) {
            this.error = 2;
            this.message = Lang[Lang.default].stockNothing;
        }else if(num === 0) {
            this.error = 3;
            this.message = Lang[Lang.default].shopNumberLessOne;
        }else if(num > maxStock) {
            this.error = 4;
            this.message = Lang[Lang.default].insufficientStock;
        }else {
            return true;
        }
        return false;
    };

    //数量添加失败
    addFailFunc = (num) => {
        if(this.error) {
            this.setState({
                showReturnMsg: true,
            }, () => {
                this.timer = setTimeout(()=>{
                    if(this.state.showReturnMsg) {
                        this.hideReturnMsg();
                    }
                }, 2500);
            });
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

    //数量添加成功
    addSuccessFunc = (num) => {
        this.number = num;
        // console.log('已选数量：' + this.number);
    };

    //获取所有规格
    getAllChildAttr = () => {
        let datas = {
            index: [],
            names: [],
            number: this.number,
        };
        let that = this;
        let chlidAtrrs = this.props.chlidAtrrs || [];
        for(let i in chlidAtrrs) {
            let index = parseInt(that.state.selects[i]) || 0;
            let name = chlidAtrrs[i][index] || '';
            datas.index.push(index);
            datas.names.push(name);
        }
        console.log('属性选择：', datas);
        return datas;
    };

    //获取所选属性的价格
    getAttrPrice = () => {
        let that = this;
        let selects = [];
        let { attrs, chlidAtrrs } = this.props;
        let priceAtrrs = this.props.priceAtrrs || [];
        let productPrice = this.props.productPrice;
        for(let i in chlidAtrrs) {
            let check = attrs[i].check || false;
            if(check && check !== '0') {
                let index = parseInt(that.state.selects[i]) || 0;
                selects.push(index);
            }
        }
        for(let i in selects) {
            let index = selects[i] || 0;
            if(typeof(priceAtrrs[index]) == 'string' || typeof(priceAtrrs[index]) == 'number') {
                productPrice = parseFloat(priceAtrrs[index]);
            }else if(priceAtrrs[index]) {
                priceAtrrs = priceAtrrs[index];
            }
        }
        return productPrice;
    };

    //获取所选属性的库存
    getAttrStock = () => {
        let that = this;
        let gid = this.props.gid;
        let pWarehouse = this.props.pWarehouse || [];
        let datas = this.getAllChildAttr();
        let names = datas.names.join(',') || null;
        let indexs = datas.index.join(',') || null;
        let cars = this.props.carDatas || [];
        let stock = 0;
        if(names && indexs) {
            for(let i in pWarehouse) {
                let attr_name = pWarehouse[i].whPackname || null;
                let attr_index = pWarehouse[i].whSubscript || null;
                let number = parseInt(pWarehouse[i].whNum) || 0;
                if(names == attr_name && indexs == attr_index) {
                    stock = number;
                    for(let c in cars) {
                        if(names == cars[c].mcAttr && indexs == cars[c].mcAttrSub && gid == cars[c].gID) {
                            let num = parseInt(cars[c].gNum) || 0;
                            stock -= num;
                        }
                    }
                    break;
                }
            }
        }
        return stock;
    };

    //加入购物车、确定事件
    joinCarFunc = () => {
        this.btnLock = true;
        let that = this;
        let datas = this.getAllChildAttr();
        if(this.stock <= 0) {
            this.error = 2;
            this.message = Lang[Lang.default].stockNothing;
            this.setState({showReturnMsg: true});
        }else if(!this.number || this.number <= 0) {
            this.error = 3;
            this.message = Lang[Lang.default].shopNumberLessOne;
            this.setState({showReturnMsg: true});
        }else if(datas && datas.names && datas.number && datas.index && this.money !== null) {
            let userid = this.props.userid || null;
            let obj = Object.assign({
                gID: that.props.gid,
                gAttr: datas.names.join(','),
                gAttrSub: datas.index.join(','),
                gNum: datas.number,
                gPrice: that.money,
            }, userid);
            Utils.fetch(Urls.addCarProduct, 'post', obj, function(result) {
                console.log(result);
                that.btnLock = false;
                if(result) {
                    if(result.sTatus == 1) {
                        let cars = result.cars || [];
                        if(!userid && result.Tourist) {
                            console.log('存储新ID：' + result.Tourist);
                            _User.saveUserID(_User.keyTourist, result.Tourist)
                            .then(() => {
                                that.props.attrCallBack(cars, obj, result.Tourist);
                            });
                        }else {
                            that.props.attrCallBack(cars, obj, null);
                        }
                    }else if(result.sMessage) {
                        that.error = 501;
                        that.message = result.sMessage;
                        that.setState({showReturnMsg: true});
                    }
                }
            });
        }
    };

    render() {
        let { gid, isShow, attrs, chlidAtrrs, hideModal, type, productImg } = this.props;
        if(!gid || !isShow) return null;
        let img = productImg ? {uri: productImg} : require('../../images/empty.png');
        this.stock = this.getAttrStock();
        this.money = this.getAttrPrice();
        if(!this.stock || this.stock < 0) {
            this.number = 0;
        }else if(this.stock < this.number) {
            this.number = this.stock > 0 ? 1 : 0;
        }else if(this.number == 0 && this.stock > 0){
            this.number = 1;
        }
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={isShow}
                onRequestClose={() => {
                }}
            >
                <View style={styles.modalHtml}>
                    <View style={styles.flex}>
                        <TouchableOpacity style={styles.flex} activeOpacity={1} onPress={hideModal} />
                    </View>
                    <View style={styles.modalBody}>
                        <View style={styles.priceStockRow}>
                            <View style={styles.priceStockBox}>
                                <Text style={styles.priceText}>{Lang[Lang.default].RMB + this.money}</Text>
                                <Text style={styles.stockText}>{Lang[Lang.default].stock + ' ' + this.stock}</Text>
                            </View>
                            <TouchableOpacity onPress={hideModal} style={styles.rowCloseBox}>
                                <Image style={styles.rowCloseImg} source={require('../../images/close.png')} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {attrs.map((item, index) => {
                                let cAttr = chlidAtrrs[index] || [];
                                return this.attrBox(item, index, cAttr);
                            })}
                            <View style={styles.shopNumberBox}>
                                <View style={styles.shopNumberLeft}>
                                    <Text style={styles.shopNumberTitle}>{Lang[Lang.default].shopNumber}</Text>
                                </View>
                                <CtrlNumber 
                                    num={this.number} 
                                    callBack={this.addSuccessFunc}
                                    checkFunc={this.checkFunc}
                                    addFailFunc={this.addFailFunc}
                                />
                            </View>
                        </ScrollView>
                    </View>
                    {type == 1 ?
                        <View style={styles.footRow}>
                            <TouchableOpacity 
                                activeOpacity ={1} 
                                style={[styles.btnProductShopping, {backgroundColor: Color.mainColor}]}
                                onPress={()=>{
                                    if(!this.btnLock) {
                                        this.joinCarFunc();
                                    }
                                }}
                            >
                                <Text style={styles.btnShopText}>{Lang[Lang.default].joinCar}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                activeOpacity ={1} 
                                style={[styles.btnProductShopping, {backgroundColor: Color.orange}]}
                            >
                                <Text style={styles.btnShopText}>{Lang[Lang.default].buyNow}</Text>
                            </TouchableOpacity>
                        </View>
                        : <View style={styles.footRow}>
                            <TouchableOpacity 
                                activeOpacity ={1} 
                                style={[styles.btnProductShopping, {backgroundColor: Color.mainColor}]}
                                onPress={()=>{
                                    if(!this.btnLock) {
                                        this.joinCarFunc();
                                    }
                                }}
                            >
                                <Text style={styles.btnShopText}>{Lang[Lang.default].determine}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={styles.productImgBox}>
                        <Image source={img} style={styles.productImg} />
                    </View>
                    <ReturnAlert 
                        isShow={this.state.showReturnMsg} 
                        error={this.error}
                        message={this.message}
                        hideMsg={this.hideReturnMsg}
                    />
                </View>
            </Modal>
        );
    }

    attrBox = (item, index, cAttr) => {
        let that = this;
        let title = item.name || null;
        let selects = this.state.selects;
        let select = selects[index] || 0;
        return (
            <View key={index} style={styles.attrRow}>
                <View style={styles.attrTitleBox}>
                    <Text style={styles.attrTitle}>{title}</Text>
                </View>
                <View style={styles.cAttrBox}>
                    {cAttr.map((_item, _index) => {
                        let color = _index == select ? '#fff' : Color.lightBack;
                        let borderColor = _index == select ? 'transparent' : Color.lightBack;
                        let bgColor = _index == select ? Color.mainColor : '#fff';
                        return (
                            <TouchableOpacity key={_index}  activeOpacity ={1} onPress={()=>{
                                selects[index] = _index;
                                // console.log('已选套餐:', selects);
                                that.setState({selects});
                            }}>
                                <Text numberOfLines={1} style={[styles.cAttrName, {
                                    color: color,
                                    borderColor: borderColor,
                                    backgroundColor: bgColor,
                                }]}>{_item}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    modalHtml: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    modalBody: {
        width: Size.width,
        height: Size.height * 0.6,
        backgroundColor: '#fff',
    },
    priceStockRow: {
        height: 100,
        paddingLeft: 150,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    priceStockBox: {
        flex: 1,
        justifyContent: 'center',
    },
    priceText: {
        fontSize: 20,
        color: Color.red,
        lineHeight: 26,
    },
    stockText: {
        fontSize: 14,
        color: Color.lightBack,
        lineHeight: 19,
    },
    rowCloseBox: {
        marginRight: 10,
        marginTop: 7,
        width: PX.iconSize26,
        height: PX.iconSize26,
    },
    rowCloseImg: {
        width: PX.iconSize26,
        height: PX.iconSize26,
    },
    attrRow: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderTopWidth: pixel,
        borderTopColor: Color.lavender,
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
    },
    attrTitle: {
        paddingBottom: 10,
        paddingLeft: 4,
        fontSize: 14,
        color: Color.lightBack,
    },
    cAttrBox: {
        flexDirection : 'row',
		flexWrap: 'wrap',
    },
    cAttrName: {
        fontSize: 12,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 3,
        borderWidth: 1,
        marginTop: 6,
        marginBottom: 6,
        marginRight: 10,
    },
    shopNumberBox: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
        marginBottom: 20,
    },
    shopNumberTitle: {
        fontSize: 14,
        color: Color.lightBack,
    },
    productImgBox: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 3,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        left: 20,
        bottom: PX.rowHeight1 + (Size.height * 0.6) - 90,
    },
    productImg: {
        width: 110,
        height: 110,
        borderWidth: pixel,
        borderColor: Color.lavender,
    },
    footRow: {
        flexDirection: 'row',
    },
    btnProductShopping: {
        flex: 1,
        height: PX.rowHeight1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnShopText: {
        color: '#fff',
        fontSize: 14,
    },
    alertTextView: {
        height: 130,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    alertText: {
        fontSize: 16,
        color: Color.lightBack,
    },
    bottonsBox: {
        height: 50,
        flexDirection : 'row',
    },
    leftBottonStyle: {
        flex: 1,
        backgroundColor: Color.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftBottonText: {
        fontSize: 16,
        color: '#fff',
    },
    rightBottonStyle: {
        flex: 1,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightBottonText: {
        fontSize: 16,
        color: Color.lightBack,
    },
});