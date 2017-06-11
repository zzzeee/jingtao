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
} from 'react-native';

import User from '../public/user';
import Utils from '../public/utils';
import Urls from '../public/apiUrl';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {Rule, str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import InputText from '../public/InputText';
import ErrorAlert from '../other/ErrorAlert';
import FrequentModel from './FrequentModel';

var _User = new User();

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
        };
        this.minPword = 6;
        this.type = 1;
        this.alertMsg = '';
        this.clickNumber = 1;
        this.frequentNumber = 3;
    }

    componentDidMount() {
        // console.log('componentDidMount login');
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
        this.setState({showAlert: true, });
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
            if(!this.showInputIsAble()) return;
            Utils.fetch(Urls.checkUser, 'post', {
                uPhone: mobile,
                uPassword: pword,
            }, (result) => {
                console.log(result);
                that.clickNumber++;
                if(result) {
                    let ret = result.sTatus || 0;
                    let msg = result.sMessage || null;
                    let token = result.mToken || null;
                    if(ret == 1 && token) {
                        _User.getUserID(_User.keyMember)
                        .then((user) => {
                            _User.saveUserID(_User.keyMember, token)
                            .then(() => {
                                if(navigation) {
                                    let params = navigation.state.params || null;
                                    let back = params ? (params.back ? params.back : 'Personal') : 'Personal';
                                    navigation.navigate(back);
                                }
                            });
                        });
                    }else if(msg) {
                        that.showAutoModal(result.sMessage);
                    }
                }
            });
        }else {
            this.showAutoModal(Lang[Lang.default].mobilePhoneEmpty);
        }
    };

    render() {
        let { navigation } = this.props;
        let color = this.checkFormat() ?  '#fff' : Color.lightBack;
        let bgcolor = this.checkFormat() ? Color.mainColor : Color.gray;
        let disabled = this.checkFormat() ? false : true;
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].passwordLogin}
                    left={<BtnIcon width={PX.headIconSize} press={()=>{
                         navigation.goBack(null);
                    }} src={require("../../images/back.png")} />}
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
                                    vText={this.state.mobile}
                                    pText={Lang[Lang.default].inputMobile} 
                                    onChange={this.setMobile} 
                                    isPWD={false} 
                                    length={11}
                                    style={styles.inputStyle}
                                    keyType={"numeric"}
                                    onFocus={()=>this.setInputFocus('tel')}
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
                                    vText={this.state.password}
                                    pText={str_replace(Lang[Lang.default].inputPassword, this.minPword)}
                                    onChange={this.setPassword}
                                    isPWD={!this.state.showPassword}
                                    length={26}
                                    style={styles.inputStyle}
                                    onFocus={()=>this.setInputFocus('pwd')}
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
                    <TouchableOpacity disabled={disabled} onPress={this.startLogin} style={[styles.btnLoginBox, {
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
});