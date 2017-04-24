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
} from 'react-native';

import { StackNavigator, NavigationActions } from 'react-navigation';
import Urls from '../public/apiUrl';
import { Size, PX } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class PersonalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.ref_scrollview = null;
    }

    render() {
        const {setParams} = this.props.navigation;
        return (
            <ScrollView ref={(_ref)=>this.ref_scrollview=_ref} onScroll={this._onScroll}>
                <Image source={require('../../images/personal/personalbg.png')} style={styles.userBgImg}>
                    <View style={styles.headMainBox}>
                        <View style={styles.headBox}>
                            <Image source={require('../../images/navs/personal.png')} style={styles.userHeadImg} />
                            <Text style={styles.userNameText}>{'请先登录'}</Text>
                        </View>
                        <Image source={require('../../images/personal/integralbg.png')} style={styles.integralBg}>
                            <Text style={styles.integralText}>{str_replace(Lang.cn.jingtaoIntegral, 5000)}</Text>
                        </Image>
                    </View>
                </Image>
                <View style={{height: 1000, backgroundColor: '#579'}}>
                </View>
            </ScrollView>
        );
    }

    _onScroll = (e) => {
        let offsetY = e.nativeEvent.contentOffset.y || 0;
        let showHeight = PX.userTopHeight - PX.headHeight;

        if(offsetY > showHeight) {
            if(!this.showBG) {
                let { setParams } = this.props.navigation;
                this.showBG = true;
                if(setParams) {
                    setParams({changeBgColor: true,});
                }
            }
        }else {
            if(this.showBG) {
                let { setParams } = this.props.navigation;
                this.showBG = false;
                if(setParams) {
                    setParams({changeBgColor: false,});
                }
            }
        }
    };
}

var styles = StyleSheet.create({
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
    headBox: {
        height: PX.userHeadImgSize,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    userHeadImg: {
        tintColor: 'gray',
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    integralText: {
        color: '#fff',
        fontSize: 12,
    },
});