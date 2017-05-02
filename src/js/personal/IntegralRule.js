/**
 * 个人中心 - 我的积分 - 积分规则
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
import Lang, {Rule, str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';

export default class MyIntegral extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { navigation } = this.props;
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <AppHead
                    title={Lang.cn.integralRule}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                         navigation.goBack(null);
                    }} src={require("../../images/back.png")} />)}
                />
                <View style={styles.topBox}>
                    {Rule.map((item, index) => this.textBlock(item, index))}
                </View>
            </ScrollView>
        );
    }

    textBlock = (item, index) => {
        let title = item.title || '';
        let content = item.content || '';
        return (
            <View key={index} style={styles.paragraph}>
                <Text style={styles.titleStyle}>{title}</Text>
                <Text style={styles.contentStyle}>{content}</Text>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.lightGrey,
        paddingBottom: 10,
    },
    paragraph: {
        padding: 15,
        backgroundColor: '#fff',
        marginTop: 10,
    },
    titleStyle: {
        fontSize: 15,
        color: Color.mainColor,
        marginBottom: 15,
    },
    contentStyle: {
        fontSize: 12,
        lineHeight: 22,
        color: Color.lightBack,
        paddingBottom: 5,
    },
});