/**
 * 个人中心 - 设置 - 留言
 * @auther linzeyong
 * @date   2017.08.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import Lang, {str_replace} from '../public/language';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';

export default class SendMessage extends Component {
    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    goBack={true}
                    title={'我要留言'}
                    navigation={this.props.navigation}
                />
                <View>
                    <View>
                        <Text></Text>
                    </View>
                    <View>
                    </View>
                </View>
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
        backgroundColor: '#fff',
    },
    scrollStyle: {
        paddingBottom: 15,
    },
    defaultFont: {
        fontSize: 14,
        color: Color.lightBack,
        lineHeight: 18,
    },
    itemStyle: {
        marginTop: 10,
        padding: 15,
    },
    nameView: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    nameText: {
        fontSize: 13,
        color: Color.lightBack,
    },
    positionText: {
        paddingLeft: 10,
        fontSize: 13,
        color: Color.gainsboro,
    },
    detailView: {
        marginTop: 8,
        paddingTop: 6,
        borderTopColor: Color.lavender,
        borderTopWidth: pixel,
    },
    detailsText: {
        fontSize: 12,
        color: Color.lightBack,
        lineHeight: 20,
    },
});