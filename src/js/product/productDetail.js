/**
 * 商品详情 - 图文详情
 * @auther linzeyong
 * @date   2017.06.02
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    WebView,
} from 'react-native';

import Urls from '../public/apiUrl';
import { Size, PX, } from '../public/globalStyle';
export default class ProductDetail extends Component {
    // 默认参数
    static defaultProps = {
        productID: 0,
    };
    // 参数类型
    static propTypes = {
        productID: React.PropTypes.number.isRequired,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            webViewHeight: 0,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if((nextProps.productID && 
        nextProps.productID > 0 && 
        this.props.productID != nextProps.productID) ||
        this.state.webViewHeight != nextState.webViewHeight) {
            return true;
        }else {
            return false;
        }
    }

    render() {
        if(!this.props.productID || this.props.productID <= 0) return null;
        let webStyle = {
            width: Size.width,
            height: this.state.webViewHeight,
        };
        return (
            <View style={webStyle}>
                <WebView
                    javaScriptEnabled={true}
                    scalesPageToFit={false}
                    source={{uri: Urls.getProductDetails + this.props.productID}}
                    style={webStyle}
                    onNavigationStateChange={(info)=>{
                        // console.log(info);
                        let arr = info.title.split('*');
                        let width = parseInt(arr[0]) || 0;
                        let height = parseInt(arr[1]) || 0;
                        let _height = Size.width * height / width || 0;
                        if(_height < 999999 && _height > 0 && _height != this.state.webViewHeight) {
                            console.log('更新webview高度为：' + _height);
                            this.setState({webViewHeight: _height})
                        }
                    }}
                />
            </View>
        );
    }
}
