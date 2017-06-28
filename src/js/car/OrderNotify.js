/**
 * 订单通知（包括付款成功, 确认收货等）
 * @auther linzeyong
 * @date   2017.06.28
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
import ListFrame from '../other/ListViewFrame';
import { NavigationActions } from 'react-navigation';
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';

export default class OrderNotify extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.mToken = null;
        this.pageType = null;
        this.shopOrderNum = null;
        this.payMoney = '';
        this.ref_flatList = null;
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
            let { mToken, shopOrderNum, pageType, payMoney, } = params;
            this.mToken = mToken || null;
            this.shopOrderNum = shopOrderNum || null;
            this.pageType = pageType || null;
            this.payMoney = payMoney || '';
        }
    };

    render() {
        let { navigation, } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead 
                    title={Lang[Lang.default].payFinish}
                    left={<BtnIcon width={PX.headIconSize} press={()=>{
                        navigation.navigate('MyOrder', {mToken: this.mToken});
                    }} src={require("../../images/back.png")} />}
                    onPress={()=>this.ref_flatList.scrollToOffset({offset: 0, animated: true})}
                />
                <View style={styles.flex}>
                    <ListFrame
                        listHead={this.listHeadView()}
                        navigation={navigation}
                        get_list_ref={(ref)=>this.ref_flatList=ref}
                    />
                </View>
            </View>
        );
    }

    gotoOrderList = () => {
        let { navigation } = this.props;
        if(this.shopOrderNum.indexOf('jt') >= 0) {
            navigation.navigate('MyOrder', {mToken: this.mToken});
        }else {
            navigation.navigate('OrderDetail', {
                mToken: this.mToken,
                isRefresh: true,
                shopOrderNum: this.shopOrderNum,
            });
        }
    };

    gotoHome = () => {
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'TabNav' }),
            ]
        });
        this.props.navigation.dispatch(resetAction);
    };

    listHeadView = () => {
        let rightImg, text1, text2, btnText1, btnText2, func1, func2;
        if(this.pageType == 1) {
            rightImg = require('../../images/car/payok_right.png');
            text1 = '成功支付 ' + Lang[Lang.default].RMB + this.payMoney;
            text2 = '您的包裹正准备出仓';
            btnText1 = '查看订单';
            btnText2 = '返回首页';
            func1 = this.gotoOrderList;
            func2 = this.gotoHome;
        }else {
            rightImg = require('../../images/car/order_dpj.png');
            text1 = '交易成功';
            text2 = '卖家将收到您的货款';
            btnText1 = '立即评价';
            btnText2 = '查看订单';
            func1 = this.gotoHome;
            func2 = this.gotoOrderList;
        }
        return (
            <View style={styles.sessionBox}>
                <View style={styles.grayBox}>
                    <Image source={require('../../images/car/payok_bg.png')} resizeMode="stretch" style={styles.topBoxC1Img}>
                        <View style={styles.topBoxC1ImgLeft}>
                            <Text style={styles.topBoxC1Text1}>{text1}</Text>
                            <Text style={styles.topBoxC1Text2}>{text2}</Text>
                        </View>
                        <Image source={rightImg} resizeMode="stretch" style={styles.topBoxC1ImgRight} />
                    </Image>
                </View>
                <View style={styles.btnRow}>
                    <Text onPress={func1} style={[styles.btnTextStyle, {marginRight: 60}]}>{btnText1}</Text>
                    <Text onPress={func2} style={styles.btnTextStyle}>{btnText2}</Text>
                </View>
            </View>
        );
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    sessionBox: {
        marginBottom: PX.marginTB,
        backgroundColor: '#fff',
    },
    grayBox: {
        backgroundColor: Color.lightGrey,
    },
    topBoxC1Img: {
        height: 120,
        flexDirection : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
    },
    topBoxC1ImgLeft: {
        maxWidth: Size.width - 20 - 20 - 115,
    },
    topBoxC1Text1: {
        fontSize: 20,
        color: '#fff',
    },
    topBoxC1Text2: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, .7)',
        paddingTop: 6,
    },
    topBoxC1ImgRight: {
        width: 115,
        height: 86,
        marginRight: 20,
    },
    btnRow: {
        height: 60,
        marginLeft: PX.marginLR,
        marginRight: PX.marginLR,
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
        flexDirection : 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnTextStyle: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 13,
        color: Color.mainColor,
        borderWidth: 1,
        borderColor: Color.mainColor,
        borderRadius: 3,
    },
});