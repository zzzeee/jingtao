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
    Animated,
    FlatList,
} from 'react-native';

import Urls from '../public/apiUrl';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import list from '../datas/detailedList.json';

export default class MyIntegral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            point: 800,
            rotation: new Animated.Value(0),
            datas: null,
        };
    }

    componentDidMount() {
        this.initDatas();
        this.startAnimation();
    }

    initDatas = () => {
        this.setState({
            datas: list,
        });
    };

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
            <View style={styles.flex}>
                <AppHead
                    title={Lang[Lang.default].personalIntegral}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                            navigation.goBack(null);
                    }} src={require("../../images/back.png")} />)}
                />
                <FlatList
                    ref={(_ref)=>this.ref_flatList=_ref} 
                    data={this.state.datas}
                    keyExtractor={(item, index) => (index)}
                    enableEmptySections={true}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this.listHead}
                    ListFooterComponent={()=>{
                        return (
                            <View style={styles.listFootView}>
                                <Text style={styles.listFootText}>{Lang[Lang.default].inTheEnd}</Text>
                            </View>
                        );
                    }}
                    onEndReached={()=>{
                        // this.loadMore();
                    }}
                />
            </View>
        );
    }

    // 页面头部
    listHead = () => {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.topBox}>
                    <Image
                        style={styles.integral_top_bg1}
                        source={require('../../images/personal/integral_top_bg1.png')}
                    >
                        <Image source={require('../../images/personal/integral_top_bg3.png')} style={styles.integral_top_bg3}>
                            <Animated.Image 
                                style={[styles.integral_top_bg3, {
                                    transform: [{
                                        rotate: this.state.rotation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '116deg']
                                        })
                                    }]
                                }]} 
                                source={require('../../images/personal/integral_top_bg4.png')}
                                resizeMode={Image.resizeMode.contain}
                            />
                            <View style={styles.integralNumberView1}>
                                <Text style={styles.integralNumberText1}>{this.state.point}</Text>
                            </View>
                        </Image>
                        <View style={styles.topRightView}>
                            <Text style={styles.topRightText1}>{Lang[Lang.default].untilToday}</Text>
                            <Text style={styles.topRightText2}>{Lang[Lang.default].saveYou}</Text>
                            <Text style={styles.topRightText3}>8000元</Text>
                        </View>
                    </Image>
                    <Image source={require('../../images/personal/integral_top_bg2.png')} style={styles.integral_top_bg2} />
                    <View style={styles.integralNumberView2}>
                        <Text style={styles.topTxt}>{Lang[Lang.default].youHave}</Text>
                        <Text style={styles.integralNumberText2}>{this.state.point}</Text>
                        <Text style={styles.topTxt}>{Lang[Lang.default].point}</Text>
                    </View>
                    <View style={styles.footGroupView}>
                        <Image style={styles.footGroup} source={require('../../images/personal/group.png')} />
                    </View>
                </View>
                <View style={styles.ruleBox}>
                    <Text style={styles.ruleTextLeft}>{Lang[Lang.default].integralDetailed}</Text>
                    <Text style={styles.ruleTextRight} onPress={()=>navigation.navigate('IntegralRule')}>{Lang[Lang.default].integralRule}</Text>
                </View>
            </View>
        );
    };

    //积分使用明细
    _renderItem = ({item, index}) => {
        let name = item.sName || null;
        let used = item.used || null;
        let useTime = item.useTime || null;
        let number = parseInt(item.number) || 0;
        let headImg = item.headImg || null;
        let img = headImg ? {uri: headImg} : require('../../images/empty.png');
        let color = Color.gainsboro;
        if(number > 0) {
            number = '+' + number;
            color = Color.mainColor;
        }
        return (
            <View style={styles.rowStyle}>
                <Image source={img} style={styles.headImgStyle} />
                <View style={styles.rowRightStyle}>
                    <View style={styles.rowBetweenStyle}>
                        <Text style={styles.nameText}>{name}</Text>
                        <Text style={styles.useTimeText}>{useTime}</Text>
                    </View>
                    <View style={[styles.rowBetweenStyle, {alignItems: 'center'}]}>
                        <View>
                        <Text style={[styles.usedStyle, {
                            backgroundColor: color,
                        }]}>{used}</Text>
                        </View>
                        <Text style={[styles.numberStyle, {
                            color: color,
                        }]}>{number}</Text>
                    </View>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        backgroundColor: Color.lightGrey,
    },
    topBox: {
        backgroundColor: '#fff',
        marginTop: 10,
        paddingBottom: 30,
        marginBottom: 10,
    },
    integral_top_bg1: {
        width: Size.width - (PX.marginLR * 2),
        height: 158,
        marginLeft: PX.marginLR,
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    integral_top_bg2: {
        height: 42,
        width: Size.width - (PX.marginLR * 2),
        marginLeft: PX.marginLR,
    },
    integral_top_bg3: {
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
        right: -10,
        top: 40,
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
    rowStyle: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
    },
    headImgStyle: {
        width: 60,
        height: 60,
        marginTop: PX.marginTB,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Color.lavender,
    },
    rowRightStyle: {
        flex: 1,
        height: 80,
        marginLeft: 10,
    },
    rowBetweenStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nameText: {
        fontSize: 14,
        marginTop: 13,
        marginBottom: 12,
        color: Color.lightBack,
    },
    useTimeText: {
        fontSize: 12,
        color: Color.gray,
        marginTop: 17,
    },
    usedStyle: {
        color: '#fff',
        fontSize: 12,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 3,
    },
    numberStyle: {
        fontSize: 25,
    },
    listFootView: {
        height: PX.rowHeight2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.floralWhite,
    },
    listFootText: {
        color: Color.lightGrey,
        fontSize: 12,
    },
});