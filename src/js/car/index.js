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
    Modal,
    Animated,
} from 'react-native';

import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import Order from '../datas/order.json';
import Goods from '../datas/goods.json';
import ShopItem from './ShopItem';
import ProductItem from '../other/ProductItem';
import AlertMoudle from '../other/AlertMoudle';

export default class CarsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carDatas: null,     //购物车商品
            invalidList: null,  //购物车失效商品
            goodList: null,     //猜你喜欢的商品列表
            isSelect: true,     //当前全选状态
            ctrlSelect: true,   //改变子选择状态
            changeKEY1: null,   //将要改变的子选项
            changeKEY2: null,   //将要改变的子子选项
            editing: false,
            showAlert: false,
            deleteAlert: false,
            operateMsg: null,
            msgPositon: new Animated.Value(0),
        };

        this.cars = [];
        this.alertMsg = '';
        this.ref_flatList = null;
        this.alertObject = {};
    }

    componentDidMount() {
        this.initDatas();
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    //初始化数据
    initDatas = () => {
        if(Order.orderInfo) {
            let orders = Order.orderInfo;
            let orders_ok = [], invalidList = [];
            for(let i in orders) {
                let shop = {}, plist = [];
                for(let j in orders[i]) {
                    if(j == 'productList') {
                        for(let k in orders[i][j]) {
                            let p = orders[i][j][k] || null;
                            if(p && p.id > 0 && p.number > 0 && !p.isDelete) {
                                plist.push(p);
                            }else {
                                invalidList.push(p);
                            }
                        }
                    }else {
                        shop[j] = orders[i][j];
                    }
                }
                if(plist.length > 0) {
                    shop['productList'] = plist;
                    orders_ok.push(shop);
                }
            }
            // console.log(orders_ok);
            // console.log(invalidList);
            this.cars = orders_ok;
            this.setState({
                carDatas: orders_ok,
                invalidList: invalidList,
                goodList: Goods,
            });
        }
    };

    render() {
        let { navigation } = this.props;
        let left = (navigation.state.params && navigation.state.params.goGoodDetails) ? 
            <BtnIcon width={PX.headIconSize} press={()=>{navigation.goBack(null);}} src={require("../../images/back.png")} />
            : null;
        let right = this.state.carDatas ?
            <Text style={styles.editCarText} onPress={()=>{
                this.setState({editing: !this.state.editing})
            }}>
                {this.state.editing ? Lang[Lang.default].done : Lang[Lang.default].edit}
            </Text> 
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
                        {this.bodyContent()}
                    </View>
                    <Animated.View style={[styles.ctrlResultView, {bottom: this.state.msgPositon}]}>
                        <Text style={styles.ctrlResultText}>{this.state.operateMsg}</Text>
                    </Animated.View>
                    <View style={styles.carFooter}>
                        <View style={styles.rowStyle}>
                            <BtnIcon width={20} text={Lang[Lang.default].selectAll} src={selectIcon} press={()=>{
                                let newState = !this.state.isSelect;
                                this.setState({
                                    isSelect: newState,
                                    ctrlSelect: newState,
                                    changeKEY1: null,
                                    changeKEY2: null,
                                });
                            }} />
                        </View>
                        {this.state.editing ?
                            <View style={styles.rowStyle}>
                                <TouchableOpacity style={styles.btnCollection} onPress={this.clickCollection}>
                                    <Text style={styles.settlementText}>{Lang[Lang.default].collection}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnDelete} onPress={this.clickDelete}>
                                    <Text style={styles.settlementText}>{Lang[Lang.default].delete}</Text>
                                </TouchableOpacity>
                            </View> :
                            <View style={styles.rowStyle}>
                                <View style={styles.carFooterRightLeft}>
                                    <Text style={styles.textStyle1}>{Lang[Lang.default].total2 + ':'}</Text>
                                    <Text style={styles.textStyle2}>{100}</Text>
                                    <Text style={styles.textStyle3}>{Lang[Lang.default].excludingFreight}</Text>
                                </View>
                                <TouchableOpacity style={styles.btnSettlement} onPress={this.goSettlement}>
                                    <Text style={styles.settlementText}>{Lang[Lang.default].settlement}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    <ModalAlert visiable={this.state.showAlert} message={this.alertMsg} hideModal={this.hideAutoModal} />
                    <AlertMoudle visiable={this.state.deleteAlert} {...this.alertObject} />
                </View>
            </View>
        );
    }

    //购物车内容
    carsBox = () => {
        let that = this;
        let cars = this.state.carDatas ? 
            <View style={{backgroundColor: Color.lightGrey}}>
                {this.state.carDatas.map(function(item, index) {
                    return (
                        <ShopItem 
                            key={index} 
                            key1={index}
                            shop={item} 
                            keyword={'productList'}
                            carDatas={that.state.carDatas}
                            ctrlSelect={that.state.ctrlSelect} 
                            updateCarDatas={that.updateCarDatas}
                            changeKEY1={that.state.changeKEY1}
                            changeKEY2={that.state.changeKEY2}
                        />
                    );
                })}
                {this.state.invalidList ?
                    <View style={styles.invalidListBox}>
                        {this.state.invalidList.map(this.invalidProduct)}
                        {this.state.editing ? 
                            <View style={styles.invalidClearBox}>
                                <Text style={styles.invalidClearText} onPress={()=>{
                                    this.showAlertMoudle(
                                        '确定要删除失效的商品吗？',
                                        '确定', 
                                        '取消',
                                        () => this.setState({deleteAlert: false,}),
                                        () => this.setState({deleteAlert: false,}),
                                    );
                                }}>{Lang[Lang.default].clearInvalidProduct}</Text>
                            </View>
                            : null
                        }
                    </View>
                    : null
                }
            </View>
            : null;
        
        return (
            <View>
                {cars}
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

    //失效商品
    invalidProduct = (item, index) => {
        let img = item.goodImgUrl || null;
        let goodImg = img ? {uri: img} : require('../../images/empty.png');
        let goodName = item.name || '';
        let goodAttr = item.attr || '';
        let goodPrice = item.price || null;
        let goodMartPrice = item.martPrice || null;
        let goodType = item.type || 0;
        return (
            <View key={index} style={styles.invalidGoodBox}>
                <View style={styles.invalidView}>
                    <Text style={styles.invalidText1}>{Lang[Lang.default].invalid}</Text>
                </View>
                <Image source={goodImg} style={styles.invalidGoodImg} />
                <View style={styles.invalidItemRight}>
                    <Text style={styles.invalidText2}>{goodName}</Text>
                    <Text style={styles.invalidText1}>{Lang[Lang.default].specification + ': ' + goodAttr}</Text>
                    <View style={styles.invalidItemRightFoot}>
                        <Text style={styles.invalidText3}>{Lang[Lang.default].RMB + goodPrice}</Text>
                        {/*goodType == 1 ?
                            <Text style={styles.timeLimit}>{Lang[Lang.default].timeLimit}</Text>
                            : null
                        */}
                    </View>
                </View>
            </View>
        );
    };

    //正文内容 (购物车商品和猜你喜欢商品)
    bodyContent = () => {
        return (
            <FlatList
                ref={(_ref)=>this.ref_flatList=_ref} 
                data={this.state.goodList}
                numColumns={2}
                contentContainerStyle={{backgroundColor: '#fff'}}
                keyExtractor={(item, index) => (index)}
                enableEmptySections={true}
                renderItem={this._renderItem}
                ListHeaderComponent={this.carsBox}
                onEndReached={()=>{
                    // this.loadMore();
                }}
            />
        );
    }

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

    /**
     * 更新购物车数据
     * 子选项与全选按钮关联起来
     * @param object datas 最新购物车数据
     * @param int/string key1 更改状态的子选项
     * @param int/string key2 更改状态的子子选项
     */
    updateCarDatas = (datas, key1, key2) => {
        // console.log(datas);
        this.cars = datas;
        if(key1 !== null) {
            //如果全部被选中激活全选
            let isSelectAll = true;
            for(let i in datas) {
                for(let j in datas[i]['productList']) {
                    if(datas[i]['productList'][j].select === false) {
                        isSelectAll = false;
                    }
                }
            }
            this.setState({
                isSelect: isSelectAll,
                ctrlSelect: null,
                changeKEY1: key1,
                changeKEY2: key2,
            });
        }
    };

    //过滤出选中的商品
    selectProducts = () => {
        let products = [];
        let _cars = this.cars;
        for(let i in _cars) {
            for(let j in _cars[i]['productList']) {
                let id = _cars[i]['productList'][j].id || 0;
                let num = _cars[i]['productList'][j].number || 0;
                let select = _cars[i]['productList'][j].select;
                if(id > 0 && num > 0 && select !== false) products.push(id);
            }
        }
        
        if(products.length > 0) {
            return products;
        }else {
            this.showAutoModal(Lang[Lang.default].youNotSelectProduct);
            return false;
        }
    };

    //显示提示框
    showAutoModal = (msg) => {
        this.alertMsg = msg;
        this.setState({showAlert: true, });
    };

    //隐藏提示框
    hideAutoModal = () => {
        this.setState({ showAlert: false });
    };

    //显示删除提示框
    showAlertMoudle = (msg, left, right, lclick, rclick) => {
        this.alertObject = {
            text: msg,
            leftText: left, 
            rightText: right,
            leftClick: lclick,
            rightClick: rclick,
        };
        this.setState({deleteAlert: true,});
    };

    //删除、收藏等操作结果通知
    resultMsgAnimated = () => {
        let that = this;
        Animated.timing(this.state.msgPositon, {
            toValue: PX.rowHeight1,
            duration: 450,
        }).start();
        this.timer = setTimeout(()=>{
            Animated.timing(that.state.msgPositon, {
                toValue: 0,
                duration: 300,
            }).start();
        }, 3000);
    };

    //点击结算
    goSettlement = () => {
        let products = this.selectProducts();
        if(products) {
            let { navigation } = this.props;
            console.log(this.cars);
            // navigation.navigate('AddOrder');
        }
    };

    //点击收藏
    clickCollection = () => {
        let products = this.selectProducts();
        if(products) {
            this.showAlertMoudle(
                '确定要收藏选中商品吗？',
                '确定', 
                '取消',
                () => this.setState({deleteAlert: false,}),
                () => this.setState({deleteAlert: false,}),
            );
        }
    };

    //点击删除
    clickDelete = () => {
        let products = this.selectProducts();
        if(products) {
            this.showAlertMoudle(
                '确定要删除选中商品吗？',
                '确定', 
                '取消',
                () => {
                    this.setState({
                        deleteAlert: false,
                        operateMsg: '删除成功!',
                    }, this.resultMsgAnimated);
                },
                () => this.setState({deleteAlert: false,}),
            );
        }
    };
}

class ModalAlert extends Component {
    // 默认参数
    static defaultProps = {
        message: '',
        visiable: false,
    };
    // 参数类型
    static propTypes = {
        message: React.PropTypes.string.isRequired,
        visiable: React.PropTypes.bool.isRequired,
        hideModal: React.PropTypes.func,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
        };
        this.timer = null;
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    render() {
        if(this.props.visiable) {
            this.timer = setTimeout(this.props.hideModal, 2500);
        }
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.props.visiable}
                onRequestClose={() => {
                    this.timer && clearTimeout(this.timer);
                }}
            >
                <TouchableOpacity 
                    style={modalStyle.modalBody} 
                    activeOpacity={1} 
                    onPress={this.props.hideModal} 
                    onLongPress={this.props.hideModal} 
                >
                    <View style={modalStyle.alertBody}>
                        <View style={modalStyle.alertIconView}>
                            <Image source={require('../../images/careful_big.png')} style={modalStyle.alertIcon} />
                        </View>
                        <Text style={modalStyle.alertMssage}>{this.props.message}</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
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
    rowStyle: {
        flexDirection : 'row',
        alignItems: 'center',
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
    ctrlResultView: {
        position: 'absolute',
        width: Size.width,
        height: PX.rowHeight1,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ctrlResultText: {
        fontSize: 16,
        color: '#fff',
    },
    btnSettlement: {
        width: 100,
        height: PX.rowHeight1,
        backgroundColor: Color.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnCollection: {
        width: 90,
        height: PX.rowHeight1,
        backgroundColor: Color.orange,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnDelete: {
        width: 90,
        height: PX.rowHeight1,
        backgroundColor: Color.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settlementText: {
        fontSize: 14,
        color: '#fff',
    },
    invalidListBox: {
        marginBottom: PX.marginTB
    },
    invalidGoodBox: {
        height: 122,
        flexDirection: 'row',
        padding: PX.marginLR,
        marginBottom: 5,
        backgroundColor: '#fff',
    },
    invalidView: {
        width: 32,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    invalidText1: {
        fontSize: 12,
        color: Color.gainsboro2,
    },
    invalidText2: {
        fontSize: 14,
        color: Color.gainsboro2,
    },
    invalidText3: {
        fontSize: 16,
        color: Color.gainsboro2,
    },
    invalidGoodImg: {
        width: 90,
        height: 90,
        marginRight: 12,
    },
    invalidItemRight: {
        flex: 1,
        justifyContent: 'space-between',
    },
    invalidGoodName: {
        color: Color.lightBack,
        fontSize: 14,
    },
    invalidGoodAttr: {
        color: Color.gainsboro,
        fontSize: 12,
    },
    invalidItemRightFoot: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    timeLimit: {
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 2,
        color: '#fff',
        fontSize: 12,
        backgroundColor: Color.gainsboro2,
        marginLeft: 10,
    },
    invalidClearBox: {
        height: PX.rowHeight1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -5,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: Color.lavender,
    },
    invalidClearText: {
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Color.mainColor,
        fontSize: 12,
        color: Color.mainColor,
    },
    goodlistTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: PX.rowHeight1,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        marginBottom: PX.marginTB,
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

var modalStyle = StyleSheet.create({
    modalBody: {
        width: Size.width,
        height: Size.height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBody: {
        width: 240,
        height: 132,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, .7)',
        alignItems: 'center',
    },
    alertIconView: {
        width: 50,
        height: 50,
        marginTop: 28,
        marginBottom: 14,
    },
    alertIcon: {
        width: 50,
        height: 50,
    },
    alertMssage: {
        fontSize: 16,
        color: '#fff',
    },
});