/**
 * 分享选项菜单
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
} from 'react-native';

var WeChat=require('react-native-wechat');
// import {pay} from 'react-native-alipay';
import Toast from 'react-native-root-toast';
import Alipay from 'react-native-yunpeng-alipay'
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import { Size, pixel, Color, PX } from '../public/globalStyle';

export default class PayOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible || false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.visible) {
            this.setState({visible: true});
        }
    }

    hideModal = () => {
        this.setState({visible: false});
    };

    render() {
        let that = this;
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => {}}
            >
                <View style={styles.bodyStyle}>
                    <View style={styles.payBox}>
                        <View style={styles.rowBox1}>
                            <Text style={styles.titleText}>{Lang.cn.selectPayMethod}</Text>
                            <View style={styles.cancelView}>
                                <TouchableOpacity onPress={this.hideModal}>
                                <Image style={styles.iconStyle} source={require('../../images/close.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.rowBox2}>
                            <Text style={styles.defalutFont}>{Lang.cn.totalPayment}</Text>
                            <Text style={styles.redColor1}>{Lang.cn.RMB + '120.00'}</Text>
                        </View>
                        <TouchableOpacity style={styles.rowBox3} onPress={this.ali_pay}>
                            <View style={styles.rowBox}>
                                <Image style={styles.iconStyle} source={require('../../images/car/alipay.png')} />
                                <Text style={[styles.defalutFont, {paddingLeft: 8}]}>{Lang.cn.alipay}</Text>
                            </View>
                            <Image source={require('../../images/list_more.png')} style={styles.iconStyle} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rowBox3} onPress={this.get_weixin_payinfo}>
                            <View style={styles.rowBox}>
                                <Image style={styles.iconStyle} source={require('../../images/car/weixin.png')} />
                                <Text style={[styles.defalutFont, {paddingLeft: 8}]}>{Lang.cn.weixinpay}</Text>
                            </View>
                            <Image source={require('../../images/list_more.png')} style={styles.iconStyle} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rowBox3}>
                            <View style={styles.rowBox}>
                                <Image style={styles.iconStyle} source={require('../../images/car/pufa.png')} />
                                <Text style={[styles.defalutFont, {paddingLeft: 8}]}>{Lang.cn.pufapay}</Text>
                            </View>
                            <Image source={require('../../images/list_more.png')} style={styles.iconStyle} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    _toast = (str) => {
        Toast.show(str, {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            hideOnPress: true,
        });
    };

    //获取微信支付信息
    get_weixin_payinfo = () => {
        let that = this;
        this.hideModal();
        Utils.fetch('http://api.ub33.cn/api/PayTest/getWeiXinPayInfo', 'post', {}, function(result){
            // console.log('weixin_payinfo :');
            // console.log(JSON.parse(result));
            that.weixin_pay(JSON.parse(result));
        });
    };

    //微信支付
    weixin_pay = (datas) => {
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
                            this._toast('支付成功');
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        if(error === -2) {
                            this._toast('取消支付');
                        }else {
                            this._toast('支付失败');
                        }
                    });
                } else {
                    this._toast(Lang.cn.shareErrorAlert);
                }
            });
        }else {
            this._toast('参数不正确');
        }
    };
    
    //支付宝支付
    ali_pay = async () => {
        let order = {
            app_id: '2016122004454914',
            method: 'alipay.trade.app.pay',
            charset: 'utf-8',
            sign_type: 'RSA',
            sign: privateKey,
            timestamp: Utils.getFormatDate(null, 1),
            version: '1.0',
            notify_url: 'http://jingtaomart.com',
            biz_content: {
                'body': '测试_body内容',
                'subject': '测试_subject内容',
                'out_trade_no': new Date().getTime(),
                'total_amount': 0.1,
                'timeout_express': '30m'
            },
        };

        let order_str2 = 'alipay_sdk=alipay-sdk-php-20161101&amp;app_id=2016122004454914&amp;biz_content=%7B%22body%22%3A%22%E6%88%91%E6%98%AF%E6%B5%8B%E8%AF%95%E6%95%B0%E6%8D%AE%22%2C%22subject%22%3A+%22App%E6%94%AF%E4%BB%98%E6%B5%8B%E8%AF%95%22%2C%22out_trade_no%22%3A+%2220170125test01%22%2C%22timeout_express%22%3A+%2230m%22%2C%22total_amount%22%3A+%220.01%22%2C%22product_code%22%3A%22QUICK_MSECURITY_PAY%22%7D&amp;charset=UTF-8&amp;format=json&amp;method=alipay.trade.app.pay&amp;notify_url=http%3A%2F%2Fapi.ub33.cn%2Fapi%2FPayTest%2Fali_respond&amp;sign_type=RSA&amp;timestamp=2017-05-14+21%3A15%3A40&amp;version=1.0&amp;sign=CmbNuY0EnIMlNqZp%2B0cE%2F55U%2B%2Bxai8zL8Gpb4769AqVivnaS7meoYXyG1dsxooXfwi1yIxD9uttqRVtuJsR%2BWOz1nUS4oFYrRU7sWMSrPjjKjSU0W0zsreMYL3Qq9D55IjVAKiQ%2FEdRDYCsPhEiZ34178QRLxQEy33WXlOJrC3w%3D';

        console.log(order_str2);
        Alipay.pay(order_str2).then(function(data){
            console.log('alipay success');
            console.log(data);
        }, function (err) {
            console.log('alipay fliad');
            console.log(err);
        });
    }
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