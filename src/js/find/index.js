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
                    float={true}
                    occupy={true}
                    title={Lang.cn.tab_find}
                    right={(<BtnIcon style={styles.btnRight} width={PX.headIconSize} src={require("../../images/search.png")} />)}
                />
                <PanicBuying />
                <FetchTime />
            </View>
        );
    }
}

class FetchTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: null,
            endTime: null,
            chaTime: null,
            datas: {},
        };
    }

    render() {
        return (
        <View style={styles.flex}>
            <ScrollView>
                <Button title="获取数据" onPress={()=>{
                    let arr = [22, 16, 31, 26, 30, 21, 3, 11, 23, 24];
                    let _id = Math.floor(Math.random()*10);
                    let id = arr[_id], that=this, stime=null, etime=null;
                    // console.group('获取省份数据');
                    // console.time('测试时间');
                    // console.log(txt);
                    // console.log('开始时间：' + new Date());
                    stime = new Date();
                    fetch(Urls.getCityAndProduct, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: 'pID=' + id
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        // console.log(responseJson);
                        // console.log('结束时间：' + new Date());
                        // console.timeEnd('测试时间');
                        // console.groupEnd('获取省份数据');
                        console.log(responseJson);
                        etime = new Date();
                        that.setState({
                            startTime: stime.toString(),
                            endTime: etime.toString(),
                            chaTime: ((etime.getTime() - stime.getTime())/1000).toFixed(2),
                            datas: responseJson,
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                }} />
                <View>
                    <Text>{this.state.startTime}</Text>
                    <Text>{this.state.endTime}</Text>  
                    <Text>{this.state.chaTime}</Text>
                    <Text >{JSON.stringify(this.state.datas)}</Text>                  
                </View>
            </ScrollView>
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