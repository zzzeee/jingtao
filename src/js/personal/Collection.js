/**
 * 个人中心 - 我的收藏
 * @auther linzeyong
 * @date   2017.06.17
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Animated,
    ScrollView,
} from 'react-native';

import Util from '../public/utils';
import Urls from '../public/apiUrl';
import Lang, {str_replace} from '../public/language';
import { Size, pixel, PX, Color, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import SwiperBtn from '../other/SwiperBtn';
import AlertMoudle from '../other/AlertMoudle';

export default class Collection extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            provinceID: null,
            cityName: null,
            datas: null,
            datas2: null,
            dataNum: null,
            data2Num: null,
            totalNum: null,
            dataSource: [],
            deletes: [],
            deletes2: [],
            leftValue: new Animated.Value(0),
            load_or_error: null,
            visiable: false,
            deleteAlert: false,
        };
        this.page = 1;
        this.number = 10;
        this.page2 = 1;
        this.number2 = 10;
        this.index = 0;
        this.loadMoreLock = false;
        this.lastOffsetY = 0;
        this.mToken = null;
        this.alertObject = {};
        this.btns = [{
            'text': Lang[Lang.default].delete,
            'backgroundColor': Color.mainColor,
            'press': this.showAlertMoudle,
        }];
    }

    componentWillMount() {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { mToken, } = params;
            this.mToken = mToken || null;
        }
    }

    componentDidMount() {
        this.playAnimated();
        this.getCollectionList();
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    //播放动画
    playAnimated = () => {
        if(this.index !== null) {
            let val = this.state.leftValue._value;
            val = !!val;
            if(val != !!this.index) {
                Animated.timing(this.state.leftValue, {
                    toValue: val ? 0 : (Size.width / 2),
                    duration: 150,
                }).start();
            }
        }
    };

    //隐藏删除提示框
    hideAlertMoudle = () => {
        this.setState({deleteAlert: false,});
    };

    //显示删除提示框
    showAlertMoudle = (obj) => {
        this.alertObject = {
            text: Lang[Lang.default].deleteProduct,
            leftText: Lang[Lang.default].cancel,
            rightText: Lang[Lang.default].determine,
            leftColor: Color.lightBack,
            leftBgColor: '#fff',
            leftClick: this.hideAlertMoudle,
            rightClick: ()=>this.clearCollection(obj),
            rightColor: Color.lightBack,
            rightBgColor: '#fff',
        };
        this.setState({deleteAlert: true,});
    };

    //获取收藏列表
    getCollectionList = () => {
        let totalNum = this.state.totalNum || 0;
        if(totalNum && this.index == 0 && ((this.page - 1) * this.number) >= totalNum) {
            console.log('无更多商品可以加载。');
            return;
        }else if(totalNum && this.index == 1 && ((this.page2 - 1) * this.number2) >= totalNum) {
            console.log('无更多店铺可以加载。');
            return;
        }else if(this.mToken && !this.loadMoreLock) {
            let that = this;
            this.loadMoreLock = true;
            Util.fetch(Urls.getCollection, 'post', {
                fType: this.index ? 2 : 1,
                mToken: this.mToken,
                fPage: this.index ? this.page2 : this.page,
                fPerNum: this.index ? this.number2 : this.number,
            }, function(result) {
                console.log(result);
                let obj = {
                    load_or_error: null,
                    btnDisable: false,
                };
                if(result && result.sTatus && result.fAry) {
                    let ret = result.fAry || [];
                    let num = parseInt(result.fCount) || 0;
                    that.loadMoreLock = false;
                    obj.totalNum = num;
                    if(that.index == 0) {
                        that.page++;
                        let _datas = that.state.datas ? that.state.datas.concat(ret) : ret;
                        obj.dataSource = _datas;
                        obj.datas = _datas;
                        obj.dataNum = num;
                    }else if(that.index == 1) {
                        that.page2++;
                        let _datas = that.state.datas2 ? that.state.datas2.concat(ret) : ret;
                        obj.dataSource = _datas;
                        obj.datas2 = _datas;
                        obj.data2Num = num;
                    }
                }
                that.setState(obj);
            }, function(view) {
                that.setState({load_or_error: view});
            }, {
                hideLoad: true,
                catchFunc: (err)=>console.log(err),
            });
        }
    };

    //切换列表
    changeList = (_index) => {
        if(_index == 0 || _index == 1) {
            //重置部分属性
            this.index = _index;
            this.playAnimated();
            this.loadMoreLock = false;
            //更换列表数据
            let _datas = this.index ? this.state.datas2 : this.state.datas;
            let _total = this.index ? this.state.data2Num : this.state.dataNum;
            if(_datas && _total) {
                this.setState({
                    totalNum: _total,
                    dataSource: _datas,
                });
            }else {
                this.getCollectionList();
            }
        }
    };

    //取消关注
    clearCollection = ({_id, _key, _index, callback}) => {
        if(this.mToken && _id) {
            Util.fetch(Urls.collection, 'post', {
                mToken: this.mToken,
                flID: _id,
                fType: this.index ? 2 : 1,
            }, (result) => {
                if(result && result.sTatus == 2) {
                    let list = this.state.dataSource || [];
                    if(list.length > 1) {
                        for(let i in list) {
                            if(list[i] && list[i][_key] == _id) {
                                list.splice(i, 1);
                                break;
                            }
                        }
                    }else {
                        list = null;
                    }
                    callback();
                    if(this.index) {
                        this.setState({
                            datas2: list,
                            dataSource: list,
                            deleteAlert: false,
                        });
                    }else {
                        this.setState({
                            datas: list,
                            dataSource: list,
                            deleteAlert: false,
                        });
                    }
                }
            });
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <AppHead
                        title={Lang[Lang.default].myCollection}
                        left={<BtnIcon width={PX.headIconSize} press={()=>{
                                this.props.navigation.goBack(null);
                        }} src={require("../../images/back.png")} />}
                    />
                </View>
                <View style={styles.flex}>
                    <View style={styles.topBtnBox}>
                        <View style={styles.btnTopLineBox}>
                            <Animated.View style={[styles.btnTopLine, {
                                left: this.state.leftValue,
                            }]}>
                            </Animated.View>
                        </View>
                        <View style={styles.topBtnRow}>
                            <TouchableOpacity onPress={()=>{
                                this.changeList(0);
                            }} style={styles.flex}>
                                <View style={[styles.topBtnView, {
                                    borderRightWidth: 1,
                                    borderRightColor: Color.lavender,
                                }]}>
                                    <Text style={styles.defaultFont}>{Lang[Lang.default].product}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{
                                this.changeList(1);
                            }} style={styles.flex}>
                                <View style={styles.topBtnView}>
                                    <Text style={styles.defaultFont}>{Lang[Lang.default].shop}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.state.load_or_error ?
                        this.state.load_or_error : 
                        <FlatList
                            ref={(_ref)=>this.ref_flatList=_ref} 
                            data={this.state.dataSource}
                            keyExtractor={(item, index) => (index)}
                            enableEmptySections={true}
                            renderItem={this._renderItem}
                            onEndReached={this.getCollectionList}
                            contentContainerStyle={styles.flatListStyle}
                        />
                    }
                </View>
                {this.state.deleteAlert ?
                    <AlertMoudle visiable={this.state.deleteAlert} {...this.alertObject} />
                    : null
                }
            </View>
        );
    }

    _renderItem = ({item, index}) => {
        let { navigation } = this.props;
        let gid = item.gID || 0;
        let sid = item.sId || 0;
        let gName = item.gName || null;
        let sName = item.sShopName || null;
        let gImg = item.gThumbPic || null;
        let sImg = item.sLogo || null;
        let gPrice = item.gDiscountPrice || '';
        let name = gName ? gName : (sName || '');
        let img = gImg ? {uri: gImg} : (sImg ? {uri: sImg} : require('../../images/empty.png'));
        return (
            <SwiperBtn key={index} 
                style={styles.itemBoxStyle} 
                btns={this.btns} 
                btnParam={{
                    _id: gid || sid,
                    _index: index,
                    _key: gid ? 'gID' : 'sId',
                }}
                itemHeight={122}
            >
                <TouchableOpacity activeOpacity={1} onPress={()=>{
                    if(gid > 0 && navigation) {
                        //跳转到商品
                        navigation.navigate('Product', {gid: gid});
                    }else if(sid > 0 && navigation) {
                        //跳转到商家
                    }
                }} style={styles.itemStyle}>
                    <View style={styles.itemLeftStyle}>
                        <Image style={styles.collectionImg} source={img} />
                    </View>
                    <View style={styles.itemRightStyle}>
                        <View style={styles.itemRightTop}>
                            <Text style={styles.defaultFont} numberOfLines={2}>{name}</Text>
                        </View>
                        <View style={styles.itemRightBottom}>
                            {gPrice ?
                                <Text style={styles.fontStyle1}>
                                    {Lang[Lang.default].RMB + ' ' + gPrice}
                                </Text>
                                : null
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </SwiperBtn>
        );
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    container: {
        flex : 1,
        backgroundColor: Color.lightGrey,
    },
    centerStyle: {
        flex: 1,
        alignItems: 'center',
    },
    defaultFont: {
        color: Color.lightBack,
        fontSize: 14,
        lineHeight: 19,
    },
    fontStyle1: {
        fontSize: 16,
        color: Color.lightBack,
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flatListStyle: {
        paddingTop: PX.marginTB,
    },
    btnTopLineBox: {
        width: Size.width,
        height: 3,
        backgroundColor: Color.floralWhite,
    },
    btnTopLine: {
        width: Size.width / 2,
        height: 3,
        backgroundColor: Color.mainColor,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    topBtnRow: {
        height: PX.rowHeight2,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
        backgroundColor: '#f8f8f8',
    },
    topBtnView: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemBoxStyle: {
        marginBottom: PX.marginTB,
    },
    itemStyle: {
        width: Size.width,
        backgroundColor: '#fff',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 15,
        paddingRight: 20,
        flexDirection: 'row',
    },
    itemLeftStyle: {
        marginRight: 12,
    },
    collectionImg: {
        width: 90,
        height: 90,
    },
    itemRightStyle: {
        flex: 1,
        justifyContent: 'space-between',
    },
    itemRightBottom: {
        alignItems: 'flex-end',
    },
});