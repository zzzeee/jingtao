/**
 * APP发现
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native';

import Swiper from 'react-native-swiper';
import User from '../public/user';
import AppHead from '../public/AppHead';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, pixel, Color, PX, errorStyles } from '../public/globalStyle';
import Lang, {str_replace, TABKEY} from '../public/language';
import ProductItem from '../other/ProductItem';
import CountDown from './CountDown';
import CouponItem from '../other/CouponItem';

var _User = new User();

export default class FindScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: null,
            endTime: null,
            fetchError: null,
            datas: null,
            coupons: [],
            dataSource: null,
            MDYP: null,
            banner: null,
            isRefreshing: true,
        };
        this.mToken = null;
        this.userCoupons = [];
        this.pageOffest = 1;
        this.pageNumber = 10;
        this.lockTime = 3000;
        this.ref_flatList = null;
        this.loadMoreLock = false;
    }

    componentDidMount() {
        this.initPage();
    }

    //初始化页面
    initPage = async () => {
        this.pageOffest = 1;
        this.pageNumber = 10;
        this.mToken = await _User.getUserID(_User.keyMember);
        let uCoupons = await this.getUserCoupons();
        let xsqg = await this.getXSQGDatas();
        let mdyp = await this.getMDYPDatas();
        // console.log(uCoupons);
        // console.log(xsqg);
        // console.log(mdyp);
        if(!xsqg && !mdyp) {
            this.setState({
                fetchError: true,
                isRefreshing: false,
            });
        }else {
            this.setUserCoupons(uCoupons);
            let _xsqg_ = this.setXSQGlist(xsqg);
            let _mdyp_ = this.setMDYPlist(mdyp);
            this.setState(Object.assign({}, _xsqg_, _mdyp_));
        }
    };

    // 获取限时抢购商品
    getXSQGDatas = () => {
        return Utils.async_fetch(Urls.getPanicBuyingProductList, 'post', null);
    };

    // 获取名店列表
    getMDYPDatas = () => {
        return Utils.async_fetch(Urls.getFindShopList, 'post', {
            sPage: this.pageOffest,
            sPerNum: this.pageNumber,
        });
    };

    //获取用户已领取过的优惠券
    getUserCoupons = () => {
        if(this.mToken) {
            return Utils.async_fetch(Urls.getUserCoupons, 'post', {
                mToken: this.mToken,
            });
        }else {
            return null;
        }
    };
    
    //检查时间是否带有时分秒
    checkTimeString = (t) => {
        if(t) {
            let str = t.replace(/-/g, "/") || '';
            if(str && str.length <= 10 && str.indexOf(':') < 0) {
                str = str + ' 00:00:00';
            }
            return str
        }
        return t;
    };

    //设置限时抢购列表
    setXSQGlist = (datas) => {
        let obj = {};
        if(datas && datas.sTatus) {
            let xsqg = datas.proAry || {};
            let banner = datas.pufaAry || {};
            let start = xsqg.pbStartTime || null;
            let end = xsqg.pbEndTime || null;
            let proList = xsqg.activityAry || [];
            let coupons = datas.couponAry || [];
            let bannerImg = banner.pufaImg ? {uri: banner.pufaImg} : require('../../images/empty.png');
            start = this.checkTimeString(start);
            end = this.checkTimeString(end);
            obj = {
                fetchError: false,
                isRefreshing: false,
                startTime: new Date(start).getTime(),
                endTime: new Date(end).getTime(),
                datas: xsqg,
                coupons: coupons,
                banner: (banner.pufaAble && banner.pufaAble == 1) ? bannerImg : null,
                dataSource: proList,
            };
        }
        return obj;
    };

    //设置名店优品列表
    setMDYPlist = (datas) => {
        let obj = {};
        if(datas && datas.sTatus && datas.shopAry) {
            let mdyp = datas.shopAry || [];
            if(mdyp.length > 0) {
                this.pageOffest++;
                obj = {
                    fetchError: false,
                    isRefreshing: false,
                    MDYP: mdyp,
                };
            }
        }
        return obj;
    };

    //把用户领取过的优惠券ID放入数组
    setUserCoupons = (datas) => {
        if(datas && datas.sTatus) {
            if(datas.sTatus == 4) {
                this.mToken = null;
                _User.delUserID(_User.keyMember);
            }else if(datas.sTatus == 1 && datas.couponAry) {
                let that = this;
                let coupons = datas.couponAry || [];
                for(let i in coupons) {
                    let id = coupons[i].hId || 0;
                    let stime = coupons[i].hStartTime || null;
                    let etime = coupons[i].hSendTime || null;
                    let ntime = new Date().getTime();
                    // let isable = coupons[i].isable || 0;
                    let _stime = new Date(that.checkTimeString(stime)).getTime();
                    let _etime = new Date(that.checkTimeString(etime)).getTime();
                    if(id > 0 && ntime > _stime && ntime < _etime) {
                        that.userCoupons.push(id);
                    }
                }
            }
        }
    };

    // 加载更多
    loadMore = () => {
        if(!this.loadMoreLock) {
            let that = this;
            this.loadMoreLock = true;
            Utils.fetch(Urls.getFindShopList, 'POST', {
                sPage: this.pageOffest,
                sPerNum: this.pageNumber,
            }, (result) => {
                if(result && result.sTatus && result.shopAry.length) {
                    let MDYP = that.state.MDYP.concat(result.shopAry);
                    console.log(MDYP);
                    that.pageOffest++;
                    that.setState({ MDYP }, ()=>{
                        that.loadMoreLock = false;
                    });
                }
            });
        }
    };

    // 限时抢购的头部
    getPanicBuying = () => {
        return (
            <View style={styles.panicBuyingHead}>
                <Image source={require('../../images/find/xsqg.png')} resizeMode="stretch" style={styles.xsqgImgStyle} />
                <View style={styles.countDownBox}>
                {this.beOverdue() ?
                    <CountDown startTime={this.state.startTime} endTime={this.state.endTime} />
                    : null
                }
                </View>
            </View>
        );
    };

    // 判断活动是否在有效期内
    beOverdue = () => {
        let timer = new Date().getTime();
        if(!this.state.startTime || !this.state.endTime || timer > this.state.endTime || timer < this.state.startTime) {
            return false;
        }else {
            return true;
        }
    };

    // 优惠券
    couponView = () => {
        if(this.state.coupons.length > 0) {
            let that = this;
            return (
                <Image source={require('../../images/find/coupon_bg.png')} resizeMode="stretch" style={styles.couponBox}>
                    <Swiper
                        width={Size.width * 0.8}
                        height={160}
                        style={styles.wrapper} 
                        horizontal={true}
                        showsPagination={true}
                        paginationStyle={styles.paginationStyle}
                        dot={(<View 
                            style={{
                                backgroundColor:'rgba(255, 255, 255, .3)',
                                width: 8,
                                height: 8,
                                borderRadius: 2,
                                margin: 5,
                            }}
                        />)}
                        activeDot={(<View 
                            style={{
                                backgroundColor:'rgba(255, 255, 255, .8)',
                                width: 8,
                                height: 8,
                                borderRadius: 2,
                                margin: 5,
                            }}
                        />)}
                        autoplay={true}
                        showsButtons={false}>
                        {this.state.coupons.map(function(item, index) {
                            return (
                                <CouponItem 
                                    key={index} 
                                    width={Size.width * 0.8} 
                                    type={1} 
                                    coupon={item} 
                                    navigation={that.props.navigation}
                                    back={'TabNav'}
                                    backObj={{PathKey: TABKEY.find, }}
                                    userid={that.mToken}
                                    userCoupons={that.userCoupons}
                                />
                            );
                        })}
                    </Swiper>
                </Image>
            );
        }
        return null;
    };

    // 名店优品之上的上方部分
    topPage = () => {
        let { fetchError, dataSource, banner, } = this.state;
        if(fetchError === null) {
             return null;
        }else if(fetchError) {
            return (
                <View style={[errorStyles.bodyView, {
                    height: Size.height - PX.headHeight - PX.tabHeight,
                }]}>
                    <Text style={errorStyles.refaceBtn} onPress={this.initPage}>{Lang[Lang.default].reconnect}</Text>
                    <Text style={errorStyles.errRemind}>{Lang[Lang.default].fetchError}</Text>
                </View>
            );
        }else {
            return (
                <View>
                    {(dataSource && dataSource.length) ?
                         <View style={styles.panicBuyingBox}>
                            {this.getPanicBuying()}
                            <FlatList
                                horizontal={true}
                                contentContainerStyle={styles.listViewStyle}
                                keyExtractor={(item, index) => ('xsqg_' + index)}
                                enableEmptySections={true}
                                data={dataSource}
                                renderItem={this.xsqg_renderItem}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                        : null
                    }
                    {banner ?
                        <TouchableOpacity style={styles.bannerImgBox} onPress={()=>{
                            this.props.navigation.navigate('Banner');
                        }}>
                            <Image source={banner} style={styles.bannerImgStyle} />
                        </TouchableOpacity>
                        : null
                    }
                    {this.couponView()}
                    <View style={[styles.mdypImgBox, {marginTop: PX.marginTB}]}>
                        <Image source={require('../../images/find/mdyp.png')} resizeMode="stretch" style={styles.mdypImgStyle} />
                    </View>
                </View>
            );
        }
    };

    render() {
        let { MDYP, isRefreshing, } = this.state;
        // if(!MDYP) return null;
        return (
            <View style={styles.flex}>
                <View>
                    <AppHead
                        title={Lang[Lang.default].tab_find}
                        onPress={()=>{
                            this.ref_flatList && this.ref_flatList.scrollToOffset({offset: 0, animated: true});
                        }}
                    />
                </View>
                <View style={styles.bodyStyle}>
                    <FlatList
                        ref={(_ref)=>this.ref_flatList=_ref} 
                        removeClippedSubviews={false}
                        data={MDYP}
                        keyExtractor={(item, index) => ('mdyp_' + index)}
                        renderItem={this.mdyp_renderItem}
                        ListHeaderComponent={this.topPage}
                        onEndReached={()=>{
                            if(!this.loadMoreLock) {
                                console.log('正在加载更多 ..');
                                this.loadMore();
                            }else {
                                console.log('加载更多已被锁住。');
                            }
                        }}
                        // onEndReachedThreshold={20}
                        getItemLayout={(data, index)=>({length: PX.shopItemHeight, offset: PX.shopItemHeight * index, index})}
                        refreshing={isRefreshing}
                        onRefresh={()=>{
                            this.setState({isRefreshing: true});
                            this.initPage();
                        }}
                    />
                </View>
            </View>
        );
    }

    // 限时抢购列表的行内容
    xsqg_renderItem = ({ item }) => {
        return (
            <View>
                <ProductItem 
                    product={item}
                    panicBuying={true}
                    width={160}
                    showDiscount={true}
                    navigation={this.props.navigation}
                    boxStyle={{
                        marginRight: 10,
                        marginBottom: 5,
                    }}
                />
                {this.beOverdue() ?
                    null : 
                    <View style={styles.productAboveImgBox}>
                        <Image 
                            source={require('../../images/find/activity_expired.png')} 
                            resizeMode="stretch" 
                            style={styles.productAboveImg} 
                        />
                    </View>
                }
            </View>
        );
    };

    // 名店优品的头部
    mdyp_renderHead = () => {
        return (
            <View style={styles.mdypImgBox}>
                <Image source={require('../../images/find/mdyp.png')} resizeMode="stretch" style={styles.mdypImgStyle} />
            </View>
        );
    };

    // 名店优品列表的行内容
    mdyp_renderItem = ({item, index}) => {
        let navigation = this.props.navigation || null;
        let sid = item.sId || null;
        let name = item.sShopName || null;
        let plist = item.proAry || [];
        let img = item.sLogo || '';
        if(name && plist.length > 0) {
            let p1 = null, p2 = null, p3 = null;
            let gid1 = 0, gid2 = 0, gid3 = 0;
            if(plist[0]) {
                let _img = plist[0].gThumbPic || null;
                gid1 = plist[0].gID || 0;
                p1 = <Image source={{uri: _img}} style={styles.shopProductBig} />;
            }
            if(plist[1]) {
                let _img = plist[1].gThumbPic || null;
                gid2 = plist[1].gID || 0;
                p2 = <Image source={{uri: _img}} style={styles.shopProductSmall} />;
            }
            if(plist[2]) {
                let _img = plist[2].gThumbPic || null;
                gid3 = plist[2].gID || 0;
                p3 = <Image source={{uri: _img}} style={styles.shopProductSmall} />;
            }

            return (
                <View style={styles.shopItemBox}>
                    <View style={styles.shopItemHead}>
                        <View style={styles.shopLogoName}>
                            <Image source={require('../../images/car/shophead.png')} style={styles.shopLogo} />
                            <Text style={styles.defalutFont}>{name}</Text>
                        </View>
                        <View style={styles.gotoShopView}>
                            <Text style={styles.btnGoToShop} onPress={()=>{
                                navigation.navigate('Shop', {shopID: sid,})
                            }}>{Lang[Lang.default].gotoShop}</Text>
                        </View>
                    </View>
                    <View style={styles.shopProductBox}>
                        <TouchableOpacity onPress={()=>{
                            if(navigation && gid1 && gid1 > 0) {
                                navigation.navigate('Product', {gid: gid1});
                            }
                        }}>
                            {p1}
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity onPress={()=>{
                                if(navigation && gid2 && gid2 > 0) {
                                    navigation.navigate('Product', {gid: gid2});
                                }
                            }} style={{marginBottom: 5}}>
                                {p2}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{
                                if(navigation && gid3 && gid3 > 0) {
                                    navigation.navigate('Product', {gid: gid3});
                                }
                            }}>
                                {p3}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }else {
            return null;
        }
    };
}

var bigImageHeight = ((Size.width - (PX.marginLR * 2)) / 290) * 190;
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.lightGrey,
    },
    flex: {
        flex: 1,
    },
    bodyStyle: {
        flex: 1,
        backgroundColor: Color.lightGrey,
    },
    defalutFont: {
        fontSize: 14,
        color: Color.lightBack,
    },
    btnRight: {
        paddingRight: 12,
    },
    panicBuyingBox: {
        height: 340,
        marginTop: PX.marginTB,
        backgroundColor: '#fff',
        paddingTop: 18,
    },
    panicBuyingHead: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    xsqgImgStyle: {
        width: 69,
        height: 20,
    },
    countDownBox: {
        height: 20,
        marginTop: 8,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listViewStyle: {
        paddingLeft: PX.marginLR,
        paddingRight: 5,
    },
    ProductItemBox: {
        marginRight: 10,
    },
    productAboveImgBox: {
        position: 'absolute', 
        left: 0, 
        top: 0,
        bottom: 5,
        right: 10,
    },
    productAboveImg: {
        position: 'absolute', 
        left: 0, 
        top: 0, 
        right: 0, 
        bottom: 0,
    },
    couponBox: {
        width: Size.width,
        height: 200,
        marginTop: PX.marginTB,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    wrapper: {
    },
    paginationStyle: {
        position: 'absolute',
        left: 0,
        right: 0, 
        bottom: 0,
        height: 40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 10,
    },
    mdypImgBox: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: Color.lavender,
        borderBottomWidth: pixel,
        backgroundColor: '#fff',
    },
    bannerImgBox: {
        marginTop: PX.marginTB,
    },
    bannerImgStyle: {
        width: Size.width,
        height: Size.width * 0.45,
    },
    mdypImgStyle: {
        height: 31,
        width: 93,
    },
    shopItemBox: {
        height: PX.shopItemHeight,
        backgroundColor: '#fff',
        // marginTop: PX.marginTB,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
    },
    shopItemHead: {
        height: 64,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shopLogoName: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shopLogo: {
        width: PX.iconSize26,
        height: PX.iconSize26,
        marginRight: 5,
    },
    gotoShopView: {
        height: 64,
        justifyContent: 'center',
    },
    btnGoToShop: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 6,
        paddingBottom: 5,
        borderWidth: 0.6,
        borderColor: Color.lightGrey,
        backgroundColor: '#fefefe',
        borderRadius: 3,
        fontSize: 12,
        color: Color.gainsboro,
    },
    shopProductBox: {
        flexDirection: 'row',
    },
    shopProductBig: {
        width: bigImageHeight,
        height: bigImageHeight,
        marginRight: 5,
        borderWidth: pixel,
        borderColor: Color.lavender,
    },
    shopProductSmall: {
        width: Size.width - 35 - bigImageHeight,
        height: bigImageHeight / 2 - 3,
        borderWidth: pixel,
        borderColor: Color.lavender,
    },
});