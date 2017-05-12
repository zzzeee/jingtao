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
                                <Image style={styles.cancelImage} source={require('../../images/close.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.rowBox2}>
                            <Text style={styles.defalutFont}>{Lang.cn.totalPayment}</Text>
                            <Text style={styles.redColor1}>{Lang.cn.RMB + '120.00'}</Text>
                        </View>
                        <View style={styles.rowBox3}>
                            <BtnIcon 
                                src={require('../../images/car/alipay.png')} 
                                width={PX.iconSize26}
                                text={Lang.cn.alipay} 
                                press={this.ali_pay}
                                txtStyle={[styles.defalutFont, {paddingLeft: 8}]}
                            />
                            <Image source={require('../../images/list_more.png')} style={styles.iconStyle} />
                        </View>
                        <View style={styles.rowBox3}>
                            <BtnIcon 
                                src={require('../../images/car/weixin.png')} 
                                width={PX.iconSize26}
                                text={Lang.cn.weixinpay} 
                                press={this.weixin_pay}
                                txtStyle={[styles.defalutFont, {paddingLeft: 8}]}
                            />
                            <Image source={require('../../images/list_more.png')} style={styles.iconStyle} />
                        </View>
                        <View style={styles.rowBox3}>
                            <BtnIcon 
                                src={require('../../images/car/pufa.png')} 
                                width={PX.iconSize26}
                                text={Lang.cn.pufapay} 
                                txtStyle={[styles.defalutFont, {paddingLeft: 8}]}
                            />
                            <View style={styles.rowBox}>
                                <Text style={styles.redColor2}>{Lang.cn.pufapay_send}</Text>
                                <Image source={require('../../images/list_more.png')} style={styles.iconStyle} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    weixin_pay = async () => {
        // Utils.fetch('http://vpn.jingtaomart.com/api/WeixinController/weixinpay', 'post', {}, function(result){
        //     console.log('result :');
        //     console.log(result);
        //     let pay_data = {};
        //     pay_data.partnerId = result.partnerId;
        //     pay_data.prepayId = result.prepay_id;
        //     pay_data.nonceStr = result.nonceStr;
        //     pay_data.timeStamp = result.timeStamp;
        //     pay_data.package = "Sign=WXpay";
        //     pay_data.sign = result.paySign;

        //     console.log('start  pay ............');
        //     console.log(pay_data);
        //     WeChat.pay(pay_data)
        //     .catch((error) => {
        //         console.log(error);
        //     });
        //     console.log('end pay ...............');
        // });

        let datas = {
            'partnerId': '1381423402',
            'prepayId': 'wx20170512204338c7a054c0d70657394947',
            'nonceStr': 'Mz27NuDixlQJ5cmd',
            'timeStamp': '1494593052',
            'package': 'Sign=WXPay',
            'sign': '394B72EA2CAA2602FD6CDB29BF492A6B'
        };

        WeChat.isWXAppInstalled()
        .then((isInstalled) => {
            if (isInstalled) {
                WeChat.pay(datas)
                .then((result) => {
                    console.log(result);
                    Toast.show('支付成功', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.CENTER,
                        hideOnPress: true,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    Toast.show('支付失败', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.CENTER,
                        hideOnPress: true,
                    });
                });
            } else {
                Toast.show(Lang.cn.shareErrorAlert, {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.CENTER,
                    hideOnPress: true,
                });
            }
        });
    };
    
    ali_pay = async () => {
        console.log(Alipay);
        let privateKey = 'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBANgpMkQEGr8NcuFWlYtozRAoR/h2n5MHMN9Ln2QlErF2mqeVI1+LFYtgF7y0kEaVdDg831X4gyOOEcObt0rrYFBFsG0+ZZQBjnDoAS92Qzuwfh8AHKEOQIms5g0NjfZ6+bTG4G4zzt0dDOEji8e5FUQtiP5AsUrPYW9qAUJqRR5NAgMBAAECgYEA16qKnzflI5ccdlz3yWbfqe42mFxqK7xx82e0+KrQcsTd2rO+3jWbYjqWlE0m4XV9xhpdzZ2r4Y5+hMZY4uPia34L2BCEbhnlaV2CpNW1pUG/aeeZZlSe3JP8ymiDdK0PEstoId/hNOdpm0Nu+YrZ5eiuEyJMbKZDorxQd3L984ECQQD73F+bqjyZ6UIj7VexiaBnnMMylNxZa2zNHZUBnya6N/TEXLEuXW5gJifnqOd2ba1RgOXBn0rW/eFN833sHPnhAkEA27agZcpgiaJz6mcj5695a8b/zvlN26OBza2P/ZCVuHcswFNJijehT7eqKxPayqVMxFRRC5w9e4CVAR3jHITp7QJAeXh3xCP+xlxxwdIekUnHSzGYEzUocRgWiXbS/s07aGTEcFAkRDBbo5PDez9DIyMSjFSWeyPQfJBFscrV2KLBAQJBAILrOHpO8+UvStjSqn9kfPpusoEW5oDI1hDDqfgSjlRDlwPm3PwiF9nTe+99PjLf+nVGNKCxcaVEwgTPVUPqIyUCQQDsz9Wd18p+0tOtI6/Ab9pXI55NKdBfg53n3uTeWJwhcP4Omw2nxwtiY8m51CrJNW2xh07wAPdufo5YQ+9xBEEe';
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
        // console.log(order);
        let order_str = '';
        for(let i in order) {
            if(i == 'biz_content') {
                let temp_str = '';
                for(let j in order[i]) {
                    temp_str += (j + '=' + order[i][j] + '&');
                }
                temp_str = temp_str.substring(0, temp_str.length - 1);
                // console.log(temp_str);
                // console.log('--------------------------------');
                // console.log(encodeURI(temp_str));
                order_str += (i + '=' + encodeURI(temp_str) + '&');
            }else {
                order_str += (i + '=' + order[i] + '&');
            }
        }
        order_str = order_str.substring(0, order_str.length - 1);

        let order_str2 = 'app_id=2016122004454914&method=alipay.trade.app.pay&charset=utf-8&format=json&sign_type=RSA&sign=MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBANgpMkQEGr8NcuFWlYtozRAoR%2Fh2n5MHMN9Ln2QlErF2mqeVI1%2BLFYtgF7y0kEaVdDg831X4gyOOEcObt0rrYFBFsG0%2BZZQBjnDoAS92Qzuwfh8AHKEOQIms5g0NjfZ6%2BbTG4G4zzt0dDOEji8e5FUQtiP5AsUrPYW9qAUJqRR5NAgMBAAECgYEA16qKnzflI5ccdlz3yWbfqe42mFxqK7xx82e0%2BKrQcsTd2rO%2B3jWbYjqWlE0m4XV9xhpdzZ2r4Y5%2BhMZY4uPia34L2BCEbhnlaV2CpNW1pUG%2FaeeZZlSe3JP8ymiDdK0PEstoId%2FhNOdpm0Nu%2BYrZ5eiuEyJMbKZDorxQd3L984ECQQD73F%2BbqjyZ6UIj7VexiaBnnMMylNxZa2zNHZUBnya6N%2FTEXLEuXW5gJifnqOd2ba1RgOXBn0rW%2FeFN833sHPnhAkEA27agZcpgiaJz6mcj5695a8b%2FzvlN26OBza2P%2FZCVuHcswFNJijehT7eqKxPayqVMxFRRC5w9e4CVAR3jHITp7QJAeXh3xCP%2BxlxxwdIekUnHSzGYEzUocRgWiXbS%2Fs07aGTEcFAkRDBbo5PDez9DIyMSjFSWeyPQfJBFscrV2KLBAQJBAILrOHpO8%2BUvStjSqn9kfPpusoEW5oDI1hDDqfgSjlRDlwPm3PwiF9nTe%2B99PjLf%2BnVGNKCxcaVEwgTPVUPqIyUCQQDsz9Wd18p%2B0tOtI6%2FAb9pXI55NKdBfg53n3uTeWJwhcP4Omw2nxwtiY8m51CrJNW2xh07wAPdufo5YQ%2B9xBEEe&timestamp=2017-05-11%2009%3A16%3A01&version=1.0&notify_url=http%3A%2F%2Fjingtaomart.com&biz_content=%7B%22timeout_express%22%3A%2230m%22%2C%22seller_id%22%3A%22%22%2C%22total_amount%22%3A%220.02%22%2C%22subject%22%3A%221%22%2C%22body%22%3A%22%E6%88%91%E6%98%AF%E6%B5%8B%E8%AF%95%E6%95%B0%E6%8D%AE%22%2C%22out_trade_no%22%3A%22314VYG1099IAGG7ZOYY%22%7D';

        order_str2 = 'app_id=2016122004454914&biz_content=%257B%2522body%2522%253A%2522%255Cu6d4b%255Cu8bd5_body%255Cu5185%255Cu5bb9%2522%252C%2522subject%2522%253A%2522%255Cu6d4b%255Cu8bd5_subject%255Cu5185%255Cu5bb9%2522%252C%2522out_trade_no%2522%253A1494474465%252C%2522total_amount%2522%253A0.1%252C%2522timeout_express%2522%253A%252230m%2522%257D&charset=utf-8&method=alipay.trade.app.pay&notify_url=http%3A%2F%2Fjingtaomart.com&sign_type=RSA&timestamp=2017-05-11%2011%3A47%3A45&version=1.0sign=wLztUOT36LPhb1xxl4VR6tRs8WeV0hIjq7mPKXGXUwsDqTJm40fDfCjwq9VWJt8ZaNhEXO35Yl4jFfgSltpZENde9MKfHuMwP4k6hiqnL4y6kwPvP8qXXHliforXY9k6nTB5kWDvte+dpJRVqa6HanpSwnecQP3VOEhPlVdnao0=';
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
    cancelImage: {
        width: PX.iconSize26,
        height: PX.iconSize26,
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