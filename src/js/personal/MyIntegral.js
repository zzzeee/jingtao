/**
 * 个人中心 - 我的积分
 * @auther linzeyong
 * @date   2017.04.26
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
} from 'react-native';

import Urls from '../public/apiUrl';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';

export default class MyIntegral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            point: 800,
            rotation: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.startAnimation();
    }

    startAnimation = () => {
        this.state.rotation.setValue(0);
        Animated.timing(this.state.rotation, {
            toValue: 1,
            duration: 800,
        }).start();

    };

    render() {
        let { navigation } = this.props;
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <AppHead
                    title={Lang.cn.personalIntegral}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                         navigation.goBack(null);
                    }} src={require("../../images/back.png")} />)}
                />
                <View style={styles.topBox}>
                    <Image
                        style={styles.integral_top_bg}
                        source={require('../../images/personal/integral_top_bg.png')}
                    >
                        <View style={styles.integral_bg_box}>
                            <Animated.Image 
                                style={[styles.integral_bg1, {
                                    transform: [{
                                        rotate: this.state.rotation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '150deg']
                                        })
                                    }]
                                }]} 
                                source={require('../../images/personal/integral_bg1.png')}
                                resizeMode={Image.resizeMode.contain}
                            />
                            <View style={styles.integralNumberView1}>
                                <Text style={styles.integralNumberText1}>{this.state.point}</Text>
                            </View>
                            <Image style={styles.integral_bg2} source={require('../../images/personal/integral_bg2.png')} />
                        </View>
                        <View style={styles.topRightView}>
                            <Text style={styles.topRightText1}>{Lang.cn.untilToday}</Text>
                            <Text style={styles.topRightText2}>{Lang.cn.saveYou}</Text>
                            <Text style={styles.topRightText3}>8000元</Text>
                        </View>
                    </Image>
                    <View style={styles.integralNumberView2}>
                        <Text style={styles.topTxt}>{Lang.cn.youHave}</Text>
                        <Text style={styles.integralNumberText2}>{this.state.point}</Text>
                        <Text style={styles.topTxt}>{Lang.cn.point}</Text>
                    </View>
                    <View style={styles.footGroupView}>
                        <Image style={styles.footGroup} source={require('../../images/personal/group.png')} />
                    </View>
                </View>
                <View style={styles.ruleBox}>
                    <Text style={styles.ruleTextLeft}>{Lang.cn.integralDetailed}</Text>
                    <Text style={styles.ruleTextRight} onPress={()=>navigation.navigate('IntegralRule')}>{Lang.cn.integralRule}</Text>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.lightGrey,
    },
    topBox: {
        backgroundColor: '#fff',
        marginTop: 10,
        paddingBottom: 30,
        marginBottom: 10,
    },
    integral_top_bg: {
        width: Size.width,
        height: 225,
        alignItems: 'center',
    },
    integral_bg_box: {
        marginTop: 40,
        width: PX.integralDiskSize,
        height: PX.integralDiskSize,
    },
    integral_bg1: {
        width: PX.integralDiskSize,
        height: PX.integralDiskSize,
    },
    integralNumberView1: {
        position: 'absolute',
        width: PX.integralDiskSize,
        height: PX.integralDiskSize / 2,
        left: 0,
        top: 0,
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    integralNumberText1: {
        color: Color.mainColor,
        fontSize: FontSize.integralNumber,
    },
    integral_bg2: {
        position: 'absolute',
        width: PX.integralDiskSize,
        height: PX.integralDiskSize / 2,
        left: 0,
        bottom: 0,
        zIndex: 3,
    },
    integralNumberView2: {
        height: 30,
        paddingLeft: Size.width * 0.2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    topTxt: {
        color: Color.lightBack,
        fontSize: 16,
    },
    integralNumberText2: {
        fontSize: FontSize.integralNumber,
        color: Color.steelBlue,
        padding: 2,
    },
    topRightView: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: Size.width / 2 - PX.integralDiskSize / 2,
        right: 0,
        top: 70,
    },
    topRightText1: {
        color: Color.gainsboro,
        fontSize: 12,
        padding: 2,
    },
    topRightText2: {
        color: Color.lightBack,
        fontSize: 14,
        padding: 2,
    },
    topRightText3: {
        color: Color.red,
        fontSize: 16,
        padding: 2,
    },
    footGroupView: {
        alignItems: 'flex-end',
    },
    footGroup: {
        width: 147,
        height: 38,
        marginTop: 10,
        marginRight: 15
    },
    ruleBox: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#fff',
        borderWidth: pixel,
        borderColor: Color.floralWhite,
    },
    ruleTextLeft: {
        color: Color.lightBack,
        fontSize: 16,
    },
    ruleTextRight: {
        color: Color.gainsboro,
        fontSize: 14,
        padding: 3,
    },
});