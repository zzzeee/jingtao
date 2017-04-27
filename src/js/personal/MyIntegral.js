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
import { Size, Color, PX } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';

export default class MyIntegral extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            duration: 1500,
        }).start(this.startAnimation);

    };

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <AppHead
                    occupy={true}
                    title={Lang.cn.personalIntegral}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                         this.props.navigation.goBack(null);
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
                                            outputRange: ['0deg', '360deg']
                                        })
                                    }]
                                }]} 
                                source={require('../../images/personal/integral_bg1.png')}
                                resizeMode={Image.resizeMode.contain}
                            />
                            <Image style={styles.integral_bg2} source={require('../../images/personal/integral_bg2.png')} />
                        </View>
                    </Image>
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
    },
    integral_top_bg: {
        width: Size.width,
        height: 225,
        alignItems: 'center',
    },
    integral_bg_box: {
        marginTop: 40,
        width: 100,
        height: 100,
        marginLeft: -10,
    },
    integral_bg1: {
        width: 100,
        height: 100,
    },
    integral_bg2: {
        position: 'absolute',
        width: 90,
        height: 45,
        right: 0,
        bottom: 0,
    }
});