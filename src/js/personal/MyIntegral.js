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
    ScrollView,
} from 'react-native';

import Urls from '../public/apiUrl';
import { Size, Color, PX } from '../public/globalStyle';
import PersonalHead from './PersonalHead';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';

export default class MyIntegral extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <PersonalHead
                    title={Lang.cn.personalIntegral}
                    left={(<BtnIcon width={PX.headIconSize} src={require("../../images/back.png")} />)}
                />
            </ScrollView>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: Color.lightGrey,
    },
});