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
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Urls from '../public/apiUrl';
import { Size, Color } from '../public/globalStyle';
import PanicBuying from "./PanicBuying";

export default class FindScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <PanicBuying />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: Color.lightGrey,
    },
});