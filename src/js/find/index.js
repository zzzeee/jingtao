/**
 * APP发现
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    ScrollView,
} from 'react-native';

import PanicBuying from "./PanicBuying";
import AppHead from '../public/AppHead';
import BtnIcon from '../public/BtnIcon';
import Urls from '../public/apiUrl';
import { Size, Color, PX } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class FindScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: null,
            endTime: null,
        };

        this.stime = null;
        this.etime = null;
    }

    render() {
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang.cn.tab_find}
                    right={(<BtnIcon style={styles.btnRight} width={PX.headIconSize} src={require("../../images/search.png")} />)}
                />
                <PanicBuying />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.lightGrey,
    },
});