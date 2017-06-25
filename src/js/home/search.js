/**
 * 首页 - 搜索页
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

import SearchData from '../public/search';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import InputText from '../public/InputText';
import AlertMoudle from '../other/AlertMoudle';
import Areas from './searchArea';
import { EndView } from '../other/publicEment';

var _Search = new SearchData();

export default class Search extends Component {
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
        this.page = 1;
        this.pageNumber = 10;
        this.sort = 1;
        this.citys = [];
        this.search_name = '';
        this.searchLock = false;
        this.btnDisable = false;
        this.isEnScroll = true;
        this.loadMoreLock = false;
        this.btnSortList = [{
            'text': Lang[Lang.default].comprehensive,
            'isRepeat': false,
            'press': null,
        }, {
            'text': Lang[Lang.default].price,
            'isRepeat': true,
            'press': null,
        }, {
            'text': Lang[Lang.default].newGood,
            'isRepeat': false,
            'press': null,
        }, {
            'text': Lang[Lang.default].goodOrigin,
            'isRepeat': true,
            'press': null,
        }];
    }

    componentDidMount() {
        this.initDates();
    }

    //初始化数据
    initDates = async () => {
        let log = await _Search.getDatas() || [];
        let hot = await this.getHotWord() || [];
        let areas = await this.getAearList() || null;
        if(areas && areas.sTatus == 1 && areas.regionAry) {
            areas = areas.regionAry;
        }
        this.setState({ log, hot, areas, });
    };

    //获取热门搜索关键字
    getHotWord = () => {
        return ['豆腐干', '臭豆腐', '东北野人参'];
    };

    //获取地区列表
    getAearList = () => {
        return Utils.async_fetch(Urls.getAllAreas, 'post', {});
    };

    //设置搜索内容
    setSearchtext = (value) => {
        this.setState({
            searchtext: value,
        });
    };

    //清空搜索历史
    clearSearchLog = () => {
        _Search.delDatas().then(() => {
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

    //隐藏地区选择框
    hideAreaMoudle = () => {
        this.setState({showArea: false});
    };

    //已选的地区数据
    selectCity = (datas) => {
        this.citys = datas;
    };

    //点击搜索
    clickSearch = () => {
        let txt = this.state.searchtext || null;
        if(!this.searchLock) {
            Keyboard.dismiss();
            if(txt) {
                // if(txt == this.search_name) return;
                this.page = 1;
                this.isEnScroll = true;
                this.btnDisable = false;
                this.loadMoreLock = false;
                this.search_name = txt;
                _Search.saveDatas(txt).then((result)=>{
                    let log = result || [];
                    this.setState({
                        log: result,
                        sdatas: [],
                        load_or_error: this.getLoadView(),
                    }, this.getProductList);
                });
            }
        }
    };

    //获取产品列表
    getProductList = () => {
        if(this.isEnScroll && !this.loadMoreLock && !this.searchLock) {
            let obj = {
                poType: this.sort,
                pProvince: this.citys.join(','),
                gName: this.search_name,
                pPage: this.page,
                pPerNum: this.pageNumber,
            };
            // console.log(obj);
            // console.log(Urls.getProductList);
            this.searchLock = true;
            this.loadMoreLock = true;
            Utils.fetch(Urls.getProductList, 'get', obj, (result) => {
                console.log(result);
                let _sdata = this.state.sdatas || [];
                if(result && result.sTatus == 1 && result.proAry) {
                    this.btnDisable = false;
                    this.searchLock = false;
                    this.loadMoreLock = false;
                    if(result.proAry.length == 0 && _sdata.length == 0) {
                        this.setState({
                            load_or_error: this.getNoResult(),
                        });
                    }else {
                        let list = result.proAry || [];
                        let datas = _sdata ? _sdata.concat(list) : list;
                        if(list.length < this.pageNumber) {
                            this.isEnScroll = false;
                            this.loadMoreLock = true;
                        }else {
                            this.page++;
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
    
    //点击搜索历史、热门搜索
    clickSearchItemText = (str) => {
        this.sort = 1;
        this.page = 1;
        this.search_name = str;
        this.isEnScroll = true;
        this.btnDisable = false;
        this.loadMoreLock = false;
        this.setState({
            sdatas: [],
            sortIndex: 0,
            searchtext: str,
            load_or_error: this.getLoadView(),
        }, this.getProductList);
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    style={{backgroundColor: Color.mainColor, }}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                         navigation.goBack(null);
                    }} src={require("../../images/back_white.png")} />)}
                    right={<Text style={styles.headRightText} onPress={this.clickSearch}>{Lang[Lang.default].search}</Text>}
                    center={
                        <View style={styles.headInputBox}>
                            <InputText
                                vText={this.state.searchtext}
                                pText={Lang[Lang.default].inputSearchProductName}
                                onChange={this.setSearchtext}
                                length={20}
                                style={styles.inputStyle}
                            />
                            <Image style={styles.inputBeforeImg} source={require('../../images/home/search_white.png')} />
                            {this.state.searchtext ?
                                <TouchableOpacity style={styles.inputAfterBox} onPress={()=>this.setSearchtext('')}>
                                    <Image style={styles.inputAfterImg} source={require('../../images/home/close_white.png')} />
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                    }
                />
                {this.state.sdatas ? this.listHead() : null}
                {this.pageContent()}
                <Areas
                    visiable={this.state.showArea}
                    areas={this.state.areas}
                    hideAreaBox={this.hideAreaMoudle}
                    setSelectArea={this.selectCity}
                />
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
        let log = (this.state.log && this.state.log.length) ? 
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
            : null;
        let hot = (this.state.hot && this.state.hot.length) ? 
            <View style={styles.sessionBox}>
                <View style={styles.sessionTitle}>
                    <Text style={styles.sessionText}>{Lang[Lang.default].hotSearch}</Text>
                </View>
                <View style={styles.itemBox}>
                    {this.state.hot.map(this.renderHotItem)}
                </View>
            </View>
            : null;
        return (
            <View>
                {log}
                {hot}
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

    renderHotItem = (item, index) => {
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

    listHead = () => {
        return (
            <View style={styles.topBtnRow}>
                {this.btnSortList.map(this.rendSortItem)}
            </View>
        );
    };

    rendSortItem = (item, index) => {
        let color = this.state.sortIndex == index ? Color.mainColor : Color.lightBack;
        let icon = (this.state.sortIndex == index && this.sort != (index + 1)) ?
            require('../../images/more_up.png') : 
            require('../../images/more_down.png');
        return (
            <TouchableOpacity disabled={this.btnDisable} key={index} onPress={()=>{
                if(index == 3) {
                    this.searchLock = false;
                    this.setState({
                        sortIndex: index,
                        showArea: true,
                    });
                }else if(item.isRepeat || this.state.sortIndex != index) {
                    this.page = 1;
                    this.btnDisable = true;
                    this.isEnScroll = true;
                    this.loadMoreLock = false;
                    if(item.isRepeat) {
                        if(this.state.sortIndex == index) {
                            if(this.sort == 2) {
                                this.sort = 5;
                            }else if(this.sort == 5) {
                                this.sort = 2;
                            }
                        }else {
                            this.sort = index + 1;
                        }
                    }else {
                        this.sort = index + 1;
                    }
                    this.setState({
                        sortIndex: index,
                        sdatas: [],
                    }, this.getProductList);
                }
            }} style={styles.flex}>
                <View style={styles.topBtnView}>
                    <Text style={[styles.defaultFont, {color: color}]}>{item.text}</Text>
                    {(item.isRepeat && index != 3) ?
                        <Image source={icon} style={styles.btnRightIcon} />
                        : null
                    }
                </View>
            </TouchableOpacity>
        )
    };

    _renderItem = ({item, index}) => {
        let { navigation } = this.props;
        let gid = item.gID || 0;
        let name = item.gName || null;
        let price = item.gDiscountPrice || null;
        let martPrice = item.gPrices || null;
        let headImg = item.gThumBPic || null;
        let isActivity = item.aStatus == 1 ? true : false;
        headImg = headImg ? {uri: headImg} : require('../../images/empty.png');
        return (
            <TouchableOpacity style={styles.btnProductItem} onPress={()=>{
                if(navigation && gid > 0) {
                    navigation.navigate('Product', {gid: gid,});
                }
            }}>
                <View style={styles.itemLeft}>
                    <Image style={styles.goodImg} source={headImg} />
                </View>
                <View style={styles.itemRight}>
                    <View>
                        <Text style={styles.defaultFont} numberOfLines={2}>{name}</Text>
                    </View>
                    <View style={styles.itemRightBottom}>
                        <Text style={styles.priceText}>{Lang[Lang.default].RMB + ' ' + price}</Text>
                        <Text style={styles.martPriceText}>{martPrice}</Text>
                        {isActivity ?
                            <Text style={styles.timeLimit}>{Lang[Lang.default].timeLimit}</Text>
                            : null
                        }
                    </View>
                </View>
            </TouchableOpacity>
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
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        color: 'rgba(255, 255, 255, .5)',
        fontSize: 13,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 32,
        paddingRight: 32,
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
        color: '#fff',
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