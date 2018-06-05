/**
 * 个人中心 - 帮助中心 - 个人隐私保护
 * @auther linzeyong
 * @date   2017.06.20
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

import Lang, {str_replace, Privacy} from '../../public/language';
import { Size, Color, PX, pixel, FontSize } from '../../public/globalStyle';
import AppHead from '../../public/AppHead';

export default class HelpPrivacy extends Component {
    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead
                    title={Lang[Lang.default].privacyProtection}
                    goBack={true}
                    navigation={this.props.navigation}
                />
                <ScrollView contentContainerStyle={styles.scrollStyle}>
                    <Text style={styles.defaultFont}>{Privacy}</Text>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    scrollStyle: {
        padding: 15,
        paddingTop: 20,
        backgroundColor: Color.floralWhite,
    },
    defaultFont: {
        fontSize: 14,
        color: Color.lightBack,
        lineHeight: 18,
    },
});