/**
 * 首页 - 店铺 - 搜索
 * @auther linzeyong
 * @date   2017.06.16
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Keyboard,
} from 'react-native';

import SearchData from './AsyncSearch';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import InputText from '../public/InputText';
import ProductItem from '../other/ProductItem';
import AlertMoudle from '../other/AlertMoudle';
import { EndView } from '../other/publicEment';

export default class ShopSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sdatas: null,
            log: [],
            hot: [],
            areas: [],
            searchtext: null,
            load_or_error: null,
            deleteAlert: false,
            sortIndex: 0,
            showArea: false,
            showFootView: false,
        };
        this.shopID = null;
        this.page = 1;
        this.pageNumber = 10;
        this.search_name = '';
        this.searchLock = false;
        this.loadMoreLock = false;
        this._Search = null;
    }

    componentWillMount() {
        this.initDatas();
    }

    componentDidMount() {
        this.getAsynctDates();
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { shopID } = params;
            this.shopID = shopID || null;
            this._Search = new SearchData(shopID);
        }
    };

    //初始化数据
    getAsynctDates = async () => {
        let log = await this._Search.getDatas() || [];
        this.setState({ log, });
    };

    //设置搜索内容
    setSearchtext = (value) => {
        this.setState({
            searchtext: value,
        });
    };

    //清空搜索历史
    clearSearchLog = () => {
        this._Search.delDatas().then(() => {
            this.setState({
                log: [],
                deleteAlert: false,
            });
        });
    };

    //隐藏删除提示框
    hideAlertMoudle = () => {
        this.setState({deleteAlert: false,});
    };

    //显示删除提示框
    showAlertMoudle = (said) => {
        this.alertObject = {
            text: Lang[Lang.default].deleteAllSearchLog,
            leftText: Lang[Lang.default].cancel,
            rightText: Lang[Lang.default].determine,
            leftColor: Color.lightBack,
            leftBgColor: '#fff',
            leftClick: this.hideAlertMoudle,
            rightClick: this.clearSearchLog,
            rightColor: Color.lightBack,
            rightBgColor: '#fff',
        };
        this.setState({deleteAlert: true,});
    };

    //点击搜索
    clickSearch = () => {
        let txt = this.state.searchtext || null;
        if(!this.searchLock) {
            Keyboard.dismiss();
            if(txt == this.search_name) return;
            this.page = 1;
            this.loadMoreLock = false;
            this.search_name = txt;
            this._Search.saveDatas(txt).then((result)=>{
                let log = result || [];
                this.setState({
                    log: result,
                    sdatas: [],
                    load_or_error: this.getLoadView(),
                }, this.getProductList);
            });
        }
    };

    //获取产品列表
    getProductList = () => {
        if(!this.loadMoreLock && !this.searchLock) {
            this.searchLock = true;
            this.loadMoreLock = true;
            Utils.fetch(Urls.getProductList, 'get', {
                gName: this.search_name,
                pPage: this.page,
                pPerNum: this.pageNumber,
                sID: this.shopID,
            }, (result) => {
                console.log(result);
                let _sdata = this.state.sdatas || [];
                if(result && result.sTatus == 1 && result.proAry) {
                    this.searchLock = false;
                    if(result.proAry.length == 0 && _sdata.length == 0) {
                        this.setState({
                            load_or_error: this.getNoResult(),
                        });
                    }else {
                        let list = result.proAry || [];
                        let datas = _sdata ? _sdata.concat(list) : list;
                        if(list.length < this.pageNumber) {
                            this.loadMoreLock = true;
                        }else {
                            this.page++;
                            this.loadMoreLock = false;
                        }
                        this.setState({ 
                            sdatas: datas,
                            load_or_error: null,
                        });
                    }
                }
            }, null, {
                catchFunc: (err) => {
                    console.log(err);
                    this.setState({load_or_error: this.getErrorView(),});
                },
            });
        }
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                         navigation.goBack(null);
                    }} src={require("../../images/back.png")} />)}
                    right={<Text style={styles.headRightText} onPress={this.clickSearch}>{Lang[Lang.default].search}</Text>}
                    center={
                        <View style={styles.headInputBox}>
                            <InputText
                                vText={this.state.searchtext}
                                pText={Lang[Lang.default].shopSearch}
                                onChange={this.setSearchtext}
                                length={20}
                                style={styles.inputStyle}
                                onFocus={this.linkShopSearch}
                                focus={true}
                            />
                            <Image style={styles.inputBeforeImg} source={require('../../images/search_gary.png')} />
                            {this.state.searchtext ?
                                <TouchableOpacity style={styles.inputAfterBox} onPress={()=>this.setSearchtext('')}>
                                    <Image style={styles.inputAfterImg} source={require('../../images/login/close.png')} />
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                    }
                />
                {this.pageContent()}
                {this.state.deleteAlert ?
                    <AlertMoudle visiable={this.state.deleteAlert} {...this.alertObject} />
                    : null
                }
            </View>
        );
    }

    getLoadView = () => {
        return <Text>正在加载</Text>;
    };

    getErrorView = () => {
        return <Text>加载出错</Text>;
    };

    //无结果内容
    getNoResult = () => {
        return (
            <Image style={styles.noResultImg} source={require('../../images/home/no_result.png')}>
                <Text style={styles.noResultTxt}>{Lang[Lang.default].notSearchResult}</Text>
            </Image>
        );
    };

    pageContent = () => {
        if(this.state.load_or_error) {
            return (
                <View style={styles.container2}>
                    {this.state.load_or_error}
                </View>
            );
        }else if(this.state.sdatas) {
            return this.productList();
        }else {
            return (
                <ScrollView>
                    {this.initPage()}
                </ScrollView>
            );
        }
    };

    initPage = () => {
        return (
            <View>
                {(this.state.log && this.state.log.length) ? 
                    <View style={styles.sessionBox}>
                        <View style={styles.sessionTitle}>
                            <Text style={styles.sessionText}>{Lang[Lang.default].searchLog}</Text>
                            <TouchableOpacity onPress={this.showAlertMoudle}>
                                <Image source={require('../../images/delete.png')} style={styles.clearSearchLog} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.itemBox}>
                            {this.state.log.map(this.renderLogItem)}
                        </View>
                    </View>
                    : null
                }
            </View>
        );
    };

    renderLogItem = (item, index) => {
        return (
            <TouchableOpacity key={index} onPress={()=>this.clickSearchItemText(item)}>
                <Text style={styles.searchItemText}>{item}</Text>
            </TouchableOpacity>
        );
    };

    productList = () => {
        return (
            <FlatList
                ref={(_ref)=>this.ref_flatList=_ref} 
                data={this.state.sdatas}
                keyExtractor={(item, index) => (index)}
                enableEmptySections={true}
                numColumns={2}
                renderItem={this._renderItem}
                onScroll={this._onScroll}
                ListFooterComponent={()=>{
                    if(this.state.showFootView) {
                        return <EndView />;
                    }else {
                        return <View />;
                    }
                }}
                onEndReached={()=>{
                    if(!this.loadMoreLock) {
                        console.log('正在加载更多 ..');
                        this.getProductList();
                    }
                }}
            />
        );
    };

    _onScroll = (e) => {
        let value = 20;
        let offsetY = e.nativeEvent.contentOffset.y || 0;
        if(offsetY > value && !this.state.showFootView) {
            this.setState({ showFootView: true, });
        }else if(offsetY < value && this.state.showFootView) {
            this.setState({ showFootView: false, });
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
    container2: {
        flex: 1,
        backgroundColor: Color.floralWhite,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderrorStyle: {
        fontSize: 14,
        color: Color.gray,
    },
    rowStyle: {
        flexDirection: 'row',
    },
    defaultFont: {
        fontSize: 14,
        lineHeight: 19,
        color: Color.lightBack,
    },
    headInputBox: {
        width: Size.width - 144,
    },
    inputStyle: {
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
    inputAfterBox: {
        position: 'absolute',
        top: 7,
        right: 7,
    },
    inputAfterImg: {
        width: 18,
        height: 18,
        opacity: 0.5,
    },
    headRightText: {
        color: Color.mainColor,
        fontSize: 14,
        padding: 5,
    },
    noResultImg: {
        width: 185,
        height: 97,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    noResultTxt: {
        color: Color.gainsboro2,
        fontSize: 14,
    },
    topBtnRow: {
        height: PX.rowHeight2,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Color.floralWhite,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBtnView: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnRightIcon: {
        width: 15,
        height: 15,
    },
    sessionBox: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    sessionTitle: {
        paddingTop: 30,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sessionText: {
        paddingLeft: 10,
        fontSize: 14,
        color: Color.lightBack,
    },
    clearSearchLog: {
        width: 16,
        height: 16,
        marginRight: 10,
    },
    itemBox: {
        flexDirection : 'row',
        flexWrap: 'wrap',
    },
    searchItemText: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        color: Color.gainsboro,
        fontSize: 11,
        borderColor: Color.lightGrey,
        borderWidth: 1,
        borderRadius: 3,
        margin: 10,
    },
    btnProductItem: {
        width: Size.width,
        flexDirection: 'row',
    },
    itemLeft: {
        borderWidth: 1,
        borderColor: '#fff',
    },
    goodImg: {
        width: 118,
        height: 118,
    },
    itemRight: {
        width: Size.width - 120 - 15,
        height: 120,
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: pixel,
        borderBottomColor: Color.floralWhite,
        marginLeft: 10,
    },
    itemRightBottom: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    priceText: {
        color: Color.red,
        fontSize: 16,
        marginRight: 10,
    },
    martPriceText: {
        color: Color.gainsboro,
        fontSize: 12,
        marginRight: 20,
    },
    timeLimit: {
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 2,
        color: '#fff',
        fontSize: 12,
        backgroundColor: Color.red,
        marginLeft: 10,
    },
});