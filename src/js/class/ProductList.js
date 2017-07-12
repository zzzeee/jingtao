/**
 * 特产分类 - 商品列表
 * @auther linzeyong
 * @date   2017.06.18
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

import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import InputText from '../public/InputText';
import Areas from '../home/searchArea';
import ProductItem from '../other/ProductItem';
import { EndView } from '../other/publicEment';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sdatas: null,
            areas: [],
            load_or_error: null,
            sortIndex: 0,
            showArea: false,
            showFootView: false,
        };
        this.cID = null;
        this.cName = null;
        this.page = 1;
        this.pageNumber = 10;
        this.sort = 1;
        this.citys = '';
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
            // 'text': Lang[Lang.default].newGood,
            'text': '同城日达',
            'isRepeat': false,
            'press': null,
        }, {
            'text': Lang[Lang.default].goodOrigin,
            'isRepeat': true,
            'press': null,
        }];
    }

    componentWillMount() {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { cId, cName } = params;
            this.cID = cId || null;
            this.cName = cName || null;
        }
    }

    componentDidMount() {
        this.initDates();
    }

    //初始化数据
    initDates = async () => {
        let areas = await this.getAearList() || null;
        if(areas && areas.sTatus == 1 && areas.regionAry) {
            areas = areas.regionAry;
        }
        this.setState({ areas, }, this.getProductList);
    };

    //获取地区列表
    getAearList = () => {
        return Utils.async_fetch(Urls.getAllAreas, 'post', {});
    };

    //隐藏地区选择框
    hideAreaMoudle = () => {
        this.setState({showArea: false});
    };

    //已选的地区数据
    selectCity = (datas) => {
        let _data = datas.join(',');
        if(this.citys != _data) {
            this.citys = _data;
            this.page = 1;
            this.isEnScroll = true;
            this.loadMoreLock = false;
            this.getProductList(true);
        }
    };

    /**
     * 获取产品列表
     * @param bool isClear 是否清空原数据
     */
    getProductList = (isClear = false) => {
        if(this.cID && this.isEnScroll && !this.loadMoreLock) {
            this.loadMoreLock = true;
            Utils.fetch(Urls.getProductList, 'get', {
                poType: this.sort,
                pProvince: this.citys,
                cID: this.cID,
                pPage: this.page,
                pPerNum: this.pageNumber,
            }, (result) => {
                // console.log(result);
                let _sdata = this.state.sdatas || [];
                if(result && result.sTatus == 1 && result.proAry) {
                    this.btnDisable = false;
                    this.loadMoreLock = false;
                    let list = result.proAry || [];
                    if(list.length == 0 && (isClear || _sdata.length == 0)) {
                        this.setState({
                            load_or_error: this.getNoResult(),
                            showArea: false,
                        });
                    }else {
                        let datas = (_sdata && !isClear) ? _sdata.concat(list) : list;
                        if(list.length < this.pageNumber) {
                            this.isEnScroll = false;
                            this.loadMoreLock = true;
                        }else {
                            this.page++;
                        }
                        this.setState({ 
                            sdatas: datas,
                            load_or_error: null,
                            showArea: false,
                        });
                    }
                }
            }, null, {
                catchFunc: (err) => {
                    console.log(err);
                    this.setState({
                        showArea: false,
                        load_or_error: this.getErrorView(),
                    });
                },
            });
        }
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    title={this.cName}
                    goBack={true}
                    navigation={navigation}
                    onPress={()=>this.ref_flatList.scrollToOffset({offset: 0, animated: true})}
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
        }
    };

    productList = () => {
        return (
            <FlatList
                ref={(_ref)=>this.ref_flatList=_ref} 
                data={this.state.sdatas}
                numColumns={2}
                onScroll={this._onScroll}
                keyExtractor={(item, index) => (index)}
                enableEmptySections={true}
                renderItem={this._renderItem}
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
    rowStyle: {
        flexDirection: 'row',
    },
    defaultFont: {
        fontSize: 14,
        lineHeight: 19,
        color: Color.lightBack,
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