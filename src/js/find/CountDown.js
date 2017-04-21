/**
 * 发现模块 - 限时抢购 - 倒计时
 * @auther linzeyong
 * @date   2017.04.21
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import { Size, Color } from '../public/globalStyle';
import Lang from '../public/language';

export default class CountDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animate: false,
            days: null,
            hours: null,
            minutes: null,
            seconds: null,
        };

        this.timer = null;
    }

    componentDidMount() {
        if(this.props.ExpireTime) {
            let time = new Date(this.props.ExpireTime).getTime();
            if(time > new Date().getTime()) {
                this.calculationTime(time);
            }
        }
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    render() {
        if(!this.state.animate) return null;
        //天数模块
        let dayItem = this.create_item(this.state.days);
        //小时模块
        let hourItem = this.create_item(this.state.hours);
        //分钟模块
        let minuteItem = this.create_item(this.state.minutes);
        //秒数模块
        let secondItem = this.create_item(this.state.seconds);
        return (
            <View style={styles.container}>
                <Text style={styles.txtSurplus}>{Lang.cn.Surplus}</Text>
                {dayItem}
                {dayItem ? <Text style={styles.numberUnit}>{Lang.cn.day}</Text> : null}
                {hourItem}
                {hourItem ? <Text style={styles.numberUnit}>{Lang.cn.hour}</Text> : null}
                {minuteItem}
                {minuteItem ? <Text style={styles.numberUnit}>{Lang.cn.minute}</Text> : null}
                {secondItem}
                {secondItem ? <Text style={styles.numberUnit}>{Lang.cn.second}</Text> : null}
            </View>
        );
    }

    create_item = (number) => {
        if(number) {
            let list = [];
            for(let n in number) {
                if(!isNaN(Number(n))) {
                    let num = Number(number[n]) || 0;
                    num = isNaN(num) ? 0 : num;
                    if(num > 0 || (num == 0 && list.length > 0) || number == this.state.seconds) {
                        list.push(num);
                    }
                }
            }

            if(list.length > 0) {
                let item = list.map((n, i)=>{
                    return <Text key={i} style={styles.numberBlock}>{n}</Text>;
                });
                return item;
            }
        }
        return null;
    };

    //倒计时
    calculationTime = (etime) => {
        let ntime = new Date().getTime();
        if(etime > ntime) {
            let ctime = etime - ntime;  //时间差
            //相差的天数
            let days = Math.floor(ctime / (24 * 3600 * 1000));
            //相差的小时
            let leave1 = ctime % (24 * 3600 * 1000);    //去除天数后余出来的毫秒数
            let hours = Math.floor(leave1/(3600 * 1000));
            //相差的分钟
            let leave2 = leave1 % (3600 * 1000);        //去除小时后余出来的毫秒数
            let minutes = Math.floor(leave2 / (60*1000));
            //相差的秒数
            let leave3 = leave2 % (60 * 1000);          //去除分钟后余出来的毫秒数
            let seconds = Math.round(leave3 / 1000);
            let that = this;
            if(!days && !hours && !minutes && !seconds) {
                this.setState({animate: false});
            }else {
                this.setState({
                    animate: true,
                    days: new String(days),
                    hours: new String(hours),
                    minutes: new String(minutes),
                    seconds: new String(seconds),
                });
                that.timer = setTimeout(() => { 
                    that.calculationTime(etime);
                }, 999);
            }
        }else {
            this.setState({animate: false});
        }
    };
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtSurplus: {
        fontSize: 16,
        paddingRight: 5,
        color: Color.mainColor,
    },
    numberBlock: {
        color: '#fff',
        backgroundColor: Color.red,
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 1,
        paddingBottom: 1,
        fontSize: 12,
        margin: 2,
        borderRadius: 2,
        fontWeight: 'bold'
    },
    numberUnit: {
        fontSize: 12,
        marginRight: 2,
    },
});