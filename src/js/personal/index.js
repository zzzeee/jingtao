/**
 * APP个人中心
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Button,
    Animated,
    TouchableOpacity,
} from 'react-native';

import Urls from '../public/apiUrl';
import BtnIcon from '../public/BtnIcon';
import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import PersonalHead from './PersonalHead';

export default class PersonalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            islogo: true,
            showHeadBgColor: false,
        };

        this.ref_scrollview = null;
    }

    render() {
        return (
        <View style={styles.flex}>
            <PersonalHead 
                float={true}
                style={{
                    elevation: this.state.showHeadBgColor ? 4 : 0,
                    backgroundColor: this.state.showHeadBgColor ? Color.mainColor : 'transparent',
                }}
                textStyle={{color: '#fff'}}
                title={Lang.cn.persional} 
                left={(<BtnIcon style={styles.btnRight} width={PX.headIconSize} src={require("../../images/personal/config_white.png")} />)}
                right={(<BtnIcon style={styles.btnRight} width={PX.headIconSize} src={require("../../images/personal/msg.png")} />)}
            />
            <ScrollView ref={(_ref)=>this.ref_scrollview=_ref}  onScroll={this._onScroll}>
                <Image source={require('../../images/personal/personalbg.png')} style={styles.userBgImg}>
                    {this.state.islogo ?
                        <View style={styles.headMainBox}>
                            <View style={styles.headBox}>
                                <Image source={require('../../images/personal/defaultHeadImg.png')} style={styles.userHeadImg} />
                                <Text style={styles.userNameText}>{'请先登录'}</Text>
                            </View>
                            <Image source={require('../../images/personal/integralbg.png')} style={styles.integralBg}>
                                <Text style={styles.integralText}>{str_replace(Lang.cn.jingtaoIntegral, 5000)}</Text>
                                <Image source={require('../../images/more_white.png')} style={styles.smallIcon} />
                            </Image>
                        </View> :
                        <View style={[styles.headMainBox, {justifyContent: 'space-around',}]}>
                            <Text style={styles.bigBotton} onPress={()=>{}}>{Lang.cn.logo}</Text>
                            <Text style={styles.bigBotton} onPress={()=>{}}>{Lang.cn.register}</Text>
                        </View>
                    }
                </Image>
                <View style={styles.btnsListBox}>
                    <View style={styles.orderRow}>
                        <Text style={styles.darkText}>{Lang.cn.myOrder}</Text>
                        <TouchableOpacity style={styles.lightTextBox}>
                            <Text style={styles.lightText}>{Lang.cn.viewAllOrder}</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.smallIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ctrlBtnBox}>
                        <BtnIcon 
                            src={require('../../images/personal/daifukuan.png')} 
                            width={26} 
                            style={styles.btnCtrlOrder} 
                            text={Lang.cn.daifukuan} 
                            txtStyle={[styles.normalText, {paddingTop: 5}]}
                        />
                        <BtnIcon 
                            src={require('../../images/personal/daifahuo.png')} 
                            width={26} 
                            style={styles.btnCtrlOrder} 
                            text={Lang.cn.daifahuo} 
                            txtStyle={[styles.normalText, {paddingTop: 5}]}
                        />
                        <BtnIcon 
                            src={require('../../images/personal/daishouhuo.png')} 
                            width={26} 
                            style={styles.btnCtrlOrder} 
                            text={Lang.cn.daishouhuo} 
                            txtStyle={[styles.normalText, {paddingTop: 5}]}
                        />
                        <BtnIcon 
                            src={require('../../images/personal/shouhou.png')} 
                            width={26} 
                            style={styles.btnCtrlOrder} 
                            text={Lang.cn.shouhou}
                            txtStyle={[styles.normalText, {paddingTop: 5}]}
                        />
                    </View>
                </View>
                <View style={styles.btnsListBox}>
                    {this.btnRow(require('../../images/personal/myIntegral.png'), Lang.cn.myIntegral)}
                    {this.btnRow(require('../../images/personal/myWallet.png'), Lang.cn.myWallet)}
                    {this.btnRow(require('../../images/personal/myCollection.png'), Lang.cn.myCollection)}
                    {this.btnRow(require('../../images/personal/myAddress.png'), Lang.cn.myAddress)}
                </View>
                <View style={styles.btnsListBox}>
                    {this.btnRow(require('../../images/personal/contactUs.png'), Lang.cn.contactUs)}
                    {this.btnRow(require('../../images/personal/helpNote.png'), Lang.cn.helpNote)}
                </View>
            </ScrollView>
        </View>);
    }

    _onScroll = (e) => {
        let offsetY = e.nativeEvent.contentOffset.y || 0;
        let showHeight = PX.headHeight + 10;
        let hideHeight = PX.headHeight;

        if(offsetY > showHeight) {
            if(!this.state.showHeadBgColor) {
                this.setState({showHeadBgColor: true})
            }
        }else if(offsetY < hideHeight) {
            if(this.state.showHeadBgColor) {
                this.setState({showHeadBgColor: false})
            }
        }
    };

    //按钮栏
    btnRow = (img, txt) => {
        return (
            <TouchableOpacity onPress={()=>alert(txt)}>
                <View style={styles.btnRowStyle}>
                    <View style={styles.lightTextBox}>
                        <Image style={styles.bigIcon} source={img} style={styles.bigIcon} />
                        <Text style={[styles.normalText, {paddingLeft: 15}]}>{txt}</Text>
                    </View>
                    <Image source={require('../../images/list_more.png')} style={styles.bigIcon} />
                </View>
            </TouchableOpacity>
        );
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    userBgImg: {
        justifyContent: "flex-end",
        width: Size.width,
        height: PX.userTopHeight,
    },
    headMainBox: {
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    bigBotton: {
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 6,
        paddingBottom: 6,
        color: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#fff',
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    headBox: {
        height: PX.userHeadImgSize,
        marginLeft: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    userHeadImg: {
        width: PX.userHeadImgSize,
        height: PX.userHeadImgSize,
        borderRadius: PX.userHeadImgSize / 2,
    },
    userNameText: {
        paddingLeft: 10,
        color: '#fff',
        fontSize: 14,
    },
    integralBg: {
        width: 130,
        height: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    integralText: {
        color: '#fff',
        fontSize: 12,
        paddingRight: 4,
    },
    smallIcon: {
        width: 16,
        height: 16,
    },
    bigIcon: {
        width: 26,
        height: 26,
    },
    btnsListBox: {
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    orderRow: {
        height: 49,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Color.lavender,
        borderWidth: pixel,
        paddingRight: 15,
    },
    ctrlBtnBox: {
        flexDirection: 'row',
        height: 100,
    },
    btnCtrlOrder: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkText: {
        color: Color.lightBack,
        fontSize: 14,
        paddingLeft: 15,
    },
    lightTextBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lightText: {
        color: Color.gainsboro,
        fontSize: 12,
        paddingRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    normalText: {
        color: Color.lightBack,
        fontSize: 12,
    },
    btnRowStyle: {
        width: Size.width - 15,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 15,
        paddingRight: 15,
        borderBottomColor: Color.lavender,
        borderBottomWidth: pixel,
    },
});