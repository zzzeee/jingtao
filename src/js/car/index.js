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
} from 'react-native';

import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import { Size, PX, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import Order from '../datas/order.json';
import ShopItem from './ShopItem';

export default class CarsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carDatas: null,
            isSelect: true,
            editing: false,
            showAlert: false,
        };

        this.timer = null;
        this.cars = [];
        this.alertMsg = '';
        this.ref_flatList = null;
    }

    componentDidMount() {
        this.initDatas();
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    initDatas = () => {
        if(Order.orderInfo) {
            this.carGoods = Order.orderInfo;
            this.setState({
                carDatas: Order.orderInfo,
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
                    <View style={styles.carFooter}>
                        <View style={styles.rowStyle}>
                            <BtnIcon width={20} text={Lang[Lang.default].selectAll} src={selectIcon} press={()=>{
                                this.setState({isSelect: !this.state.isSelect});
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
                    <ModalAlert visiable={this.state.showAlert} message={this.alertMsg} />
                </View>
            </View>
        );
    }

    //购物车内容
    carsBox = () => {
        let that = this;
        let cars = this.state.carDatas ? 
            <View style={styles.flex}>
                {this.state.carDatas.map(function(item, index) {
                    return (
                        <ShopItem 
                            key={index} 
                            key1={index}
                            shop={item} 
                            carDatas={that.state.carDatas}
                            ctrlSelect={that.state.isSelect} 
                            updateCarDatas={that.updateCarDatas} 
                        />
                    );
                })}
            </View>
            : null;
        return cars;
    };
    //正文内容 (购物车商品和猜你喜欢商品)
    bodyContent = () => {
        return (
            <FlatList
                ref={(_ref)=>this.ref_flatList=_ref} 
                data={[]}
                enableEmptySections={true}
                renderItem={this._renderItem}
                ListHeaderComponent={this.carsBox}
                onEndReached={()=>{
                    // this.loadMore();
                }}
                // onEndReachedThreshold={50}
                getItemLayout={(data, index)=>({length: PX.shopItemHeight, offset: PX.shopItemHeight * index, index})}
            />
        );
    }

    //猜你喜欢商品
    _renderItem = ({item, index}) => {

    };

    //更新购物车数据
    updateCarDatas = (datas) => {
        // console.log(datas);
        this.cars = datas;
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
        return products.length > 0 ? products : null; 
    };

    //显示提示框, 自动关闭
    showAutoModal = (msg) => {
        let that = this;
        this.alertMsg = msg;
        
        this.setState({ 
            showAlert: true,
        }, ()=>{
            that.timer = setTimeout(() => {
                that.setState({ showAlert: false });
            }, 3000);
        });
    };

    //点击结算
    goSettlement = () => {
        let products = this.selectProducts();
        if(products) {
            let { navigation } = this.props;
            console.log(this.cars);
            // navigation.navigate('AddOrder');
        }else {
            this.showAutoModal(Lang[Lang.default].youNotSelectProduct);
        }
    };

    //点击收藏
    clickCollection = () => {
        this.showAutoModal('你点击的是收藏！');
    };

    //点击删除
    clickDelete = () => {
        this.showAutoModal('你点击的是删除！');
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
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.props.visiable}
                onRequestClose={() => {}}
            >
                <TouchableOpacity 
                    style={modalStyle.modalBody} 
                    activeOpacity={1} 
                    onPress={this.props.hideMenu} 
                    onLongPress={this.props.hideMenu} 
                >
                    <View style={modalStyle.alertBody}>
                        <View style={modalStyle.alertIcon}>
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
    alertIcon: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        marginTop: 28,
        marginBottom: 14,
    },
    alertMssage: {
        fontSize: 16,
        color: '#fff',
    },
});