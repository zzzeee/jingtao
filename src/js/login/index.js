/**
 * 登录页面
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
    Modal,
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import { WeiXin } from '../datas/protect';
import User from '../public/user';
import Utils from '../public/utils';
import Urls from '../public/apiUrl';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace, TABKEY} from '../public/language';
import InputText from '../public/InputText';
import ErrorAlert from '../other/ErrorAlert';
import FrequentModel from './FrequentModel';

var _User = new User();
var WeChat = require('react-native-wechat');

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            password: '',
            showPassword: false,
            showAlert: false,
            onFocusMobile: false,
            onFocusPassword: false,
            showFrequentModel: false,
            load_or_error: null,
        };
        this.minPword = 6;
        this.type = 1;
        this.alertMsg = '';
        this.clickNumber = 1;
        this.frequentNumber = 3;
        this.btnLock = false;
        this.inputtext1 = null;
        this.inputtext2 = null;
    }

    componentDidMount() {
    }

    //设置哪个输入框获得焦点
    setInputFocus = (key) => {
        let obj = null;
        if(key == 'tel') {
            obj = {
                onFocusMobile: true,
                onFocusPassword: false,
            };
        }else if(key == 'pwd') {
            obj = {
                onFocusMobile: false,
                onFocusPassword: true,
            };
        }
        if(obj) this.setState(obj);
    };

    //设置手机号值
    setMobile = (value) => {
        this.setState({mobile: value});
    };

    //设置密码值
    setPassword = (value) => {
        this.setState({password: value});
    };

    //密码可见切换
    toggleShowPassword = (value) => {
        this.setState({showPassword: value});
    };

    //检测用户名、密码格式是否正确
    checkFormat = () => {
        let mobile = this.state.mobile;
        let pword = this.state.password;
        if(mobile && pword) {
            return true;
        }
        return false;
    };

    //显示提示框
    showAutoModal = (msg) => {
        this.alertMsg = msg;
        this.setState({
            showAlert: true, 
            load_or_error: null,
        });
    };

    //隐藏提示框
    hideAutoModal = () => {
        this.setState({ showAlert: false });
    };

    //隐藏频繁提示框
    hideFrequentBox = () => {
        this.clickNumber = 1;
        this.setState({showFrequentModel: false});
    };

    //检测用户输入是否正确
    showInputIsAble = () => {
        let mobile = this.state.mobile || '';
        let pword = this.state.password || '';
        let cNumber = this.clickNumber || 1;
        if(!/^1[34578]\d{9}$/.test(mobile)) {
            this.showAutoModal(Lang[Lang.default].mobilePhoneFail);
        }else if(pword.length < this.minPword) {
            this.showAutoModal(str_replace(Lang[Lang.default].passwordMinLength, this.minPword));
        }else if(cNumber > 0 && cNumber % this.frequentNumber === 0) {
            this.setState({showFrequentModel: true});
        }else {
            return true;
        }
        return false;
    };

    //点击登录
    startLogin = () => {
        let that = this;
        let navigation = this.props.navigation || null;
        let mobile = this.state.mobile || null;
        let pword = this.state.password || null;
        if(mobile && pword) {
            if(!this.showInputIsAble()) {
                this.btnLock = false;
                return;
            }
            _User.getUserID(_User.keyTourist)
            .then((value) => {
                let obj = {
                    uPhone: mobile,
                    uPassword: pword,
                    tTourist: value ? value : '',
                };
                Utils.fetch(Urls.checkUser, 'post', obj, (result) => {
                    console.log(result);
                    this.btnLock = false;
                    that.clickNumber++;
                    if(result) {
                        let ret = result.sTatus || 0;
                        let msg = result.sMessage || null;
                        let token = result.mToken || null;
                        if(ret == 1 && token) {
                            _User.saveUserID(_User.keyMember, token)
                            .then(() => {
                                if(navigation) {
                                    let params = navigation.state.params || null;
                                    let back = params ? (params.back ? params.back : null) : null;
                                    let backObj = params ? (params.backObj ? params.backObj : {}) : {};
                                    backObj.mToken = token;
                                    if(!back) {
                                        back = 'TabNav';
                                        backObj.PathKey = TABKEY.personal;
                                    }
                                    // navigation.navigate(back, backObj);
                                    let resetAction = NavigationActions.reset({
                                        index: 0,
                                        actions: [
                                            NavigationActions.navigate({routeName: back, params: backObj}),
                                        ]
                                    });
                                    navigation.dispatch(resetAction);
                                }
                            });
                            _User.delUserID(_User.keyTourist);
                        }else if(msg) {
                            that.showAutoModal(result.sMessage);
                        }
                    }
                });
            });
        }else {
            this.btnLock = false;
            this.showAutoModal(Lang[Lang.default].mobilePhoneEmpty);
        }
    };

    render() {
        let { navigation } = this.props;
        let color = this.checkFormat() ?  '#fff' : Color.lightBack;
        let bgcolor = this.checkFormat() ? Color.mainColor : Color.gray;
        let disabled = this.checkFormat() ? false : true;
        let canBack = true;
        let _params = navigation.state.params || null;
        if(_params && _params.notBack) canBack = false;
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].passwordLogin}
                    goBack={canBack}
                    leftPress={(_params && _params.leftPress) ? _params.leftPress : null}
                    navigation={navigation}
                    right={(<Text style={styles.forgetPasswordText} onPress={()=>{navigation.navigate('FrogetPass')}}>
                        {Lang[Lang.default].forgetPassword}
                    </Text>)}
                />
                <ScrollView contentContainerStyle={styles.scrollStyle}>
                    <View style={styles.inputRowStyle}>
                        <View style={styles.inputRowMain}>
                            <View style={styles.inputLeftStyle}>
                                <Image source={require('../../images/login/iphone_gary.png')} style={styles.iconSize26} />
                            </View>
                            <View style={styles.inputMiddleStyle}>
                                <InputText
                                    _ref_={(ref)=>this.inputtext1=ref}
                                    vText={this.state.mobile}
                                    pText={Lang[Lang.default].inputMobile} 
                                    onChange={this.setMobile}
                                    length={11}
                                    style={styles.inputStyle}
                                    keyType={"numeric"}
                                    onFocus={()=>this.setInputFocus('tel')}
                                    endEditing={()=>{
                                        this.inputtext1 && this.inputtext1.blur();
                                    }}
                                    submitEditing={()=>{
                                        this.inputtext1 && this.inputtext1.blur();
                                    }}
                                />
                            </View>
                            <View style={styles.inputRightStyle}>
                                {(this.state.mobile && this.state.onFocusMobile) ?
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
                                    _ref_={(ref)=>this.inputtext2=ref}
                                    vText={this.state.password}
                                    pText={str_replace(Lang[Lang.default].inputPassword, this.minPword)}
                                    onChange={this.setPassword}
                                    isPWD={!this.state.showPassword}
                                    length={26}
                                    style={styles.inputStyle}
                                    onFocus={()=>this.setInputFocus('pwd')}
                                    endEditing={()=>{
                                        this.inputtext2 && this.inputtext2.blur();
                                    }}
                                    submitEditing={()=>{
                                        this.inputtext2 && this.inputtext2.blur();
                                    }}
                                />
                            </View>
                            {(this.state.password && this.state.onFocusPassword) ?
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
                    <View style={styles.textRowStyle}>
                        <View>
                            <Text style={styles.txtStyle2}>
                                {Lang[Lang.default].loginProtocol}
                                《<Text style={styles.txtStyle3} onPress={()=>{
                                    navigation.navigate('LoginWord');
                                }}>{Lang[Lang.default].jingtaoProtocol}</Text>》
                            </Text>
                        </View>
                        <View></View>
                    </View>
                    <TouchableOpacity disabled={disabled} onPress={()=>{
                        if(!this.btnLock) {
                            this.btnLock = true;
                            this.startLogin();
                        }
                    }} style={[styles.btnLoginBox, {
                        backgroundColor: bgcolor,
                    }]}>
                        <Text style={[styles.txtStyle1, {color: color}]}>{Lang[Lang.default].logo}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.registerRow} onPress={()=>{
                        navigation.navigate('Register');
                    }}>
                        <Text style={styles.registerText}>{Lang[Lang.default].registeredClickThere}</Text>
                        <Image source={require('../../images/login/left.png')} style={styles.iconSize12} />
                    </TouchableOpacity>
                    <View style={styles.footBox}>
                        <View style={styles.lineBox}>
                            <View style={styles.lineStyle} />
                            <Text style={styles.txtStyle4}>使用以下帐号快速登录</Text>
                            <View style={styles.lineStyle} />
                        </View>
                        <View style={styles.imageBox}>
                            <TouchableOpacity onPress={this.WXLogin}>
                                <Image source={require('../../images/car/weixin.png')} style={styles.otherLoginImage} />
                            </TouchableOpacity>
                        </View>
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
                {this.state.load_or_error ?
                    <Modal
                        transparent={true}
                        visible={true}
                        onRequestClose={()=>{}}
                    >
                        <View style={styles.modalBody}>
                            {this.state.load_or_error}
                        </View>
                    </Modal>
                    : null
                }
            </View>
        );
    }

    //微信登录
    WXLogin = () => {
        let { navigation } = this.props;
        let scope = 'snsapi_userinfo';
        let state = 'jingtao_wx_login';
        //判断微信是否安装
        WeChat.isWXAppInstalled()
        .then((isInstalled) => {
            if (isInstalled) {
                //发送授权请求
                WeChat.sendAuthRequest(scope, state)
                .then(result => {
                    console.log(result);
                    if(result && result.errCode === 0 && result.code) {
                        Utils.fetch(Urls.getWXAccessToken, 'get', {
                            appid: WeiXin.appid, 
                            secret: WeiXin.appSecret,
                            code: result.code,
                            grant_type: 'authorization_code',
                        }, (result2) => {
                            console.log(result2);
                            if(result2 && result2.access_token && result2.openid) {
                                Utils.fetch(Urls.getWXUserInfo, 'get', {
                                    access_token: result2.access_token,
                                    openid: result2.openid,
                                }, (result3)=>{
                                    console.log(result3);
                                    if(result3 && result3.unionid) {
                                        let obj = {
                                            mUnionID: result3.unionid || '',
                                            mType: 'wechat',
                                            mNickName: result3.nickname || '',
                                            mPicture: result3.headimgurl || '',
                                        };
                                        console.log(obj);
                                        Utils.fetch(Urls.weixinLoginApi, 'post', obj, (result4)=>{
                                            console.log(result4);
                                            if(result4) {
                                                let err = result4.sTatus || null;
                                                let msg = result4.sMessage || null;
                                                let token = result4.mToken || null;
                                                if(err == 1) {
                                                    if(token) {
                                                        this.setState({
                                                            load_or_error: null,
                                                        }, ()=>{
                                                            _User.saveUserID(_User.keyMember, token)
                                                            .then(() => {
                                                                if(navigation) {
                                                                    let resetAction = NavigationActions.reset({
                                                                        index: 0,
                                                                        actions: [
                                                                            NavigationActions.navigate({
                                                                                routeName: 'TabNav', 
                                                                                params: {PathKey: TABKEY.personal},
                                                                            }),
                                                                        ]
                                                                    });
                                                                    navigation.dispatch(resetAction);
                                                                }
                                                            });
                                                            _User.delUserID(_User.keyTourist);
                                                        });
                                                    }else {
                                                        this.showAutoModal('服务器无token返回值');
                                                    }
                                                }else if(err == 6) {
                                                    this.setState({
                                                        load_or_error: null,
                                                    }, ()=>{
                                                        navigation.navigate('EditMobile', {
                                                            weixinInfo: obj,
                                                        });
                                                    });
                                                }else if(msg) {
                                                    this.showAutoModal(msg);
                                                }
                                            }
                                        }, (view, type)=>{
                                            if(type == 'error') {
                                                this.showAutoModal('存储微信信息出错');
                                            }else {
                                                this.setState({load_or_error: view,});
                                            }
                                        }, {
                                            catchFunc: (err4)=>console.log(err4),
                                            loadText: '开始登录',
                                        });
                                    }else {
                                        this.showAutoModal('微信信息无效');
                                    }
                                }, (view, type) => {
                                    if(type == 'error') {
                                        this.showAutoModal('获取微信信息失败');
                                    }else {
                                        this.setState({load_or_error: view,});
                                    }
                                }, {
                                    catchFunc: (err3)=>console.log(err3),
                                    loadText: '正在获取微信信息',
                                });
                            }else {
                                this.showAutoModal('请求微信数据无效');
                            }
                        }, (view, type) => {
                            if(type == 'error') {
                                this.showAutoModal('请求微信数据失败');
                            }else {
                                this.setState({load_or_error: view,});
                            }
                        }, {
                            catchFunc: (err2)=>console.log(err2),
                            loadText: '正在请求微信数据',
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.showAutoModal('登录授权发生错误:' + err);
                })
            } else {
                this.showAutoModal('您还未安装微信!');
            }
        })
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Color.floralWhite,
    },
    forgetPasswordText: {
        fontSize: 14,
        color: Color.orangeRed,
        fontWeight: 'bold',
        padding: 5,         // 增大点击面积
        paddingRight: PX.marginLR,
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
    txtStyle4: {
        fontSize: 10,
        color: Color.gainsboro,
        paddingLeft: 5,
        paddingRight: 5,
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
        marginTop: 36,
        borderRadius: 3,
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    registerText: {
        fontSize: 12,
        color: Color.gainsboro,
        paddingRight: 5,
    },
    footBox: {
        marginTop: 50,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
    },
    lineBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lineStyle: {
        flex: 1,
        height: 0,
        borderBottomWidth: pixel,
        borderBottomColor: Color.gainsboro,
    },
    imageBox: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    otherLoginImage: {
        width: 30,
        height: 30,
    },
    modalBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
});