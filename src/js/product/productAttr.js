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

import CtrlNumber from '../other/CtrlNumber';
import Lang, {str_replace} from '../public/language';
import { Size, PX, pixel, Color } from '../public/globalStyle';
import ReturnAlert from './returnAlert';

export default class ProductAttr extends Component {
    // 默认参数
    static defaultProps = {
        isShow: false,
        type: 0,
    };
    // 参数类型
    static propTypes = {
        isShow: React.PropTypes.bool.isRequired,
        attrs: React.PropTypes.array,
        chlidAtrrs: React.PropTypes.array,
        type: React.PropTypes.oneOf([0, 1]),
        attrCallBack: React.PropTypes.func,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            selects: [],
            showReturnMsg: false,
        };
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
        if(isNaN(num) || num < 0) {
            this.error = 1;
            this.message = Lang[Lang.default].missParam;
        }else if(num === 0) {
            this.error = 2;
            this.message = Lang[Lang.default].shopNumberLessOne;
        }else if(num > 9) {
            this.error = 2;
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
        console.log(selects);
        console.log(priceAtrrs);
        for(let i in selects) {
            let index = selects[i] || 0;
            console.log(priceAtrrs[index]);
            if(typeof(priceAtrrs[index]) == 'string' || typeof(priceAtrrs[index]) == 'number') {
                productPrice = parseFloat(priceAtrrs[index]);
            }else if(priceAtrrs[index]) {
                priceAtrrs = priceAtrrs[index];
            }
        }
        return productPrice;
    };

    //加入购物车、确定事件
    joinCarFunc = () => {
        this.props.attrCallBack(this.getAllChildAttr());
    };

    render() {
        let { isShow, attrs, chlidAtrrs, hideModal, type, productImg } = this.props;
        // let _attrs = attrs;
        // let _chlidAtrrs = chlidAtrrs;
        // _attrs[1] = {name: '套餐'};
        // _attrs[2] = {name: '颜色'};
        // _chlidAtrrs[1] = ['套餐一', '套餐二', '套餐三', '套餐四',];
        // _chlidAtrrs[2] = ['红色', '黑色', '白色', ];
        let img = productImg ? {uri: productImg} : require('../../images/empty.png');
        let stock = 999;
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={isShow}
                onRequestClose={() => {
                }}
            >
                <View style={styles.modalHtml}>
                    <View style={styles.modalBody}>
                        <View style={styles.priceStockRow}>
                            <View style={styles.priceStockBox}>
                                <Text style={styles.priceText}>{Lang[Lang.default].RMB + this.getAttrPrice()}</Text>
                                <Text style={styles.stockText}>{Lang[Lang.default].stock + ' ' + stock}</Text>
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
                                onPress={this.joinCarFunc}
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
                                onPress={this.joinCarFunc}
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