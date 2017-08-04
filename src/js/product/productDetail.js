/**
 * 商品详情 - 图文详情
 * @auther linzeyong
 * @date   2017.06.02
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    WebView,
    ActivityIndicator,
} from 'react-native';

import PropTypes from 'prop-types';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import Lang, {str_replace} from '../public/language';
import { Size, PX, Color, } from '../public/globalStyle';

export default class ProductDetail extends Component {
    // 默认参数
    static defaultProps = {
        productID: 0,
    };
    // 参数类型
    static propTypes = {
        productID: PropTypes.number.isRequired,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            webViewHeight: 0,
        };
    }

    componentDidMount() {
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
        let webHeight = parseInt(this.state.webViewHeight) || 0;
        let webStyle = {
            width: Size.width,
            height: webHeight,
        };
        let webBoxStyle = {
            width: Size.width,
            height: webHeight + 50,
        };
        return (
            <View style={webBoxStyle}>
                {webHeight > 0 ?
                    <View style={styles.upArrowBox}>
                        <Image style={styles.upArrowImg} source={require('../../images/product/up_arrow.png')} />
                        <Text style={styles.upArrowText}>{Lang[Lang.default].upArrowTxt}</Text>
                    </View> :
                    <View style={styles.upArrowBox}>
                        <ActivityIndicator animating={true} color={Color.mainColor} size="small" />
                    </View>
                }
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
                            if(_height < 9999 && _height > 0 && _height != webHeight) {
                                console.log('更新webview高度为：' + _height);
                                this.setState({webViewHeight: _height});
                            }
                        }}
                    />
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    upArrowBox: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: Color.lightGrey,
    },
    upArrowImg: {
        width: 12,
        height: 12,
    },
    upArrowText: {
        color: Color.gainsboro2,
        fontSize: 14,
    },
});