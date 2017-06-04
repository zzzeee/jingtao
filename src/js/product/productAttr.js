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
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            selects: [],
            showReturnMsg: false,
        };
        this.number = 1;
        this.returnMsg = null;
    }

    render() {
        let { isShow, attrs, chlidAtrrs, hideModal, type, productImg } = this.props;
        let _attrs = attrs;
        let _chlidAtrrs = chlidAtrrs;
        _attrs[1] = {name: '套餐'};
        _attrs[2] = {name: '颜色'};
        _chlidAtrrs[1] = ['套餐一', '套餐二', '套餐三', '套餐四',];
        _chlidAtrrs[2] = ['红色', '黑色', '白色', ];
        let img = productImg ? {uri: productImg} : require('../../images/empty.png');
        let price = 79.00;
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
                                <Text style={styles.priceText}>{Lang[Lang.default].RMB + price}</Text>
                                <Text style={styles.stockText}>{Lang[Lang.default].stock + ' ' + stock}</Text>
                            </View>
                            <TouchableOpacity onPress={hideModal} style={styles.rowCloseBox}>
                                <Image style={styles.rowCloseImg} source={require('../../images/close.png')} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {_attrs.map((item, index) => {
                                let cAttr = _chlidAtrrs[index] || [];
                                return this.attrBox(item, index, cAttr);
                            })}
                            <View style={styles.shopNumberBox}>
                                <View style={styles.shopNumberLeft}>
                                    <Text style={styles.shopNumberTitle}>{Lang[Lang.default].shopNumber}</Text>
                                </View>
                                <CtrlNumber num={this.number} callBack={(num)=>{
                                    this.number = num;
                                    console.log('已选数量：' + this.number);
                                }} />
                            </View>
                        </ScrollView>
                    </View>
                    {type == 1 ?
                        <View style={styles.footRow}>
                            <TouchableOpacity 
                                activeOpacity ={1} 
                                style={[styles.btnProductShopping, {backgroundColor: Color.mainColor}]}
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
                            >
                                <Text style={styles.btnShopText}>{Lang[Lang.default].determine}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={styles.productImgBox}>
                        <Image source={img} style={styles.productImg} />
                    </View>
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