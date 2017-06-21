/**
 * 个人中心 - 我的优惠券
 * @auther linzeyong
 * @date   2017.06.12
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Animated,
} from 'react-native';

import User from '../public/user';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import CouponItem from '../other/CouponItem';
import InputText from '../public/InputText';
import Recommend from './Recommend';
import ShopCoupon from './ShopCoupon';
import ProductItem from '../other/ProductItem';
import { EndView } from '../other/publicEment';

var _User = new User();

export default class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopInfo: null,
            isCollection: false,
            mCoupon: null,
            proRecom: null,
            showFloat: false,
        };
        this.shopID = null;
        this.mToken = null;
        this.uCouponsIDs = [];
        this.page = 1;
        this.pageNumber = 10;
        this.loadMoreLock = false;
    }

    componentWillMount() {
        this.initDatas();
    }

    componentDidMount() {
        this.getShopInfo();
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { shopID } = params;
            this.shopID = shopID || null;
        }
    };

    getShopInfo = async () => {
        this.mToken = await _User.getUserID(_User.keyMember);
        let that = this;
        if(this.shopID) {
            let obj = {};
            let shop = await Utils.async_fetch(Urls.getShopInfo, 'post', {
                mToken: this.mToken,
                sID: this.shopID,
            });
            let products = await Utils.async_fetch(Urls.getProductList, 'get', {
                sID: this.shopID,
            });
            if(products && products.sTatus == 1 && products.proAry) {
                obj.productList = products.proAry || [];
                if(obj.productList.length < this.pageNumber) {
                    this.loadMoreLock = true;
                }
            }
            if(shop && shop.shopAry && shop.sTatus == 1) {
                obj.shopInfo = shop.shopAry
                obj.isCollection = shop.shopAry.fStatus == 1 ? true : false;
                obj.mCoupon = shop.shopAry.mCoupon || [];
                obj.proRecom = shop.shopAry.proRecom || [];
            }
            this.setState(obj);
        }
    };

    loadMore = () => {

    };

    render() {
        let { navigation } = this.props;
        return (
            <View>
                <FlatList
                    ref={(_ref)=>this.ref_flatList=_ref} 
                    removeClippedSubviews={false}
                    contentContainerStyle={styles.flatListStyle}
                    numColumns={2}
                    data={this.state.productList}
                    keyExtractor={(item, index)=>index}
                    renderItem={this._renderItem}
                    onScroll={this._onScroll}
                    ListHeaderComponent={this.listHeadPage}
                    ListFooterComponent={()=>{
                        if(this.state.showFloat) {
                            return <EndView />;
                        }else {
                            return <View />;
                        }
                    }}
                    onEndReached={()=>{
                        !this.loadMoreLock && this.loadMore();
                    }}
                />
                {this.state.showFloat ?
                    <View style={styles.inputRow2}>
                        <TouchableOpacity onPress={()=>{
                            this.props.navigation.goBack(null);
                        }}>
                            <Image source={require('../../images/back.png')} style={styles.backImage} />
                        </TouchableOpacity>
                        <View style={styles.flex}>
                            <InputText
                                vText={this.state.searchtext}
                                pText={Lang[Lang.default].shopSearch}
                                onChange={this.setSearchtext}
                                length={20}
                                style={styles.inputStyle2}
                            />
                            <Image style={styles.inputBeforeImg} source={require('../../images/search_gary.png')} />
                        </View>
                    </View>
                    : null
                }
            </View>
        );
    }

    _onScroll = (e) => {
        let offsetY = e.nativeEvent.contentOffset.y || 0;
        if(offsetY > (150 - PX.rowHeight2)) {
            if(!this.state.showFloat) {
                this.setState({
                    showFloat: true,
                });
            }
        }else {
            if(this.state.showFloat) {
                this.setState({
                    showFloat: false,
                });
            }
        }
    };

    listHeadPage = () => {
        if(!this.state.shopInfo) return null;
        let { navigation } = this.props;
        let { proRecom, mCoupon } = this.state;
        return (
            <View>
                {this.topSession()}
                <Recommend 
                    style={{marginBottom: PX.marginTB}} 
                    navigation={navigation} 
                    recommends={proRecom}
                />
                <View>
                    <ShopCoupon
                        navigation={navigation}
                        coupons={mCoupon}
                        mToken={this.mToken}
                        shopID={this.shopID}
                    />
                </View>
                <View style={styles.goodlistTop}>
                    <View style={styles.goodTopLine}></View>
                    <View>
                        <Text style={styles.goodlistTopText}>
                            商品<Text style={{fontSize: 19, color: Color.mainColor}}>推</Text>荐
                        </Text>
                    </View>
                    <View style={styles.goodTopLine}></View>
                </View>
            </View>
        );
    };

    topSession = () => {
        let { shopInfo, isCollection, } = this.state;
        let sid = shopInfo.sId || 0;
        let sLogo = shopInfo.sLogo || null;
        let logo = sLogo ? {uri: sLogo} : require('../../images/empty.png');
        let sName = shopInfo.sShopName || null;
        let sArea = shopInfo.sAttribution || null;
        return (
            <Image style={styles.areaImgBg} source={{uri: 'http://oh0xc3p8t.bkt.clouddn.com/region/id_53/2017/01/11/5875be8cea38a.png'}}>
                <View style={styles.areaImgBgOver}>
                    <View style={styles.inputRow}>
                        <TouchableOpacity onPress={()=>{
                            this.props.navigation.goBack(null);
                        }}>
                            <Image source={require('../../images/back_white.png')} style={styles.backImage} />
                        </TouchableOpacity>
                        <View style={styles.flex}>
                            <InputText
                                vText={this.state.searchtext}
                                pText={Lang[Lang.default].shopSearch}
                                onChange={this.setSearchtext}
                                length={20}
                                style={styles.inputStyle}
                            />
                            <Image style={styles.inputBeforeImg} source={require('../../images/home/search_white.png')} />
                        </View>
                    </View>
                    <View style={styles.headNameBox}>
                        <View style={styles.headBox}>
                            <Image source={logo} style={styles.logoStyle} />
                        </View>
                        <View style={styles.nameBox}>
                            <Text numberOfLines={1} style={styles.shopName}>{sName}</Text>
                            <Text numberOfLines={1} style={styles.shopArea}>{sArea}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={this.collectionShop} style={[styles.btnCollectionBox, {
                                backgroundColor: isCollection ? 'transparent' : '#fff',
                            }]}>
                                {isCollection ?
                                    <Image source={require('../../images/favorite_white.png')} style={styles.collectionIcon} /> :
                                    <Image source={require('../../images/favorite_gary.png')}  style={styles.collectionIcon} />
                                }
                                <Text style={{
                                    fontSize: 11,
                                    color: isCollection ? '#fff' : Color.gainsboro2,
                                }}>{isCollection ? Lang[Lang.default].collection : Lang[Lang.default].notCollection}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Image>
        );
    };

    //收藏
    collectionShop = () => {
        if(this.shopID) {
            if(this.mToken) {
                Utils.fetch(Urls.collection, 'post', {
                    mToken: this.mToken,
                    fType: 2,
                    flID: this.shopID,
                }, (result) => {
                    if(result) {
                        this.setState({
                            isCollection: result.sTatus == 1 ? true : false,
                        });
                    }
                });
            }else {
                this.props.navigation.navigate('Login', {
                    back: 'Shop',
                    backObj: {shopID: this.shopID},
                });
            }
        }
    };

    _renderItem = ({item, index}) => {
        return (
            <ProductItem 
                product={item} 
                key={index}
                showDiscount={true}
                width={(Size.width - 5) / 2}
                navigation={this.props.navigation}
                boxStyle={{
                    marginRight: 5,
                    marginBottom: 5,
                }}
            />
        );
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flatListStyle: {
        backgroundColor: Color.lightGrey,
    },
    areaImgBg: {
        width: Size.width,
        height: 150,
    },
    areaImgBgOver: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, .45)',
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        paddingTop: 20,
    },
    inputRow: {
        height: PX.rowHeight2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputRow2: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: PX.rowHeight2,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
    },
    backImage: {
        width: PX.iconSize26,
        height: PX.iconSize26,
        marginRight: PX.marginLR,
    },
    inputStyle: {
        height: 32,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        color: 'rgba(255, 255, 255, .8)',
        fontSize: 13,
        padding: 0,
        paddingLeft: 32,
        borderRadius: 0,
        backgroundColor: 'transparent',
    },
    inputStyle2: {
        height: 32,
        borderWidth: 0,
        borderBottomWidth: pixel,
        borderBottomColor: Color.lightBack,
        color: 'rgba(0, 0, 0, 1)',
        fontSize: 13,
        padding: 0,
        paddingLeft: 32,
        borderRadius: 0,
        backgroundColor: 'transparent',
    },
    inputBeforeImg: {
        width: 18,
        height: 18,
        position: 'absolute',
        top: 7,
        left: 7,
        opacity: 0.5,
    },
    headNameBox: {
        height: 86,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: 13,
    },
    logoStyle: {
        height: 60,
        width: 60,
    },
    nameBox: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    shopName: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 5,
    },
    shopArea: {
        fontSize: 12,
        color: '#FFF',
    },
    btnCollectionBox: {
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: 70,
        height: 27,
    },
    collectionIcon: {
        width: 14,
        height: 14,
        marginRight: 5,
    },
    goodlistTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: PX.rowHeight2,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        backgroundColor: '#fff',
    },
    goodTopLine: {
        flex: 1,
        borderBottomWidth: pixel,
        borderBottomColor: Color.mainColor,
    },
    goodlistTopText: {
        fontSize: 16,
        color: Color.lightBack,
        paddingLeft: 25,
        paddingRight: 25,
    },
});