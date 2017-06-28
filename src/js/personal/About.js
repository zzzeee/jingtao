/**
 * 个人中心 - 联系我们
 * @auther linzeyong
 * @date   2017.06.20
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';

import Lang, {str_replace} from '../public/language';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';

export default class About extends Component {
    rows = [
        '联系方式',
        '联系客服QQ：1604693830',
        '400热线：400-023-7333',
        '商家合作联系',
        '联系QQ：1161172824',
    ];

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].contactUs}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                            navigation.goBack(null);
                    }} src={require("../../images/back.png")} />)}
                />
                <View style={styles.flex}>
                    {this.rows.map(this.rendRow)}
                </View>
            </View>
        );
    }

    rendRow = (item, index) => {
        return (
            <View key={index} style={{
                backgroundColor: '#fff',
                marginTop: index == 3 ? PX.marginTB : 0,
            }}>
                <View style={styles.rowMain}>
                    <Text style={styles.rowText}>{item}</Text>
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
        flex: 1,
        backgroundColor: Color.lightGrey,
    },
    rowMain: {
        marginLeft: PX.marginLR,
        height: PX.rowHeight1,
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
        justifyContent: 'center',
    },
    rowText: {
        fontSize: 14,
        color: Color.lightBack,
    },
});