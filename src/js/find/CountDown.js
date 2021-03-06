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

import PropTypes from 'prop-types';
import { Size, Color } from '../public/globalStyle';
import Lang from '../public/language';

export default class CountDown extends Component {
    // 默认参数
    static defaultProps = {
        startTime: Date.now(),
        nowTime: Date.now(),
    };
    // 参数类型
    static propTypes = {
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
        nowTime: PropTypes.number.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            animate: false,
            days: null,
            hours: null,
            minutes: null,
            seconds: null,
        };

        this.timer = [];
    }

    componentDidMount() {
        let {startTime, endTime, nowTime} = this.props;
        if(nowTime >= startTime && nowTime <= endTime) {
            this.calculationTime(endTime, nowTime, 950);
        }
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        // this.timer && clearTimeout(this.timer);
        let timers = this.timer;
        for(let t of timers) {
            clearTimeout(t);
        }
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
                <Text style={styles.defaultFont}>{Lang[Lang.default].Surplus}</Text>
                {dayItem}
                {dayItem ? <Text style={styles.defaultFont}>{Lang[Lang.default].day}</Text> : null}
                {hourItem}
                {hourItem ? <Text style={styles.defaultFont}>{Lang[Lang.default].hour}</Text> : null}
                {minuteItem}
                {minuteItem ? <Text style={styles.defaultFont}>{Lang[Lang.default].minute}</Text> : null}
                {secondItem}
                {secondItem ? <Text style={styles.defaultFont}>{Lang[Lang.default].second}</Text> : null}
            </View>
        );
    }

    create_item = (number) => {
        if(number) {
            let list = [];
            for(let n in number) {
                if(!isNaN(Number(number[n]))) {
                    // 前缀不加0
                    // let num = Number(number[n]) || 0;
                    // num = isNaN(num) ? 0 : num;
                    // if(num > 0 || (num == 0 && list.length > 0) || number == this.state.seconds) {
                    //     list.push(num);
                    // }

                    // 前缀加0
                    list.push(number[n]);
                }
            }

            if(list.length > 0) {
                let item = list.map((n, i)=>{
                    return (
                        <View key={i} style={styles.numberBlockView}>
                            <Text style={styles.numberBlock}>{n}</Text>
                        </View>
                    );
                });
                return item;
            }
        }
        return null;
    };

    //生成字符串
    createString = (num) => {
        if(num < 10) {
            return '0' + num;
        }
        return String(num);
    };

    /**
     * 倒计时
     * @param etime number 结束时间戳
     * @param ntime number (服务器)当前时间
     * @param t     number 刷新频率
     */
    calculationTime = (etime, ntime, t) => {
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
            if(!days && !hours && !minutes && !seconds) {
                this.setState({animate: false});
            }else {
                this.setState({
                    animate: true,
                    days: this.createString(days),
                    hours: this.createString(hours),
                    minutes: this.createString(minutes),
                    seconds: this.createString(seconds),
                });
                let _timer = setTimeout(() => { 
                    this.calculationTime(etime, (ntime + t), t);
                }, t);
                this.timer.push(_timer);
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
    numberBlockView: {
        width: 12,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        backgroundColor: Color.mainColor,
        margin: 2,
    },
    numberBlock: {
        color: '#fff',
        fontSize: 11,
    },
    defaultFont: {
        fontSize: 14,
        color: Color.lightBack
    },
    numberUnit: {
        fontSize: 12,
        marginRight: 2,
    },
});