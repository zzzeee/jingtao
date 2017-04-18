/**
 * APP首页入口
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    WebView,
    View,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Urls from '../public/apiUrl';
import { Size } from '../public/globalStyle';
import CityList from './CityList';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            provinceID : 31,
        };
    }

    render() {
        return (
            <ScrollView style={styles.scrollViewBox}>
                <View style={styles.webViewSize}>
                    <WebView
                        source={{uri: Urls.homeMap}}
                        style={styles.webViewSize}
                        onMessage={this._onMessage}
                        startInLoadingState ={true}
                    />
                </View>
                <CityList pid={this.state.provinceID} />
            </ScrollView>
        );
    }

    _onMessage = (e) => {
        let id = parseInt(e.nativeEvent.data) || 0;
        if(id > 0) {
            this.setState({
                provinceID: id,
            });
        }
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    scrollViewBox : {
        backgroundColor: '#ccc',
    },
    webViewSize: {
        width: Size.width,
        height: Size.height * 0.6,
    },
});