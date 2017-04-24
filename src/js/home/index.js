/**
 * APP首页入口
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    WebView,
    View,
    Text,
    Animated,
    Button,
    Image,
    TouchableOpacity,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Urls from '../public/apiUrl';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import { Size, pixel, PX, Color } from '../public/globalStyle';
import CityList from './CityList';

var mapWidth = Size.width;
var mapHeight = Size.width - 15;

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            provinceID : 0,
            provinceName: null,
            updateData: true,
            heightValue: new Animated.Value(0),
            datas: null,
        };

        this.showStart = false;
        this.ref_scrollview = null;
    }

    componentDidMount() {
        this.getDatas(31, 'componentDidMount调用');
    }

    render() {
        let _scrollview = null;
        return (
            <View style={styles.flex}>
                {/*
                <View style={styles.headView}>
                    <Text style={{width: 40}}>{null}</Text>
                    <BtnIcon width={100} height={PX.headHeight - 10} imageStyle={{marginTop: 10}} src={require("../../images/logoTitle.png")} />
                    <BtnIcon style={styles.btnRight} width={22} src={require("../../images/search.png")} />
                </View>
                <Animated.View style={[styles.hideHead, {
                    height: this.state.heightValue,
                }]}>
                    <BtnIcon 
                        style={styles.btnLeft} 
                        width={23} 
                        src={require("../../images/logo.png")} 
                        press={()=>{this.scrollStart(_scrollview)}}
                    />
                    <TouchableOpacity style={styles.titleTextBox} onPress={()=>{this.scrollStart(_scrollview)}}>
                        <Text style={styles.headTitle1}>{str_replace(Lang['cn']['previewing'], '')}</Text>
                        <Text style={styles.headTitle2}>{this.state.provinceName + Lang['cn']['guan']}</Text>
                        <BtnIcon width={16} src={require("../../images/sanjiao.png")} press={()=>{this.scrollStart(_scrollview)}} />
                    </TouchableOpacity>
                    <BtnIcon style={styles.btnRight} width={22} src={require("../../images/search.png")} />
                </Animated.View>
                 */}
                <ScrollView ref={(_ref)=>this.ref_scrollview=_ref} onScroll={this._onScroll} style={styles.scrollViewBox}>
                    <View style={styles.webViewSize}>
                        <WebView
                            javaScriptEnabled={true}
                            scalesPageToFit={true}
                            source={{uri: Urls.homeMap}}
                            // source={{uri: 'http://vpn.jingtaomart.com/chinamap/index.html'}}
                            style={styles.webViewSize}
                            onMessage={(e)=>this._onMessage(e)}
                            startInLoadingState ={true}
                            onNavigationStateChange={(navState) =>console.log(navState)}
                        />
                    </View>
                    <CityList isUpdate={this.state.updateData} pid={this.state.provinceID} datas={this.state.datas} />
                </ScrollView>
            </View>
        );
    }

    _onScroll = (e) => {
        let offsetY = e.nativeEvent.contentOffset.y || 0;
        let showHeight = mapHeight * 0.7;
        let { setParams } = this.props.navigation;

        if(offsetY > (mapHeight * 0.7)) {
            if(!this.showStart) {
                this.showStart = true;
                this.setState({
                    updateData: false,
                });
                // Animated.spring(this.state.heightValue, {
                //     toValue: (PX.headHeight - 1),
                //     friction: 7,
                //     tension: 30,
                // }).start();
                if(setParams) {
                    setParams({
                        name: this.state.provinceName,
                        showName: true,
                        gotoStart: this.scrollStart,
                    });
                }
            }
        }else if(offsetY < (mapHeight * 0.3)) {
            if(this.showStart) {
                this.showStart = false;
                this.setState({
                    updateData: false,
                });
                // this.state.heightValue.setValue(0);
                if(setParams) {
                    setParams({
                        showName: false,
                    });
                }
            }
        }
    };

    scrollStart = () => {
        if(this.ref_scrollview) {
            this.ref_scrollview.scrollTo({x: 0, y: 0, animated: true});
        }
    };

    _onMessage = (e) => {
        let data = JSON.parse(e.nativeEvent.data) || {};
        let id = data.id || 0;
        console.log(e.nativeEvent.data);
        if(id > 0 && id != this.state.provinceID) {
            this.getDatas(id, 'onMessage调用');
        }
    };

    // 注意这个方法前面有async关键字
    getDatas = (id, txt) => {
        try {
            // console.group('获取省份数据');
            // console.time('测试时间');
            // console.log(txt);
            // console.log('开始时间：' + new Date());
            fetch(Urls.getCityAndProduct, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'pID=' + id
            })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson);
                // console.log('结束时间：' + new Date());
                // console.timeEnd('测试时间');
                // console.groupEnd('获取省份数据');
                if(responseJson && responseJson.provinceAry) {
                    let name = responseJson.provinceAry.region_name || '';
                    this.setState({
                        provinceID: id,
                        provinceName: name,
                        updateData: true,
                        datas: responseJson.provinceAry,
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
        } catch(error) {
            console.error(error);
        }
    }
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    scrollViewBox : {
        backgroundColor: '#ccc',
    },
    webViewSize: {
        width: mapWidth,
        height: mapHeight,
    },
    headView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: PX.headHeight,
        borderBottomWidth: pixel,
        borderBottomColor: '#ccc',
        shadowColor: "#000",
        shadowOpacity: 0.6,
        shadowRadius: 0.5,
        shadowOffset: {"height": 0.5},
    },
    hideHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 999,
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
        paddingLeft: 10,
    },
    btnRight: {
        paddingRight: 10,
    },
});