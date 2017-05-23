/**
 * APP首页入口
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    ScrollView,
    WebView,
    View,
    Text,
    Animated,
    Button,
    Image,
    TouchableOpacity,
    PanResponder,
} from 'react-native';

import CityList from './CityList';
import FloatMenu from './FloatMenu';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import BtnIcon from '../public/BtnIcon';
import Lang, {str_replace} from '../public/language';
import { Size, pixel, PX, Color } from '../public/globalStyle';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            provinceID : 0,
            provinceName: null,
            updateData: true,
            visible: false,
            nativeEvent: null,
            showCityName: null,
            heightValue: new Animated.Value(0),
            datas: null,
            hideCitys: [],
            load_or_error: null,
            webView_error: false,
        };

        this.shareObj = {};
        this.showStart = false;
        this.ref_scrollview = null;
        this.webViewPanResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        });
    }

    componentDidMount() {
        this.getProvinceDatas(31);
    }

    render() {
        let _scrollview = null;
        return (
            <View style={styles.flex}>
                <View style={styles.headView}>
                    <Text style={{width: 40}}>{null}</Text>
                    <BtnIcon 
                        width={100} 
                        height={PX.headHeight - 10} 
                        imageStyle={{marginTop: 8}} 
                        src={require("../../images/logoTitle.png")} 
                    />
                    <BtnIcon 
                        style={styles.btnRight} 
                        width={PX.headIconSize} 
                        src={require("../../images/search.png")}
                    />
                </View>
                <Animated.View style={[styles.hideHead, {
                    height: this.state.heightValue,
                }]}>
                    <BtnIcon 
                        style={styles.btnLeft} 
                        width={PX.headIconSize} 
                        src={require("../../images/logo.png")} 
                        press={this.scrollStart}
                    />
                    <TouchableOpacity style={styles.titleTextBox} onPress={this.scrollStart}>
                        <Text style={styles.headTitle1}>{str_replace(Lang[Lang.default].previewing, '')}</Text>
                        <Text style={styles.headTitle2}>{this.state.provinceName + Lang[Lang.default].guan}</Text>
                        <BtnIcon width={16} src={require("../../images/sanjiao.png")} press={this.scrollStart} />
                    </TouchableOpacity>
                    <BtnIcon style={styles.btnRight} width={PX.headIconSize} src={require("../../images/search.png")} />
                </Animated.View>
                <ScrollView 
                    ref={(_ref)=>this.ref_scrollview=_ref} 
                    onScroll={this._onScroll} 
                    contentContainerStyle={styles.scrollViewBox}
                >
                    <View style={[styles.webViewSize, {marginBottom: 10}]} {...this.webViewPanResponder.panHandlers}>
                        <WebView
                            javaScriptEnabled={true}
                            scalesPageToFit={true}
                            source={{uri: Urls.homeMap}}
                            // source={require('../../newmap/index.html')}
                            style={styles.webViewSize}
                            onMessage={(e)=>this._onMessage(e)}
                            startInLoadingState ={true}
                            // onNavigationStateChange={(navState) =>console.log(navState)}
                        />
                    </View>
                    {this.state.load_or_error ?
                        this.state.load_or_error :
                        <CityList 
                            isUpdate={this.state.updateData} 
                            showFloatMenu={this.showFloatMenu} 
                            pid={this.state.provinceID} 
                            datas={this.state.datas} 
                            navigation={this.props.navigation}
                        />
                    }
                </ScrollView>
                <FloatMenu 
                    visible={this.state.visible} 
                    nativeEvent={this.state.nativeEvent} 
                    cityName={this.state.showCityName}
                    shareObj={this.shareObj}
                    btnSize={20}
                    addHideCity={this.addHideCity}
                    hideMenu={()=>this.setState({
                        visible: false,
                        nativeEvent: null,
                        showCityName: null,
                    })}
                />
            </View>
        );
    }

    _onScroll = (e) => {
        let offsetY = e.nativeEvent.contentOffset.y || 0;
        let showHeight = PX.mapHeight * 0.7;

        if(offsetY > (PX.mapHeight * 0.7)) {
            if(!this.showStart) {
                this.showStart = true;
                this.setState({
                    updateData: false,
                });
                Animated.spring(this.state.heightValue, {
                    toValue: PX.headHeight,
                    friction: 7,
                    tension: 30,
                }).start();
            }
        }else if(offsetY < (PX.mapHeight * 0.3)) {
            if(this.showStart) {
                this.showStart = false;
                this.setState({
                    updateData: false,
                });
                this.state.heightValue.setValue(0);
            }
        }
    };

    // 显示遮罩层
    showFloatMenu = (event, name, obj) => {
        this.shareObj = obj;
        if(event && name) {
            this.setState({
                visible: true,
                nativeEvent: event,
                showCityName: name,
            });
        }
    };

    scrollStart = () => {
        if(this.ref_scrollview) {
            this.ref_scrollview.scrollTo({x: 0, y: 0, animated: true});
        }
    };

    _onMessage = (e) => {
        let data = JSON.parse(e.nativeEvent.data) || {};
        let id = parseInt(data.id) || 0;
        console.log(e.nativeEvent.data);
        if(id > 0 && id != this.state.provinceID) {
            this.getProvinceDatas(id);
        }
    };

    getProvinceDatas = (id) => {
        if(id > 0) {
            let that = this;
            Utils.fetch(Urls.getCityAndProduct, 'post', {
                pID: id
            }, function(result) {
                // console.log(result);
                if(result && result.provinceAry) {
                    let ret = that.removeHideCitys(result.provinceAry);
                    let name = ret.region_name || '';
                    that.setState({
                        provinceID: id,
                        provinceName: name,
                        updateData: true,
                        datas: ret,
                        load_or_error: null,
                    });
                }
            }, (view)=>that.setState({load_or_error: view}), {
                bgStyle: {padding: 20,},
            });
        }
    };

    // 去除隐藏的城市数据
    removeHideCitys = (datas) => {
        let hides = this.state.hideCitys;
        let citys = datas.cityProduct || [];
        if(citys && citys.length && hides.length > 0) {
            let newCitysList = [];
            for(let index in citys) {
                let canAdd = true;
                for(let i in hides) {
                    if(citys[index].region_id && citys[index].region_id == hides[i]) {
                        canAdd = false;
                        break;
                    }
                }
                canAdd && newCitysList.push(citys[index]);
            }
            datas.cityProduct = newCitysList;
            // console.log(datas);
        }
        return datas;
    };

    // 添加隐藏城市的数据
    addHideCity = (id) => {
        if(id && id > 0) {
            let hides = this.state.hideCitys;
            let isHave = false;
            for(let i in hides) {
                if(hides[i] == id) isHave = true;
            }
            if(!isHave) {
                hides.push(id);
                this.setState({
                    hideCitys: hides,
                    updateData: true,
                    datas: this.removeHideCitys(this.state.datas),
                });
            }
        }
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    webViewSize: {
        width: Size.width,
        height: PX.mapHeight,
    },
    scrollViewBox: {
        paddingBottom: 10,
    },
    headShadow: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 0.5,
        shadowOffset: {"height": 0.5},
        elevation: 4,
    },
    headView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: PX.headHeight,
        borderBottomColor: Color.lavender,
        borderBottomWidth: 1,
    },
    hideHead: {
        borderBottomColor: Color.lavender,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
    titleTextBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headTitle1: {
        color: Color.gainsboro,
        fontSize: 12,
        paddingRight: 2,
    },
    headTitle2: {
        color: Color.lightBack,
        fontSize: 13,
    },
    btnLeft: {
        paddingLeft: 12,
    },
    btnRight: {
        paddingRight: 12,
    },
});