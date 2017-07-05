/**
 * 发现页 - 浦发信用卡广告
 * @auther linzeyong
 * @date   2017.07.04
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native';

import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import Lang, {str_replace, Privacy} from '../public/language';
import { Size, pixel, Color, PX } from '../public/globalStyle';
import InputText from '../public/InputText';
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import SendCode from '../login/verificationCode';
import ErrorAlert from '../other/ErrorAlert';
import FrequentModel from '../login/FrequentModel';

export default class PufaBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: null,
            mobile: null,
            showAlert: false,
            showFrequentModel: false,
        };
        this.type = 1;
        this.alertMsg = '';
        this.clickNumber = 1;
        this.frequentNumber = 3;
    }

    //设置手机号值
    setMobile = (value) => {
        this.setState({mobile: value});
    };

    //设置验证码值
    setCode = (value) => {
        this.setState({code: value});
    };

    //隐藏频繁提示框
    hideFrequentBox = () => {
        this.clickNumber = 1;
        this.setState({showFrequentModel: false});
    };

    //显示提示框
    showAutoModal = (msg) => {
        this.alertMsg = msg;
        this.setState({showAlert: true, });
    };

    //隐藏提示框
    hideAutoModal = () => {
        this.setState({ showAlert: false });
    };

    //检测是否可以允许发送验证码
    checkCode = () => {
        let mobile = this.state.mobile;
        if(mobile) {
            return true;
        }
        return false;
    };

    //点击发送验证码
    clickSendCode = (callback, disLock) => {
        if(this.checkCode()) {
            let that = this;
            let mobile = this.state.mobile || '';
            let cNumber = this.clickNumber || 1;
            if(!Utils.checkMobile(mobile)) {
                disLock();
                this.showAutoModal(Lang[Lang.default].mobilePhoneFail);
            }else if(cNumber > 0 && cNumber % this.frequentNumber === 0) {
                disLock();
                this.setState({showFrequentModel: true});
            }else {
                Utils.fetch(Urls.sendCode, 'post', {
                    mPhone: this.state.mobile,
                }, (result) => {
                    that.clickNumber++;
                    disLock();
                    if(result) {
                        let ret = result.sTatus || 0;
                        if(ret == 1) {
                            callback();
                            that.sendResult = true;
                        }else if(ret == 3) {
                            that.linkPuFa_www();
                        }else if(result.sMessage) {
                            that.showAutoModal(result.sMessage);
                        }
                    }
                });
            }
        }
    };

    //点击提交按钮
    updateInfo = () => {
        let that = this;
        let mobile = this.state.mobile || '';
        let code = this.state.code || '';
        if(!Utils.checkMobile(mobile)) {
            this.showAutoModal(Lang[Lang.default].mobilePhoneFail);
        }else if(!code) {
            this.showAutoModal('请输入验证码');
        }else {
            Utils.fetch(Urls.pufaRegister, 'post', {
                mPhone: mobile,
                mCode: code,
            }, (result) => {
                let ret = result.sTatus || 0;
                if (ret == 1 || ret == 3) {
                    that.linkPuFa_www();
                }else if(result.sMessage) {
                    that.showAutoModal(result.sMessage);
                }
            });
        }
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    title={'办卡领取积分'}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                            navigation.goBack(null);
                    }} src={require("../../images/back.png")} />)}
                />
                <ScrollView>
                    <Image source={require('../../images/find/pufa_banner.png')} style={styles.topImg} />
                    <Image resizeMode="stretch" source={require('../../images/find/banner_bg.png')} style={styles.ruleImgBg}>
                        <View style={styles.ruleBox}>
                            <View style={styles.ruleTitleBox}>
                                <Text style={styles.ruleTitle}>积分领取须知</Text>
                                <Image style={styles.roleIcon} source={require('../../images/find/rule_icon.png')} />
                            </View>
                            <View style={styles.ruleItem}>
                                <Image source={require('../../images/find/rule1.png')} style={styles.ruleBeforeImg} />
                                <View style={styles.flex}>
                                    <Text numberOfLines={2} style={styles.ruleContent}>办理信用卡的手机号要与领取积分的手机号相同,否则无法赠送积分。</Text>
                                </View>
                            </View>
                            <View style={styles.ruleItem}>
                                <Image source={require('../../images/find/rule2.png')} style={styles.ruleBeforeImg} />
                                <View style={styles.flex}>
                                    <Text numberOfLines={2} style={styles.ruleContent}>信用卡申请在审核通过后,80元现金积分才会发放。</Text>
                                </View>
                            </View>
                            <View style={styles.ruleItem}>
                                <Image source={require('../../images/find/rule3.png')} style={styles.ruleBeforeImg} />
                                <View style={styles.flex}>
                                    <Text numberOfLines={2} style={styles.ruleContent}>未正式注册用户,如何登录相应帐号,请查看“
                                        <Text style={styles.redFont} onPress={()=>{
                                            navigation.navigate('LoginExplain');
                                        }}>登录说明</Text>
                                    ”。</Text>
                                </View>
                            </View>
                        </View>
                    </Image>
                    <View style={styles.contentBox0}>
                        <Image source={require('../../images/find/lineHead.png')} style={styles.lineHeadImg} />
                        <View style={styles.contentBox}>
                            <View style={styles.lineView} />
                            <Text style={styles.bodyTitle}>申请流程</Text>
                            <View style={styles.rowStyle}>
                                <Image source={require('../../images/find/number1.png')} style={styles.numberIcon} />
                                <View style={styles.rowRightStyle}>
                                    <Text style={styles.txtStyle1}>输入手机号</Text>
                                    <Text style={styles.txtStyle2}>未注册用户将自动生成帐号</Text>
                                </View>
                            </View>
                            <View style={styles.inputRow}>
                                <Image source={require('../../images/login/iphone_gary.png')} style={styles.inputLeftIcon} />
                                <InputText
                                    vText={this.state.mobile}
                                    pText={Lang[Lang.default].inputMobile}
                                    onChange={this.setMobile}
                                    length={11}
                                    style={styles.inputStyle}
                                    keyType={"numeric"}
                                />
                            </View>
                            <View style={styles.inputRow}>
                                <Image source={require('../../images/login/code.png')} style={styles.inputLeftIcon} />
                                <InputText
                                    vText={this.state.code}
                                    pText={Lang[Lang.default].inputCode}
                                    onChange={this.setCode}
                                    length={10}
                                    style={styles.inputStyle}
                                />
                                <SendCode sendCodeFunc={this.clickSendCode} enable={this.checkCode()} />
                            </View>
                            <View style={styles.formUpdateBox}>
                                <TouchableOpacity onPress={this.updateInfo} style={styles.btnUpdateForm}>
                                    <Text style={styles.txtStyle3}>提交</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.rowStyle}>
                                <Image source={require('../../images/find/number2.png')} style={styles.numberIcon} />
                                <View style={styles.rowRightStyle}>
                                    <Text style={styles.txtStyle1}>提交手机号码后</Text>
                                    <Text style={styles.txtStyle1}>自动跳转至信用卡办理页面</Text>
                                </View>
                            </View>
                        </View>
                        <Image source={require('../../images/find/lineFoot.png')} style={styles.lineHeadImg} />
                    </View>
                    <View style={{alignItems: 'center',}}>
                        <Text style={styles.txtStyle4}>版权所有: 宁波指动网络科技有限公司</Text>
                    </View>
                </ScrollView>
                {this.state.showAlert ?
                    <ErrorAlert 
                        type={this.type}
                        visiable={this.state.showAlert} 
                        message={this.alertMsg} 
                        hideModal={this.hideAutoModal} 
                    />
                    : null
                }
                {this.state.showFrequentModel ? 
                    <FrequentModel isShow={this.state.showFrequentModel} callBack={this.hideFrequentBox} />
                    : null
                }
            </View>
        );
    }

    //跳转至浦发信用卡页面
    linkPuFa_www = () => {
        Linking.openURL(Urls.gotoPuFa)
        .catch(err => console.error('跳转失败:', err));
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#ffe5cd',
    },
    topImg: {
        width: Size.width,
        height: 233,
    },
    ruleImgBg: {
        width: Size.width - 15,
        height: 285,
        marginLeft: 8,
    },
    ruleBox: {
        marginLeft: 16,
        marginRight: 16,
        marginTop: 32,
    },
    ruleTitleBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 23,
    },
    ruleTitle: {
        fontSize: 16,
        color: '#fff',
    },
    roleIcon: {
        width: 20,
        height: 20,
        marginLeft: 8,
    },
    ruleItem: {
        marginTop: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ruleBeforeImg: {
        width: 34,
        height: 26,
    },
    ruleContent: {
        paddingLeft: 8,
        fontSize: 14,
        lineHeight: 19,
        color: '#333',
    },
    redFont: {
        fontSize: 14,
        color: Color.red,
        textDecorationLine: 'underline',
    },
    contentBox0: {
        paddingTop: 4,
        paddingBottom: 4,
        marginTop: 10,
    },
    lineHeadImg: {
        width: 6,
        height: 4,
        marginLeft: 15 + 20,
    },
    contentBox: {
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 5,
        backgroundColor: '#fff',
        height: 480,
    },
    lineView: {
        backgroundColor: '#e60012',
        width: 4,
        height: 480,
        position: 'absolute',
        top: 0,
        left: 20,
    },
    bodyTitle: {
        paddingLeft: 38,
        paddingTop: 22,
        paddingBottom: 38,
        fontSize: 16,
        color: Color.lightBack,
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    numberIcon: {
        marginLeft: 9,
        marginRight: 9,
        width: 46,
        height: 46,
    },
    rowRightStyle: {
        justifyContent: 'space-around',
    },
    txtStyle1: {
        fontSize: 13,
        color: '#333',
    },
    txtStyle2: {
        fontSize: 13,
        color: '#e60012',
    },
    txtStyle3: {
        fontSize: 13,
        color: '#fff',
    },
    txtStyle4: {
        fontSize: 12,
        color: '#808080',
        paddingTop: 22,
        paddingBottom: 16,
    },
    inputRow: {
        height: 50,
        marginLeft: 46,
        marginRight: 20,
        marginTop: 15,
        flexDirection: 'row',
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
        alignItems: 'center',
    },
    inputLeftIcon: {
        width: 26,
        height: 26,
    },
    inputStyle: {
        flex: 1,
        borderWidth: 0,
        fontSize: 13,
        color: Color.lightBack,
    },
    formUpdateBox: {
        marginLeft: 46,
        marginRight: 20,
        marginTop: 47,
        marginBottom: 60,
    },
    btnUpdateForm: {
        height: 38,
        borderRadius: 5,
        backgroundColor: Color.mainColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
});