/**
 * APP购物车 - 提交订单 - 选择优惠券
 * @auther linzeyong
 * @date   2017.05.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';

import PropTypes from 'prop-types';
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import { Size, PX, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

// 购物车内的商家
export default class Coupon extends Component {
    // 参数类型
    static propTypes = {
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
    }

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.flex}>
                <View>
                    <AppHead
                        title={Lang[Lang.default].select + Lang[Lang.default].coupon}
                        left={(<BtnIcon width={PX.headIconSize} press={()=>{
                            navigation.goBack(null);
                        }} src={require("../../images/back.png")} />)}
                    />
                </View>
                <View style={styles.body}>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    body: {
        flex: 1,
        backgroundColor: Color.lightGrey,
    },
});