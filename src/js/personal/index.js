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
import AppHead from '../public/AppHead';
import { StackNavigator } from 'react-navigation';

export default class PersonalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            islogo: false,
            showHeadBgColor: false,
        };

        this.ref_scrollview = null;
    }

    render() {
        return (
        <View style={styles.flex}>
            <ScrollView 
                contentContainerStyle={styles.scrollStyle}
                ref={(_ref)=>this.ref_scrollview=_ref}  
                onScroll={this._onScroll}
            >
                <Image source={require('../../images/personal/personalbg.png')} style={styles.userBgImg}>
                    {this.state.islogo ?
                        <View style={styles.headMainBox}>
                            <View style={styles.headBox}>
                                <Image source={require('../../images/personal/defaultHeadImg.png')} style={styles.userHeadImg} />
                                <Text style={styles.userNameText}>{'这里是名字'}</Text>
                            </View>
                            <Image source={require('../../images/personal/integralbg.png')} style={styles.integralBg}>
                                <Text style={styles.integralText}>{str_replace(Lang[Lang.default].jingtaoIntegral, 5000)}</Text>
                                <Image source={require('../../images/more_white.png')} style={styles.smallIcon} />
                            </Image>
                        </View> :
                        <View style={[styles.headMainBox, {justifyContent: 'center',}]}>
                            <Text style={[styles.bigBotton, {marginRight: 30,}]} onPress={()=>{}}>{Lang[Lang.default].logo}</Text>
                            <Text style={styles.bigBotton} onPress={()=>{}}>{Lang[Lang.default].register}</Text>
                        </View>
                    }
                </Image>
                <View style={styles.btnsListBox}>
                    <View style={styles.orderRow}>
                        <Text style={styles.darkText}>{Lang[Lang.default].myOrder}</Text>
                        <TouchableOpacity style={styles.lightTextBox}>
                            <Text style={styles.lightText}>{Lang[Lang.default].viewAllOrder}</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.smallIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ctrlBtnBox}>
                        <BtnIcon 
                            src={require('../../images/personal/daifukuan.png')} 
                            width={26} 
                            style={styles.btnCtrlOrder} 
                            text={Lang[Lang.default].daifukuan} 
                            txtStyle={[styles.normalText, {paddingTop: 5}]}
                        />
                        <BtnIcon 
                            src={require('../../images/personal/daifahuo.png')} 
                            width={26} 
                            style={styles.btnCtrlOrder} 
                            text={Lang[Lang.default].daifahuo} 
                            txtStyle={[styles.normalText, {paddingTop: 5}]}
                        />
                        <BtnIcon 
                            src={require('../../images/personal/daishouhuo.png')} 
                            width={26} 
                            style={styles.btnCtrlOrder} 
                            text={Lang[Lang.default].daishouhuo} 
                            txtStyle={[styles.normalText, {paddingTop: 5}]}
                        />
                        <BtnIcon 
                            src={require('../../images/personal/shouhou.png')} 
                            width={26} 
                            style={styles.btnCtrlOrder} 
                            text={Lang[Lang.default].shouhou}
                            txtStyle={[styles.normalText, {paddingTop: 5}]}
                        />
                    </View>
                </View>
                <View style={styles.btnsListBox}>
                    {this.btnRow(require('../../images/personal/myIntegral.png'), Lang[Lang.default].myIntegral, 'MyIntegral', null)}
                    {this.btnRow(
                        require('../../images/personal/coupon.png'), 
                        Lang[Lang.default].coupon, 
                        null, 
                        str_replace(Lang[Lang.default].couponBeOverdue, 3)
                    )}
                    {this.btnRow(require('../../images/personal/myWallet.png'), Lang[Lang.default].myWallet, null, null)}
                    {this.btnRow(require('../../images/personal/myCollection.png'), Lang[Lang.default].myCollection, null, null)}
                    {this.btnRow(require('../../images/personal/myAddress.png'), Lang[Lang.default].myAddress, null, null)}
                </View>
                <View style={styles.btnsListBox}>
                    {this.btnRow(require('../../images/personal/contactUs.png'), Lang[Lang.default].contactUs, null, null)}
                    {this.btnRow(require('../../images/personal/helpNote.png'), Lang[Lang.default].helpNote, null, null)}
                    {this.btnRow(require('../../images/personal/helpNote.png'), '测试专用', 'TestPage', '这里为测试链接')}
                </View>
            </ScrollView>
            <AppHead 
                float={true}
                style={{
                    elevation: this.state.showHeadBgColor ? 4 : 0,
                    backgroundColor: this.state.showHeadBgColor ? Color.mainColor : 'transparent',
                }}
                textStyle={{color: '#fff'}}
                title={Lang[Lang.default].persional} 
                left={(<BtnIcon style={styles.btnRight} width={PX.headIconSize} src={require("../../images/personal/config_white.png")} />)}
                right={(<BtnIcon style={styles.btnRight} width={PX.headIconSize} src={require("../../images/personal/msg.png")} />)}
            />
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
    btnRow = (img, txt, name, rightTxt) => {
        return (
            <TouchableOpacity onPress={()=>{
                if(name) {
                    this.props.navigation.navigate(name);
                }
            }}>
                <View style={styles.btnRowStyle}>
                    <Image style={styles.bigIcon} source={img} style={styles.bigIcon} />
                    <View style={styles.btnRowRightBox}>
                        <Text style={styles.defalueFont}>{txt}</Text>
                        <View style={styles.lightTextBox}>
                            <Text style={styles.btnRowRighText}>{rightTxt}</Text>
                            <Image source={require('../../images/list_more.png')} style={styles.bigIcon} />
                        </View>
                    </View>
                    
                </View>
            </TouchableOpacity>
        );
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    defalueFont: {
        color: Color.lightBack,
        fontSize: 14,
    },
    scrollStyle: {
        backgroundColor: Color.lightGrey,
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
        paddingLeft: 46,
        paddingRight: 46,
        paddingTop: 8,
        paddingBottom: 7,
        color: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fff',
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    headBox: {
        height: PX.userHeadImgSize,
        marginLeft: PX.marginLR,
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
        marginBottom: PX.marginTB,
    },
    orderRow: {
        height: 49,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Color.lavender,
        borderWidth: pixel,
        paddingRight: PX.marginLR,
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
        paddingLeft: PX.marginLR,
        fontWeight: 'bold',
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
        fontSize: 13,
    },
    btnRowStyle: {
        width: Size.width - PX.marginLR,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: PX.marginLR,
        paddingRight: PX.marginLR,
    },
    btnRowRightBox: {
        flex: 1,
        height: 50,
        borderBottomColor: Color.lavender,
        borderBottomWidth: pixel,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: PX.marginLR,
    },
    btnRowRighText: {
        paddingRight: 8,
        fontSize: 13,
        color: Color.red,
    },
});