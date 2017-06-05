/**
 * 提示框组件(适用： 商品详情数量是否成功)
 * @auther linzeyong
 * @date   2017.06.04
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class ReturnAlert extends Component {
    // 默认参数
    static defaultProps = {
        isShow: false,
    };
    // 参数类型
    static propTypes = {
        message: React.PropTypes.string,
        isShow: React.PropTypes.bool,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let {error, isShow, message, hideMsg} = this.props;
        if((!error && error !== 0) || !isShow) return null;
        let img = error ? require('../../images/product/tost_fail.png') : require('../../images/product/tost_ok.png');
        return (
            <View style={styles.bodyBg}>
                <TouchableOpacity style={styles.btnBg} onPress={hideMsg}>
                    <Image source={img} style={styles.alertImg} />
                    <Text style={styles.alertText}>{message}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    bodyBg: {
        width: 240,
        height: 130,
        position: 'absolute',
        left: (Size.width - 240) / 2,
        top: (Size.height - 130) / 2,
        backgroundColor: 'rgba(0, 0, 0, .7)',
        borderRadius: 5,
    },
    btnBg: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertImg: {
        width: 100,
        height: 80,
    },
    alertText: {
        color: '#fff',
        fontSize: 16,
    },
});