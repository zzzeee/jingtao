/**
 * 注册页面
 * @auther linzeyong
 * @date   2017.06.07
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
    ScrollView,
    Animated,
    TouchableOpacity,
} from 'react-native';

import Utils from '../public/utils';
import Urls from '../public/apiUrl';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {Rule, str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import InputText from '../public/InputText';
import SendCode from './verificationCode';
import ErrorAlert from '../other/ErrorAlert';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            password: '',
            code: '',
            showPassword: false,
            showAlert: false,
        };

        this.minPword = 6;
        this.type = 1;
        this.alertMsg = '';
        this.sendResult = false;
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    //设置手机号值
    setMobile = (value) => {
        this.setState({mobile: value});
    };

    //设置密码值
    setPassword = (value) => {
        this.setState({password: value});
    };

    //设置验证码值
    setCode = (value) => {
        this.setState({code: value});
    };

    //密码可见切换
    toggleShowPassword = (value) => {
        this.setState({showPassword: value});
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

    //检测用户名、密码格式是否正确
    checkFormat = () => {
        let mobile = this.state.mobile;
        let pword = this.state.password;
        let code = this.state.code;
        if(mobile && pword && code && /^1[34578]\d{9}$/.test(mobile) && pword.length >= this.minPword) {
            return true;
        }
        return false;
    };

    //检测是否可以允许发送验证码
    checkCode = () => {
        let mobile = this.state.mobile;
        if(mobile && /^1[34578]\d{9}$/.test(mobile)) {
            return true;
        }
        return false;
    };

    sendCode = () => {
        if(this.checkCode()) {
            let that = this;
            Utils.fetch(Urls.sendCode, 'post', {
                mPhone: this.state.mobile,
            }, (result) => {
                console.log(result);
                if(result) {
                    let ret = result.sTatus || 0;
                    if(ret == 1) {
                        that.sendResult = true;
                    }else if(result.sMessage) {
                        that.showAutoModal(result.sMessage);
                    }
                }
            });
        }
    };

    //提交注册
    userRegister = () => {
        let that = this;
        let mobile = this.state.mobile || '';
        let pword = this.state.password || '';
        let code = this.state.code || '';
        if(mobile && pword && code) {
            Utils.fetch(Urls.userRegister, 'post', {
                mPhone: mobile,
                mPwd: pword,
                mCpwd: pword,
                mCode: code,
            }, (result) => {
                console.log(result);
                if(result) {
                    let err = result.sTatus || 0;
                    let msg = result.sMessage || null;
                    if(err == 6) {
                         that.type = 2;
                         that.timer = setTimeout(() => {
                             that.props.navigation.navigate('Login');
                         }, 2500);
                    }
                    if(msg) that.showAutoModal(result.sMessage);
                }
            });
        }
    };

    render() {
        let { navigation } = this.props;
        let color = this.checkFormat() ? '#fff' : Color.lightBack;
        let bgcolor = this.checkFormat() ? Color.mainColor : Color.gray;
        let disabled = this.checkFormat() ? false : true;
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].registerUser}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                         navigation.goBack(null);
                    }} src={require("../../images/back.png")} />)}
                />
                <ScrollView contentContainerStyle={styles.scrollStyle}>
                    <View style={styles.inputRowStyle}>
                        <View style={styles.inputRowMain}>
                            <View style={styles.inputLeftStyle}>
                                <Image source={require('../../images/login/iphone_gary.png')} style={styles.iconSize26} />
                            </View>
                            <View style={styles.inputMiddleStyle}>
                                <InputText
                                    vText={this.state.mobile}
                                    pText={Lang[Lang.default].inputMobile} 
                                    onChange={this.setMobile} 
                                    isPWD={false} 
                                    length={11}
                                    style={styles.inputStyle}
                                    keyType={"numeric"}
                                />
                            </View>
                            <View style={styles.inputRightStyle}>
                                {this.state.mobile ?
                                    <TouchableOpacity style={styles.btnStyle} onPress={()=>this.setMobile('')}>
                                        <Image source={require('../../images/login/close.png')} style={styles.iconSize18} />
                                    </TouchableOpacity>
                                    : null
                                }
                            </View>
                        </View>
                    </View>
                    <View style={styles.inputRowStyle}>
                        <View style={styles.inputRowMain}>
                            <View style={styles.inputLeftStyle}>
                                <Image source={require('../../images/login/password_gary.png')} style={styles.iconSize26} />
                            </View>
                            <View style={styles.inputMiddleStyle}>
                                <InputText
                                    vText={this.state.password}
                                    pText={Lang[Lang.default].inputPassword} 
                                    onChange={this.setPassword}
                                    isPWD={!this.state.showPassword}
                                    length={26}
                                    style={styles.inputStyle}
                                />
                            </View>
                            {this.state.password ?
                                <View style={styles.inputRightStyle}>
                                    <TouchableOpacity style={styles.btnStyle} onPress={()=>this.setPassword('')}>
                                        <Image source={require('../../images/login/close.png')} style={styles.iconSize18}/>
                                    </TouchableOpacity>
                                    {this.state.showPassword ?
                                        <TouchableOpacity style={styles.btnStyle} onPress={()=>this.toggleShowPassword(false)}>
                                            <Image source={require('../../images/login/eyeOpen.png')} style={styles.iconSize26} />
                                        </TouchableOpacity> :
                                        <TouchableOpacity style={styles.btnStyle} onPress={()=>this.toggleShowPassword(true)}>
                                            <Image source={require('../../images/login/eyeClose.png')} style={styles.iconSize26} />
                                        </TouchableOpacity>
                                    }
                                </View>
                                : null
                            }
                        </View>
                    </View>
                    <View style={styles.inputRowStyle}>
                        <View style={styles.inputRowMain}>
                            <View style={styles.inputLeftStyle}>
                                <Image source={require('../../images/login/code.png')} style={styles.iconSize26} />
                            </View>
                            <View style={styles.inputMiddleStyle}>
                                <InputText
                                    vText={this.state.code}
                                    pText={Lang[Lang.default].inputCode}
                                    onChange={this.setCode}
                                    isPWD={false}
                                    length={10}
                                    style={styles.inputStyle}
                                />
                            </View>
                            <View style={styles.inputRightStyle}>
                                {this.state.code ?
                                    <TouchableOpacity style={styles.btnStyle} onPress={()=>this.setCode('')}>
                                        <Image source={require('../../images/login/close.png')} style={styles.iconSize18}/>
                                    </TouchableOpacity>
                                    : null
                                }
                                <SendCode sendCodeFunc={this.sendCode} enable={this.checkCode()} />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity disabled={false} onPress={this.userRegister} style={[styles.btnLoginBox, {
                        backgroundColor: bgcolor,
                    }]}>
                        <Text style={[styles.txtStyle1, {color: color}]}>{Lang[Lang.default].register}</Text>
                    </TouchableOpacity>
                </ScrollView>
                <ErrorAlert 
                    type={this.type}
                    visiable={this.state.showAlert} 
                    message={this.alertMsg} 
                    hideModal={this.hideAutoModal} 
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Color.floralWhite,
    },
    scrollStyle: {
        paddingTop: 10,
    },
    iconSize26: {
        width: PX.iconSize26,
        height: PX.iconSize26,
    },
    iconSize18: {
        width: 18,
        height: 18,
    },
    iconSize12: {
        width: 12,
        height: 12,
    },
    btnStyle: {
        padding: 10,
    },
    txtStyle1: {
        fontSize: 13,
        color: Color.lightBack,
    },
    txtStyle2: {
        fontSize: 12,
        color: Color.gainsboro,
    },
    txtStyle3: {
        fontSize: 13,
        color: Color.mainColor,
    },
    inputRowStyle: {
        backgroundColor: '#fff',
    },
    inputRowMain: {
        flexDirection: 'row',
        height: PX.rowHeight1,
        marginLeft: PX.marginLR,
        paddingRight: 5,
        alignItems: 'center',
        borderBottomColor: Color.lavender,
        borderBottomWidth: 1,
    },
    inputLeftStyle: {
        marginRight: 28,
    },
    inputMiddleStyle: {
        flex: 1,
    },
    inputStyle: {
        borderWidth: 0,
        fontSize: 13,
    },
    inputRightStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textRowStyle: {
        flexDirection: 'row',
        height: 44,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
    },
    btnLoginBox: {
        height: 38,
        width: Size.width - (PX.marginLR * 2),
        marginLeft: PX.marginLR,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.gray,
        marginTop: 80,
        borderRadius: 3,
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    registerText: {
        fontSize: 12,
        color: Color.gainsboro,
        paddingRight: 5,
    },
});