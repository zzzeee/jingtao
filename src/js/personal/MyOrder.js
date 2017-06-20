/**
 * 个人中心 - 我的订单
 * @auther linzeyong
 * @date   2017.06.20
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
} from 'react-native';

import Lang, {str_replace} from '../public/language';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import CustomOrder from './CustomOrder';

export default class MyOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mIntegral: null,
            mUserIntegral: null,
            datas: null,
        };
        this.mToken = null;
    }

    componentWillMount() {
        this.initDatas();
    };

    componentDidMount() {
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { mToken, } = params;
            this.mToken = mToken || null;
        }
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead
                    title={Lang[Lang.default].myOrder}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                            navigation.goBack(null);
                    }} src={require("../../images/back.png")} />)}
                />
                <View style={styles.flex}>
                    {this.mToken ?
                        <CustomOrder />
                        : null
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        backgroundColor: Color.lightGrey,
    },
    topBox: {
        backgroundColor: '#fff',
        marginTop: 10,
        paddingBottom: 30,
        marginBottom: 10,
    },
});