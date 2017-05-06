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
    ListView,
    FlatList,
} from 'react-native';

import Swiper from 'react-native-swiper';
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, pixel, Color, PX, errorStyles } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import ProductItem from '../other/ProductItem';
import CountDown from "./CountDown";

export default class FindScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: null,
            endTime: null,
            fetchError: null,
            datas: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            MDYP: null,
        };

        this.pageOffest = 1;
        this.pageNumber = 10;
        this.ref_flatList = null;
    }

    componentDidMount() {
        this.initPage();
    }

    //初始化页面
    initPage = async () => {
        let ret1 = await this.getXSQGDatas();
        let ret2 = await this.getMDYPDatas();
        // console.log(ret1);
        // console.log(ret2);
        if(!ret1 && !ret2) {
            this.setState({fetchError: true});
        }else {
            if(ret1 && ret1.sTatus && ret1.proAry) {
                let xsqg = ret1.proAry || {};
                let start = xsqg.pbStartTime || null;
                let end = xsqg.pbEndTime || null;
                let proList = xsqg.activityAry || [];

                this.setState({
                    fetchError: false,
                    startTime: new Date(start).getTime(),
                    endTime: new Date(end).getTime(),
                    datas: xsqg,
                    dataSource: this.state.dataSource.cloneWithRows(proList),
                });
            }

            if(ret2 && ret2.sTatus && ret2.shopAry) {
                let mdyp = ret2.shopAry || [];
                if(mdyp.length > 0) {
                    this.pageOffest++;
                    this.setState({
                        fetchError: false,
                        MDYP: mdyp,
                    });
                }
            }
        }
    };

    // 加载更多
    loadMore = async () => {
        let ret2 = await this.getMDYPDatas();
        if(ret2 && ret2.sTatus && ret2.shopAry.length) {
            let MDYP = this.state.MDYP.concat(ret2.shopAry);
            this.pageOffest++;
            this.setState({ MDYP });
        }
    };

    // 获取限时抢购商品
    getXSQGDatas = () => {
        return this.async_fetch(Urls.getPanicBuyingProductList, null);
    };

    // 获取名店列表
    getMDYPDatas = () => {
        let json = 'sPage=' + this.pageOffest + '&sPerNum' + this.pageNumber;
        return this.async_fetch(Urls.getFindShopList, json);
    };

    // fetch有返回数据型
    async_fetch = (url, json) => {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: json,
        })
        .then((response) => response.json())
        .then((responseText) => {
            return responseText;
        })
        .catch((error) => {
            return null;
        });
    };

    // 限时抢购的头部
    getPanicBuying = () => {
        let timer = new Date().getTime();
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

    // 名店优品之上的上方部分
    topPage = () => {
        if(this.state.fetchError === null) {
             return null;
        }else if(this.state.fetchError) {
            return (
                <View style={errorStyles.bodyView}>
                    <Text style={errorStyles.refaceBtn} onPress={this.initPage}>{Lang.cn.reconnect}</Text>
                    <Text style={errorStyles.errRemind}>{Lang.cn.fetchError}</Text>
                </View>
            );
        }else {
            return (
                <View>
                    <View style={styles.panicBuyingBox}>
                        {this.getPanicBuying()}
                        <ListView
                            horizontal={true}
                            contentContainerStyle={styles.listViewStyle}
                            enableEmptySections={true}
                            dataSource={this.state.dataSource}
                            renderRow={this.xsqg_renderItem}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    <View style={styles.couponBox}>
                        <Swiper 
                            height={200}
                            style={styles.wrapper} 
                            horizontal={true}
                            showsPagination={true}
                            autoplay={true}
                            autoplayTimeout={2}
                            showsButtons={false}>
                            <View style={styles.slideView}>
                                <Text style={styles.slideText}>优惠券 1</Text>
                            </View>
                            <View style={styles.slideView}>
                                <Text style={styles.slideText}>优惠券 2</Text>
                            </View>
                            <View style={styles.slideView}>
                                <Text style={styles.slideText}>优惠券 3</Text>
                            </View>
                        </Swiper>
                    </View>
                    <View style={styles.mdypImgBox}>
                        <Image source={require('../../images/find/mdyp.png')} resizeMode="stretch" style={styles.mdypImgStyle} />
                    </View>
                </View>
            );
        }
    };

    render() {
        return (
            <View style={styles.flex}>
                <View>
                    <AppHead
                        title={Lang.cn.tab_find}
                        center={<BtnIcon 
                            width={100} 
                            height={PX.headHeight - 10}
                            src={require("../../images/logoTitle.png")}
                            press={()=>this.ref_flatList.scrollToOffset({x: 0, y: 0, animated: true})}
                        />}
                        right={<BtnIcon style={styles.btnRight} width={PX.headIconSize} src={require("../../images/search.png")} />}
                    />
                </View>
                <View style={styles.flex}>
                    <FlatList
                        ref={(_ref)=>this.ref_flatList=_ref} 
                        removeClippedSubviews={false}
                        data={this.state.MDYP}
                        keyExtractor={(item, index) => (index + '_' + item.sId)}
                        renderItem={this.mdyp_renderItem}
                        ListHeaderComponent={this.topPage}
                        onEndReached={this.loadMore}
                        getItemLayout={(data, index)=>({length: PX.shopItemHeight, offset: PX.shopItemHeight * index, index})}
                    />
                </View>
            </View>
        );
    }

    // 限时抢购列表的行内容
    xsqg_renderItem = (obj, sectionID, rowID) => {
        return (
            <View style={styles.ProductItemBox}>
                <ProductItem 
                    product={obj} 
                    _key={rowID} 
                    panicBuying={true}
                    width={160} 
                    showDiscount={true} 
                />
                {this.beOverdue() ?
                    null : 
                    <View style={[styles.productAboveImg]}>
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
    mdyp_renderItem = ({item}) => {
        let name = item.sName || null;
        let plist = item.proAry || [];
        let img = item.sLogo || '';

        if(name && plist.length > 0) {
            let p1 = null, p2 = null, p3 = null;
            if(plist[0] && plist[0].gThumbPic) {
                p1 = (
                    <Image source={{uri: plist[0].gThumbPic}} style={styles.flex} />
                );
            }
            if(plist[1] && plist[1].gThumbPic) {
                p2 = (
                    <Image source={{uri: plist[1].gThumbPic}} style={styles.flex} />
                );
            }
            if(plist[2] && plist[2].gThumbPic) {
                p3 = (
                    <Image source={{uri: plist[2].gThumbPic}} style={styles.flex} />
                );
            }

            return (
                <View style={styles.shopItemBox}>
                    <View style={styles.shopItemHead}>
                        <View style={styles.shopLogoName}>
                            {img ?
                                <Image source={{uri: img}} resizeMode="center" style={styles.shopLogo} />
                                : null
                            }
                            <Text style={styles.defalutFont}>{name}</Text>
                        </View>
                        <View style={styles.gotoShopView}>
                            <Text style={styles.btnGoToShop}>{Lang.cn.gotoShop}</Text>
                        </View>
                    </View>
                    <View style={styles.shopProductBox}>
                        <View style={styles.shopProductBig}>
                            {p1}
                        </View>
                        <View>
                            <View style={[styles.shopProductSmall, {marginBottom: 5}]}>
                                {p2}
                            </View>
                            <View style={styles.shopProductSmall}>
                                {p3}
                            </View>
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
    productAboveImg: {
        position: 'absolute', 
        left: 0, 
        top: 0, 
        right: 0, 
        bottom: 0,
    },
    couponBox: {
        height: 200,
        marginTop: PX.marginTB,
        backgroundColor: '#fff',
        marginBottom: PX.marginTB,
    },
    slideView: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#684',
    },
    slideText: {
        color: '#fff',
    },
    mdypImgBox: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: Color.lavender,
        borderBottomWidth: pixel,
        backgroundColor: '#fff',
    },
    mdypImgStyle: {
        height: 31,
        width: 93,
    },
    shopItemBox: {
        height: PX.shopItemHeight,
        backgroundColor: '#fff',
        marginBottom: PX.marginTB,
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
        paddingTop: 8,
        paddingBottom: 8,
        borderWidth: pixel,
        borderColor: Color.gray,
        backgroundColor: Color.floralWhite,
        borderRadius: 2,
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
    },
    shopProductSmall: {
        width: Size.width - 35 - bigImageHeight,
        height: bigImageHeight / 2 - 3,
    },
});