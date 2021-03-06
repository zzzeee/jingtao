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

import User from '../public/user';
import Utils from '../public/utils';
import AppHead from '../public/AppHead';
import Urls from '../public/apiUrl';
import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace, TABKEY} from '../public/language';
import ShopItem from './ShopItem';
import ProductItem from '../other/ProductItem';
import AlertMoudle from '../other/AlertMoudle';
import ErrorAlert from '../other/ErrorAlert';
import Coupons from '../product/Coupons';
import Nothing from '../other/ListNothing';
import { EndView } from '../other/publicEment';

var _User = new User();

export default class CarsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carDatas: null,     //购物车商品
            invalidList: [],    //购物车失效商品
            goodList: null,     //猜你喜欢的商品列表
            tmpDatas: [],       //猜你喜欢商品的数据缓存
            isSelect: false,    //当前全选状态
            ctrlSelect: false,  //改变子选择状态
            changeKEY1: null,   //将要改变的子选项
            changeKEY2: null,   //将要改变的子子选项
            editing: false,
            showAlert: false,
            deleteAlert: false,
            operateMsg: null,
            msgPositon: new Animated.Value(0),
            isRefreshing: true,
            showCouponList: false,
            uCoupons: [],
        };
        
        this.page = 1;
        this.pageNumber = 10;
        this.loadMoreLock = false;
        this.cars = [];
        this.alertMsg = '';
        this.ref_flatList = null;
        this.alertObject = {};
        this.userinfo = null;
        this.total = 0;
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
    initDatas = async () => {
        let obj = {
            editing: false,
            isRefreshing: false,
            isSelect: false,
            ctrlSelect: false,
        };
        this.userinfo = await _User.getUserInfo();
        if(this.userinfo) {
            let car = await Utils.async_fetch(Urls.getCarInfo, 'post', this.userinfo) || null;
            console.log(car);
            if(car) {
                let ret = car.sTatus || 0;
                let msg = car.sMessage || null;
                let userCar = car.cartAry || {};
                if(ret == 4) {
                    if(this.userinfo[_User.keyMember]) this.userinfo = false;
                    await _User.delUserID(_User.keyMember);
                    this.alertObject = {
                        text: Lang[Lang.default].accountInvalidation,
                        leftText: Lang[Lang.default].logInAgain2,
                        rightText: Lang[Lang.default].cancel,
                        rightClick: ()=>this.setState({deleteAlert: false,}),
                        leftClick: ()=>{
                            this.setState({deleteAlert: false,}, ()=>{
                                this.props.navigation.navigate('Login', {
                                    back: 'TabNav', 
                                    backObj: {PathKey: TABKEY.car},
                                });
                            });
                        },
                    };
                    obj.carDatas = [];
                    obj.deleteAlert = true;
                }else if(ret == 1) {
                    obj.carDatas = userCar.normalAry || [];
                    obj.invalidList = userCar.abnormalAry || [];
                }else {
                    obj.carDatas = [];
                }
            }
        }

        if(!this.state.goodList || this.state.goodList.length === 0) {
            if(this.state.tmpDatas && this.state.tmpDatas.length > 0) {
                console.log('原商品列表有缓存');
                obj.goodList = this.state.tmpDatas;
            }else {
                console.log('加载猜你喜欢商品');
                let recommends = await Utils.async_fetch(Urls.getRecommendList, 'get', {
                    pPage: this.page, 
                    pPerNum: this.pageNumber,
                });
                if(recommends && recommends.proAry) {
                    this.page++;
                    obj.goodList = recommends.proAry || [];
                }
            }
        }else {
            console.log('没有加载猜你喜欢商品');
        }
        this.setState(obj);
    };

    //获取会员信息
    getToken = () => {
        return (this.userinfo && this.userinfo[_User.keyMember]) ? this.userinfo[_User.keyMember] : null;
    };

    //跳转至登录
    goToLogin = (_back = null, _backObj = null) => {
        let { navigation } = this.props;
        if(navigation) {
            navigation.navigate('Login', {
                back: _back,
                backObj: _backObj,
            });
        }
    };

    // 加载更多
    loadMore = () => {
        if(!this.loadMoreLock) {
            let that = this;
            this.loadMoreLock = true;
            Utils.fetch(Urls.getRecommendList, 'get', {
                pPage: this.page, 
                pPerNum: this.pageNumber,
            }, function(result){
                if(result && result.sTatus && result.proAry && result.proAry.length) {
                    let goodList = that.state.goodList.concat(result.proAry);
                    console.log(result.proAry);
                    that.page++;
                    that.loadMoreLock = false;
                    that.setState({ goodList });
                }
            });
        }
    };

    //显示优惠券列表
    showCouponBox = (sid) => {
        if(sid && sid > 0) {
            Utils.fetch(Urls.getShopCoupons, 'post', {
                sID: sid,
            }, (result) => {
                console.log(result);
                if(result && result.sTatus && result.mCoupon) {
                    let list = result.mCoupon || [];
                    this.setState({
                        showCouponList: true,
                        uCoupons: list,
                    });
                }
            }, null, {
                catchFunc: (err) => {
                    console.log('获取数据出错');
                    console.log(err);
                    alert(Lang[Lang.default].serverError);
                },
            });
        }
    };

    //隐藏优惠券列表
    hideCouponBox = () => {
        this.setState({showCouponList: false});
    };

    render() {
        let { navigation } = this.props;
        let left = (navigation.state.params && navigation.state.params.goGoodDetails) ? 
            <TouchableOpacity onPress={()=>navigation.goBack(null)}>
                <Image source={require("../../images/back.png")} style={{
                    width: PX.headIconSize,
                    height: PX.headIconSize,
                }} />
            </TouchableOpacity>
            : null;
        let right = (this.state.carDatas && this.state.carDatas.length) ?
            <Text style={styles.editCarText} onPress={()=>{
                let newState = !this.state.editing;
                if(newState) {
                    this.setState({
                        editing: newState,
                        tmpDatas: this.state.goodList,
                        goodList: [],
                    });
                }else {
                    this.setState({
                        editing: newState,
                        goodList: this.state.tmpDatas,
                    });
                }
            }}>
                {this.state.editing ? Lang[Lang.default].done : Lang[Lang.default].edit}
            </Text> 
            : null;
        let mToken = this.getToken();
        return (
            <View style={styles.flex}>
                <AppHead 
                    title={Lang[Lang.default].tab_car}
                    left={left}
                    right={right}
                    onPress={()=>{
                        this.ref_flatList && this.ref_flatList.scrollToOffset({offset: 0, animated: true});
                    }}
                />
                {this.pageBody()}
                {this.state.showCouponList ?
                    <Coupons
                        type={3}
                        userid={mToken}
                        coupons={this.state.uCoupons}
                        isShow={this.state.showCouponList}
                        hideCouponBox={this.hideCouponBox}
                        navigation={navigation}
                        back={'TabNav'}
                        backObj={{PathKey: TABKEY.car}}
                    />
                    : null
                }
                {this.state.deleteAlert ?
                    <AlertMoudle visiable={this.state.deleteAlert} {...this.alertObject} />
                    : null
                }
            </View>
        );
    }

    pageBody = () => {
        let { carDatas, isSelect, editing, msgPositon, operateMsg, showAlert, } = this.state;
        let selectIcon = isSelect ? 
            require('../../images/car/select.png') : 
            require('../../images/car/no_select.png'); 
        return (
            <View style={styles.flex}>
                <View style={styles.container}>
                    {this.bodyContent()}
                </View>
                {(carDatas && carDatas.length > 0) ?
                    <View>
                        <Animated.View style={[styles.ctrlResultView, {bottom: msgPositon}]}>
                            <Text style={styles.ctrlResultText}>{operateMsg}</Text>
                        </Animated.View>
                        <View style={styles.carFooter}>
                            <View style={styles.rowStyle}>
                                <TouchableOpacity onPress={()=>{
                                    let newState = !isSelect;
                                    this.setState({
                                        isSelect: newState,
                                        ctrlSelect: newState,
                                        changeKEY1: null,
                                        changeKEY2: null,
                                    });
                                }} style={{
                                    paddingLeft: PX.marginLR,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Image source={selectIcon} style={{
                                        width: 20,
                                        height: 20,
                                    }} />
                                    <Text style={{
                                        marginLeft: 6,
                                        color: Color.lightBack,
                                        fontSize: 14,
                                    }}>{Lang[Lang.default].selectAll}</Text>
                                </TouchableOpacity>
                            </View>
                            {editing ?
                                <View style={styles.rowStyle}>
                                    <TouchableOpacity style={styles.btnCollection} onPress={this.selectCollection}>
                                        <Text style={styles.settlementText}>{Lang[Lang.default].collection}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.btnDelete} onPress={this.selectDelete}>
                                        <Text style={styles.settlementText}>{Lang[Lang.default].delete}</Text>
                                    </TouchableOpacity>
                                </View> :
                                <View style={styles.rowStyle}>
                                    <View style={styles.carFooterRightLeft}>
                                        <Text style={styles.textStyle1}>{Lang[Lang.default].total2 + ':'}</Text>
                                        <Text style={styles.textStyle2}>{this.total}</Text>
                                        <Text style={styles.textStyle3}>{Lang[Lang.default].excludingFreight}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.btnSettlement} onPress={this.goSettlement}>
                                        <Text style={styles.settlementText}>{Lang[Lang.default].settlement}</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </View>
                    : null
                }
                <ErrorAlert visiable={showAlert} message={this.alertMsg} hideModal={this.hideAutoModal} />
            </View>
        );
    }

    //购物车内容
    carsBox = () => {
        let that = this;
        let { navigation } = this.props;
        let { carDatas, goodList, ctrlSelect, changeKEY1, changeKEY2, invalidList, editing } = this.state;
        let cars = (carDatas && carDatas.length) ?
            <View style={{backgroundColor: Color.lightGrey}}>
                {carDatas.map((item, index) => {
                    let _keyword = 'cPro';
                    if(item && item[_keyword] && item[_keyword].length) {
                        return (
                            <ShopItem 
                                key={index} 
                                key1={index}
                                shop={item} 
                                keyword={_keyword}
                                carDatas={carDatas}
                                ctrlSelect={ctrlSelect} 
                                updateCarDatas={that.updateCarDatas}
                                changeKEY1={changeKEY1}
                                changeKEY2={changeKEY2}
                                showAutoModal={that.showAutoModal}
                                showCouponBox={that.showCouponBox}
                                userinfo={that.userinfo}
                                navigation={navigation}
                            />
                        );
                    }else {
                        return null;
                    }
                })}
                {(invalidList && invalidList.length) ?
                    <View style={styles.invalidListBox}>
                        {invalidList.map(this.invalidProduct)}
                        {editing && invalidList.length ? 
                            <View style={styles.invalidClearBox}>
                                <Text style={styles.invalidClearText} onPress={()=>{
                                    this.showAlertMoudle(
                                        Lang[Lang.default].deleteInvalidProduct,
                                        Lang[Lang.default].determine, 
                                        Lang[Lang.default].cancel,
                                        this.deleteInvalidProduct,
                                        () => this.setState({deleteAlert: false,}),
                                    );
                                }}>{Lang[Lang.default].clearInvalidProduct}</Text>
                            </View>
                            : null
                        }
                    </View>
                    : null
                }
            </View> :
            <View style={styles.centerStyle}>
                <Image source={require('../../images/home/no_result.png')} style={styles.centerImage}>
                    <Text numberOfLines={1} style={styles.centerText}>
                        {Lang[Lang.default].yourCarIsEmpty}
                    </Text>
                </Image>
            </View>;
        return (
            <View>
                {cars}
                {editing ?
                    null :
                    ((goodList && goodList.length > 0) ?
                        <View style={styles.goodlistTop}>
                            <View style={styles.goodTopLine}></View>
                            <View>
                                <Text style={styles.goodlistTopText}>{Lang[Lang.default].recommendGoods}</Text>
                            </View>
                            <View style={styles.goodTopLine}></View>
                        </View>
                        : null
                    )
                }
            </View>
        );
    };

    //失效商品
    invalidProduct = (item, index) => {
        let img = item.gPicture || null;
        let goodImg = img ? {uri: img} : require('../../images/empty.jpg');
        let goodName = item.gName || '';
        let goodAttr = item.mcAttr || '';
        let goodPrice = item.gPrice || null;
        let goodType = item.aStatus == 1 ? true : false;
        return (
            <View key={index} style={styles.invalidGoodBox}>
                <View style={styles.invalidView}>
                    <Text style={styles.invalidText1}>{Lang[Lang.default].invalid}</Text>
                </View>
                <Image source={goodImg} style={styles.invalidGoodImg}>
                    <Image style={styles.invalidGoodImg} source={require('../../images/car/invalid_goodimg_over.png')}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={styles.invalidText4}>{Lang[Lang.default].invalid}</Text>
                        </View>
                    </Image>
                </Image>
                <View style={styles.invalidItemRight}>
                    <Text style={styles.invalidText2}>{goodName}</Text>
                    <Text style={styles.invalidText1}>{Lang[Lang.default].specification + ': ' + goodAttr}</Text>
                    <View style={styles.invalidItemRightFoot}>
                        <Text style={styles.invalidText3}>{Lang[Lang.default].RMB + goodPrice}</Text>
                        {goodType == 1 ?
                            <Text style={styles.timeLimit}>{Lang[Lang.default].timeLimit}</Text>
                            : null
                        }
                    </View>
                </View>
            </View>
        );
    };

    //正文内容 (购物车商品和猜你喜欢商品)
    bodyContent = () => {
        let { isRefreshing, goodList, } = this.state;
        return (
            <FlatList
                ref={(_ref)=>this.ref_flatList=_ref} 
                data={goodList}
                numColumns={2}
                contentContainerStyle={{backgroundColor: '#fff'}}
                keyExtractor={(item, index) => (index)}
                enableEmptySections={true}
                renderItem={this._renderItem}
                ListHeaderComponent={this.carsBox}
                refreshing={isRefreshing}
                onRefresh={()=>{
                    this.setState({isRefreshing: true});
                    this.page = 1;
                    this.initDatas();
                }}
                ListFooterComponent={()=>{
                    if(goodList && goodList.length > 3) {
                        return <EndView />;
                    }else {
                        return <View />;
                    }
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
                ref={'ProductItem' + index}
                showDiscount={true}
                width={(Size.width - 20) / 2}
                navigation={this.props.navigation}
                boxStyle={{
                    marginLeft: 5,
                    marginRight: 5,
                    marginBottom: 8,
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
        this.cars = datas;
        if(key1 !== null) {
            //如果全部被选中激活全选
            let isSelectAll = true;
            let _total = 0;
            for(let i in datas) {
                for(let j in datas[i]['cPro']) {
                    if(datas[i]['cPro'][j].select) {
                        let price = parseFloat(datas[i]['cPro'][j].gPrice) || 0;
                        let number = parseInt(datas[i]['cPro'][j].gNum) || 0;
                        _total += (price * number);
                    }else if(datas[i]['cPro'][j].select === false) {
                        isSelectAll = false;
                    }
                }
            }
            this.total = parseFloat(_total.toFixed(2));
            this.setState({
                isSelect: isSelectAll,
                ctrlSelect: null,
                changeKEY1: key1,
                changeKEY2: key2,
            });
        }
    };

    //过滤出选中的商品(购物车ID)
    selectProducts = () => {
        let obj = {
            'carIDs': [],
            'goodIDs': [],
        };
        let _cars = this.cars;
        for(let i in _cars) {
            for(let j in _cars[i]['cPro']) {
                let cid = _cars[i]['cPro'][j].mcID || 0;
                let gid = _cars[i]['cPro'][j].gID || 0;
                let num = _cars[i]['cPro'][j].gNum || 0;
                let select = _cars[i]['cPro'][j].select;
                if(cid > 0 && gid > 0 && num > 0 && select !== false) {
                     obj.carIDs.push(cid);
                     obj.goodIDs.push(gid);
                }
            }
        }
        if(obj.carIDs.length > 0 && obj.goodIDs.length > 0) {
            return obj;
        }else {
            this.showAutoModal(Lang[Lang.default].youNotSelectProduct);
            return null;
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
        Animated.timing(that.state.msgPositon, {
            toValue: PX.rowHeight1,
            duration: 450,
        }).start(()=>{
            that.timer = setTimeout(()=>{
                Animated.timing(that.state.msgPositon, {
                    toValue: 0,
                    duration: 300,
                }).start();
            }, 1500);
        });
    };

    //删除失效商品
    deleteInvalidProduct = () => {
        let ids = [];
        let list = this.state.invalidList;
        for(let i in list) {
            let carid = list[i].mcID || null;
            if(carid && carid > 0) ids.push(carid);
        }
        this.deleteCarProduct(ids, 1, Lang[Lang.default].successClearInvalidProduct);
    };

    /**
     * 删除指定购物车商品
     * @param array  carIDs     购物车ID集合
     * @param number type       1：删除失效, 2：非失效
     * @param string successMsg 删除成功后的提示消息
     */
    deleteCarProduct = (carIDs, type, successMsg = null) => {
        if(typeof(carIDs) == 'object' && carIDs.length && this.userinfo) {
            let that = this;
            let obj = Object.assign({cartID: carIDs.join(',')}, this.userinfo);
            Utils.fetch(Urls.delCarProductNumber, 'post', obj, (result) => {
                if(result) {
                    console.log(result);
                    let obj = {deleteAlert : false,};
                    if(result.sMessage) {
                        obj.operateMsg = result.sMessage;
                    }
                    if(result.sTatus == 1) {
                        if(successMsg) obj.operateMsg = successMsg;
                    }
                    if(type == 1) {
                        obj.invalidList = [];
                    }else if(type == 2) {
                        obj.carDatas = null;
                        obj.isRefreshing = true;
                        that.setState(obj, ()=>{
                            that.resultMsgAnimated();
                            that.initDatas();
                        });
                        return;
                    }
                    that.setState(obj, that.resultMsgAnimated);
                }
            });
        }
    };

    /**
     * 收藏指定购物车商品
     * @param array  goodIDs  商品ID集合
     * @param string success  收藏成功后的提示消息
     */
    collectionCarProduct = (goodIDs, success = null) => {
        let token = this.getToken();
        if(typeof(goodIDs) == 'object' && goodIDs.length) {
            if(token) {
                Utils.fetch(Urls.batchCollection, 'post', {
                    paryID: goodIDs.join(','),
                    mToken: token,
                }, (result) => {
                    if(result) {
                        console.log(result);
                        if(result.sTatus == 1) {
                            //收藏成功。
                        }
                        if(result.sMessage) {
                            this.setState({
                                deleteAlert: false,
                                operateMsg: result.sMessage,
                            }, this.resultMsgAnimated);
                        }
                    }
                });
            }else {
                this.setState({deleteAlert: false,}, ()=>{
                    this.goToLogin('TabNav', {PathKey: TABKEY.Car});
                });
            }
        }
    };

    //点击结算
    goSettlement = () => {
        let ids = this.selectProducts();
        if(ids && ids.carIDs) {
            // console.log(this.cars);
            let token = this.getToken();
            if(!token) {
                this.goToLogin('AddOrder', {
                    carIDs: ids.carIDs,
                });
            }else if(token && ids.carIDs.length) {
                this.props.navigation.navigate('AddOrder', {
                    mToken: token,
                    carIDs: ids.carIDs,
                });
            }
        }
    };

    //选中商品收藏
    selectCollection = () => {
        let ids = this.selectProducts();
        let that = this;
        if(ids && ids.goodIDs) {
            this.showAlertMoudle(
                Lang[Lang.default].collectionSelectProduct,
                Lang[Lang.default].determine, 
                Lang[Lang.default].cancel,
                () => this.collectionCarProduct(ids.goodIDs),
                () => this.setState({deleteAlert: false,}),
            );
        }
    };

    //选中商品删除
    selectDelete = () => {
        let ids = this.selectProducts();
        if(ids && ids.carIDs) {
            this.showAlertMoudle(
                Lang[Lang.default].deleteSelectProduct,
                Lang[Lang.default].determine, 
                Lang[Lang.default].cancel,
                () => this.deleteCarProduct(ids.carIDs, 2),
                () => this.setState({deleteAlert: false,}),
            );
        }
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Color.lightGrey,
    },
    centerStyle: {
        height: 245,
        backgroundColor: Color.lightGrey,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerImage: {
        height: 97,
        width: 185,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    centerText: {
        fontSize: 14,
        color: Color.gainsboro2,
    },
    editCarText: {
        fontSize: 14,
        color: Color.orangeRed,
        fontWeight: 'bold',
        padding: 5,         // 增大点击面积
        paddingLeft: 10,    // 增大点击面积
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
        // paddingLeft: PX.marginLR,
        borderTopWidth: pixel,
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
        paddingRight: 10,
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
        width: 100,
        height: PX.rowHeight1,
        backgroundColor: Color.orange,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnDelete: {
        width: 100,
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
    invalidText4: {
        color: '#fff',
        fontSize: 13,
    },
    invalidGoodImg: {
        width: 90,
        height: 90,
    },
    invalidItemRight: {
        justifyContent: 'space-between',
        marginLeft: 12,
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
        paddingTop: 5,
        paddingBottom: 5,
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
        height: PX.rowHeight2,
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