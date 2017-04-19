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
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Urls from '../public/apiUrl';
import Lang from '../public/language';
import BtnIcon from '../public/BtnIcon';
import { Size, pixel } from '../public/globalStyle';
import CityList from './CityList';

var mapWidth = Size.width;
var mapHeight = Size.height * 0.5;
var headHeight = 56;

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            provinceID : 35,
            heightValue: new Animated.Value(0),
        };

        this.showStart = false;
        this.updateData = true;
    }

    render() {
        return (
            <View style={styles.flex}>
                <View style={styles.headView}>
                    <Text style={{width: 40}}>{null}</Text>
                    <BtnIcon width={100} height={headHeight} src={require("../../images/logoTitle.png")} />
                    <BtnIcon style={styles.btnRight} width={22} src={require("../../images/search.png")} />
                </View>
                <Animated.View style={[styles.hideHead, {
                    height: this.state.heightValue,
                }]}>
                    <BtnIcon style={styles.btnLeft} width={22} src={require("../../images/logo.png")} />
                    <Text style={styles.headTitle}>{Lang['cn']['previewing']}</Text>
                    <BtnIcon style={styles.btnRight} width={22} src={require("../../images/search.png")} />
                </Animated.View>
                <ScrollView onScroll={this._onScroll} style={styles.scrollViewBox}>
                    <View style={styles.webViewSize}>
                        <WebView
                            javaScriptEnabled={true}
                            scalesPageToFit={true}
                            source={{uri: Urls.homeMap}}
                            style={styles.webViewSize}
                            onMessage={this._onMessage}
                            startInLoadingState ={true}
                        />
                    </View>
                    <CityList isUpdate={this.updateData} pid={this.state.provinceID} />
                </ScrollView>
            </View>
        );
    }

    _onScroll = (e) => {
        let offsetY = e.nativeEvent.contentOffset.y || 0;
        let showHeight = mapHeight * 0.7;
        if(offsetY > (mapHeight * 0.7)) {
            if(!this.showStart) {
                this.showStart = true;
                this.updateData = true;
                Animated.spring(this.state.heightValue, {
                    toValue: (headHeight - 1),
                    friction: 5,
                    tension: 30,
                }).start();
            }
        }else if(offsetY < (mapHeight * 0.3)) {
            if(this.showStart) {
                this.showStart = false;
                this.updateData = true;
                this.state.heightValue.setValue(0);
            }
        }
    }

    _onMessage = (e) => {
        let id = parseInt(e.nativeEvent.data) || 0;
        if(id > 0) {
            this.setState({
                provinceID: id,
            });
        }
    };
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
        height: headHeight,
        borderBottomWidth: pixel,
        borderBottomColor: '#ccc',
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
    headTitle: {
        color: '#ccc',
    },
    btnLeft: {
        paddingLeft: 10,
    },
    btnRight: {
        paddingRight: 10,
    },
});