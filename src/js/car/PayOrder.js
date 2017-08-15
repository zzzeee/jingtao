/**
 * 购物车 - 提交订单 - 结算
 * @auther linzeyong
 * @date   2017.05.02
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    Image,
    TouchableOpacity,
    Button,
} from 'react-native';

var WeChat=require('react-native-wechat');
import Toast from 'react-native-root-toast';
import Alipay from 'react-native-yunpeng-alipay';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import Lang, {str_replace} from '../public/language';
import { Size, pixel, Color, PX } from '../public/globalStyle';

export default class PayOrder extends Component {
    constructor(props) {
        super(props);
        
        this.mToken = null;
        this.payMoney = null;
        this.timer = [];
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.visible) {
            this.setState({visible: true});
        }
    }

    componentWillUnmount() {
        let timers = this.timer;
        for(let t of timers) {
            clearTimeout(t);
        }
    }

    hideModal = (func = null) => {
        this.setState({visible: false}, func);
    };

    render() {
        let that = this;
        let { navigation, visible, payMoney, hidePayBox, } = this.props;
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={visible}
                onRequestClose={() => {}}
            >
                <View style={styles.bodyStyle}>
                    <View style={styles.payBox}>
                        <View style={styles.rowBox1}>
                            <Text style={styles.titleText}>{Lang[Lang.default].selectPayMethod}</Text>
                            <View style={styles.cancelView}>
                                <TouchableOpacity onPress={()=>hidePayBox(this.payFailed)}>
                                <Image style={styles.iconStyle} source={require('../../images/close.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.rowBox2}>
                            <Text style={styles.defalutFont}>{Lang[Lang.default].totalPayment}</Text>
                            <Text style={styles.redColor1}>{Lang[Lang.default].RMB + payMoney}</Text>
                        </View>
                        <TouchableOpacity style={styles.rowBox3} onPress={this.ali_pay}>
                            <View style={styles.rowBox}>
                                <Image style={styles.iconStyle} source={require('../../images/car/alipay.png')} />
                                <Text style={[styles.defalutFont, {paddingLeft: 8}]}>{Lang[Lang.default].alipay}</Text>
                            </View>
                            <Image source={require('../../images/list_more.png')} style={styles.iconStyle} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rowBox3} onPress={this.get_weixin_payinfo}>
                            <View style={styles.rowBox}>
                                <Image style={styles.iconStyle} source={require('../../images/car/weixin.png')} />
                                <Text style={[styles.defalutFont, {paddingLeft: 8}]}>{Lang[Lang.default].weixinpay}</Text>
                            </View>
                            <Image source={require('../../images/list_more.png')} style={styles.iconStyle} />
                        </TouchableOpacity>
                        {/*<TouchableOpacity style={styles.rowBox3}>
                            <View style={styles.rowBox}>
                                <Image style={styles.iconStyle} source={require('../../images/car/pufa.png')} />
                                <Text style={[styles.defalutFont, {paddingLeft: 8}]}>{Lang[Lang.default].pufapay}</Text>
                            </View>
                            <View style={styles.rowBox}>
                                <Text style={[styles.redColor2, {paddingRight: 8}]}>首次支付赠送80积分</Text>
                                <Image source={require('../../images/list_more.png')} style={styles.iconStyle} />
                            </View>
                        </TouchableOpacity>*/}
                    </View>
                </View>
            </Modal>
        );
    }

    _toast = (str) => {
        let _timer = Toast.show(str, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            hideOnPress: true,
        });
        this.timer.push(_timer);
    };

    //支付成功
    paySuccess = () => {
        let { mToken, orderNumber, payMoney, navigation, } = this.props;
        navigation.navigate('OrderNotify', {
            pageType: 1,
            mToken: mToken,
            payMoney: payMoney,
            shopOrderNum: orderNumber,
        });
    };

    //支付失败
    payFailed = () => {
        let { mToken, orderNumber, navigation, } = this.props;
        if(orderNumber) {
            if(String(orderNumber).indexOf('jt') >= 0) {
                navigation.navigate('MyOrder', {mToken: mToken});
            }else {
                navigation.navigate('OrderDetail', {
                    mToken: mToken,
                    isRefresh: true,
                    shopOrderNum: orderNumber,
                });
            }
        }
    };

    //获取微信支付信息
    get_weixin_payinfo = () => {
        let { mToken, orderNumber, } = this.props;
        if(mToken && orderNumber) {
            Utils.fetch(Urls.getWeiXinPayInfo, 'post', {
                orderNum: orderNumber,
                mToken: mToken,
            }, (result)=>{
                console.log(result);
                if(result && result.sTatus == 1 && result.wxInfo) {
                    this.weixin_pay(result.wxInfo);
                }
            });
        }
    };

    //微信支付
    weixin_pay = (datas) => {
        let { mToken, orderNumber, hidePayBox, } = this.props;
        let partnerId = datas.partnerid || null;
        let prepayId = datas.prepayid || null;
        let nonceStr = datas.noncestr || null;
        let timeStamp = datas.timestamp || null;
        let sign = datas.sign || null;
        if(partnerId && prepayId && nonceStr && timeStamp && sign) {
            WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    WeChat.pay({
                        'partnerId': partnerId,
                        'prepayId': prepayId,
                        'nonceStr': nonceStr,
                        'timeStamp': timeStamp + '',
                        'package': 'Sign=WXpay',
                        'sign': sign
                    })
                    .then((result) => {
                        console.log(result);
                        if(result && result.errCode === 0) {
                            hidePayBox(this.paySuccess);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        hidePayBox(this.payFailed);
                    });
                } else {
                    hidePayBox(()=>this._toast(Lang[Lang.default].shareErrorAlert));
                }
            });
        }else {
            hidePayBox(()=>this._toast(Lang[Lang.default].paramError));
        }
    };
    
    //支付宝支付
    ali_pay = () => {
        let that = this;
        let { mToken, orderNumber, hidePayBox, isBack, } = this.props;
        let callback = isBack ? this.payFailed : null;
        if(mToken && orderNumber) {
            Utils.fetch(Urls.getAlipayInfo, 'post', {
                orderNum: orderNumber,
                mToken: mToken,
            }, (result)=>{
                if(result && result.sTatus == 1 && result.zfbInfo) {
                    let responseText = result.zfbInfo;
                    //把HTML实体转换成字符串
                    result = responseText.replace(/&lt;/g, "<");
                    result = responseText.replace(/&gt;/g, ">");
                    result = responseText.replace(/&amp;/g, "&");
                    result = responseText.replace(/&quot;/g, "\"");
                    result = responseText.replace(/&apos;/g, "'");
                    // console.log(responseText);
                    //开始支付
                    Alipay.pay(responseText).then(function(data){
                        console.log(data);
                        if(data.indexOf('"msg":"Success"') >= 0) {
                            //ANDROID 支付成功
                            hidePayBox(that.paySuccess);
                        }else if (data && data[0] && data[0].resultStatus == '9000') {
                            //IOS 返回
                            hidePayBox(that.paySuccess);
                        }else {
                            hidePayBox(callback);
                        }
                    }, (err)=> {
                        //支付失败，包括取消的
                        console.log(err);
                        hidePayBox(callback);
                    });
                }
            });
        }
    }

    //处理支付宝中时间格式中的空格
    handleAlipayTimeStamp = (str) => {
        let timestamp = str.match(/timestamp=(\S*?)&/) || null;
        if(str && timestamp && timestamp[1]) {
            let start = str.indexOf(timestamp[1]);
            let length = timestamp[1].length;
            let _str2 = timestamp[1].replace(/\+/, "%20");
            let _str1 = str.substr(0, start);
            let _str3 = str.substr(start + length);
            return _str1 + _str2 + _str3;
        }
        return str;
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    defalutFont: {
        fontSize: 14,
        color: Color.lightBack,
    },
    iconStyle: {
        width: PX.iconSize26,
        height: PX.iconSize26,
    },
    redColor1: {
        fontSize: 14,
        color: Color.red,
    },
    redColor2: {
        fontSize: 12,
        color: Color.red,
    },
    bodyStyle: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'flex-end',
    },
    payBox: {
        backgroundColor: Color.lightGrey,
        flexDirection: 'column',
    },
    titleText: {
        fontSize: 16,
        color: Color.lightBack,
    },
    rowBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowBox1: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: PX.marginTB,
        paddingLeft: PX.marginLR,
        backgroundColor: '#fff',
    },
    cancelView: {
        position: 'absolute',
        width: PX.iconSize26,
        height: PX.iconSize26,
        right: PX.marginLR,
        top: 12,
    },
    rowBox2: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: PX.marginTB,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        backgroundColor: '#fff',
    },
    rowBox3: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        backgroundColor: '#fff',
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
    },
});