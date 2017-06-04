/**
 * 数量增减控件
 * @auther linzeyong
 * @date   2017.06.04
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import InputText from '../public/InputText';
import { Size, PX, pixel, Color } from '../public/globalStyle';

export default class CtrlNumber extends Component {
    // 默认参数
    static defaultProps = {
        num: null,
        callBack: (n)=>{},
        checkFunc: (n)=>{ return n >= 0 ? true : false; },
        addFailFunc: (n)=>{},
    };
    // 参数类型
    static propTypes = {
        num: React.PropTypes.number.isRequired,
        callBack: React.PropTypes.func, 
        checkFunc: React.PropTypes.func,
        addFailFunc: React.PropTypes.func,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            number: null,
        };
    }

    componentWillMount() {
        if(this.props.num) {
            this.setState({
                number: this.props.num,
            })
        }
    }

    // 改变商品数量
    changeNumber = async (_number) => {
        let number = parseInt(_number) || 0;
        let isAdd = await this.props.checkFunc(number);
        if(isAdd === false) {
            this.props.addFailFunc(number);
        }else {
            this.setState({number: number }, () => {
                this.props.callBack(number);
            });
        }
    }

    render() {
        return (
            <View style={styles.ctrlNumberBox}>
                <TouchableOpacity 
                    style={[styles.btnCtrlNumber, {borderRightWidth: 1}]}
                    onPress={()=>{this.changeNumber(this.state.number - 1)}}
                >
                    <Text style={styles.btnCtrlNumberText}>-</Text>
                </TouchableOpacity>
                <InputText
                    keyType="numeric"
                    vText={this.state.number + ''}
                    style={styles.btnCtrlNumberInput}
                    onChange={(txt)=>this.changeNumber(txt)}
                />
                <TouchableOpacity 
                    style={[styles.btnCtrlNumber, {borderLeftWidth: 1}]}
                    onPress={()=>{this.changeNumber(this.state.number + 1)}}
                >
                    <Text style={styles.btnCtrlNumberText}>+</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    ctrlNumberBox: {
        flexDirection: 'row',
        width: 80,
        height: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: Color.lavender,
        borderWidth: 1,
    },
    btnCtrlNumber: {
        width: 22,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Color.lavender,
        backgroundColor: Color.floralWhite,
    },
    btnCtrlNumberText: {
        color: Color.lightBack,
        fontSize: 11,
    },
    btnCtrlNumberInput: {
        width: 32,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
        color: Color.lightBack,
        fontSize: 11,
        padding: 0,
        borderWidth: 0,
        borderRadius: 0,
        textAlign: 'center',
    },
});