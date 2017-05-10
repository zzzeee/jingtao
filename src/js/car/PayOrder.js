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
    ScrollView,
    TouchableOpacity,
    Button,
} from 'react-native';

var WeChat=require('react-native-wechat');
// import {pay} from 'react-native-alipay';
import Alipay from 'react-native-alipay';
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
                        <Button title="微信支付" onPress={()=>{
                            this.weixin_pay();
                        }} />
                        <Button title="支付宝支付" onPress={()=>{
                            this.ali_pay();
                        }} />
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
            'prepayId': 'wx2017051017184199889258cc0779167514',
            'nonceStr': 'iduDQmySFxI0rUyV',
            'timeStamp': '1494407954',
            'package': 'Sign=WXPay',
            'sign': 'E9F190BA173EE106E562844AB3E84E3F'
        };
        console.log('start weixin_pay pay ............');
        console.log(datas);
        let result = await WeChat.pay(datas);
        console.log(result);
        console.log('end weixin_pay pay ...............');
    };
    
    ali_pay = async () => {
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

        order_str='app_id=2016122004454914&method=alipay.trade.app.pay&charset=utf-8&format=json&sign_type=RSA&sign=MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBANgpMkQEGr8NcuFWlYtozRAoR%2Fh2n5MHMN9Ln2QlErF2mqeVI1%2BLFYtgF7y0kEaVdDg831X4gyOOEcObt0rrYFBFsG0%2BZZQBjnDoAS92Qzuwfh8AHKEOQIms5g0NjfZ6%2BbTG4G4zzt0dDOEji8e5FUQtiP5AsUrPYW9qAUJqRR5NAgMBAAECgYEA16qKnzflI5ccdlz3yWbfqe42mFxqK7xx82e0%2BKrQcsTd2rO%2B3jWbYjqWlE0m4XV9xhpdzZ2r4Y5%2BhMZY4uPia34L2BCEbhnlaV2CpNW1pUG%2FaeeZZlSe3JP8ymiDdK0PEstoId%2FhNOdpm0Nu%2BYrZ5eiuEyJMbKZDorxQd3L984ECQQD73F%2BbqjyZ6UIj7VexiaBnnMMylNxZa2zNHZUBnya6N%2FTEXLEuXW5gJifnqOd2ba1RgOXBn0rW%2FeFN833sHPnhAkEA27agZcpgiaJz6mcj5695a8b%2FzvlN26OBza2P%2FZCVuHcswFNJijehT7eqKxPayqVMxFRRC5w9e4CVAR3jHITp7QJAeXh3xCP%2BxlxxwdIekUnHSzGYEzUocRgWiXbS%2Fs07aGTEcFAkRDBbo5PDez9DIyMSjFSWeyPQfJBFscrV2KLBAQJBAILrOHpO8%2BUvStjSqn9kfPpusoEW5oDI1hDDqfgSjlRDlwPm3PwiF9nTe%2B99PjLf%2BnVGNKCxcaVEwgTPVUPqIyUCQQDsz9Wd18p%2B0tOtI6%2FAb9pXI55NKdBfg53n3uTeWJwhcP4Omw2nxwtiY8m51CrJNW2xh07wAPdufo5YQ%2B9xBEEe&timestamp=2017-05-10%2017%3A56%3A01&version=1.0&notify_url=http%3A%2F%2Fjingtaomart.com&biz_content=%257B%2522body%2522%253A%2522%255Cu6d4b%255Cu8bd5_body%255Cu5185%255Cu5bb9%2522%252C%2522subject%2522%253A%2522%255Cu6d4b%255Cu8bd5_subject%255Cu5185%255Cu5bb9%2522%252C%2522out_trade_no%2522%253A1494409579%252C%2522total_amount%2522%253A0.1%252C%2522timeout_express%2522%253A%252230m%2522%257D';
        const result = await Alipay.pay(order_str, true);
        console.log(result);
        if (result.resultStatus === '9000') {
            alert('提示', '支付成功');
        } else if (result.resultStatus === '8000') {
            alert('提示', '支付结果确认中,请稍后查看您的账户确认支付结果');
        } else if (result.resultStatus !== '6001') {
            // 如果用户不是主动取消
            alert('提示', '支付失败');
        };
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
});