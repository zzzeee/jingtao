/**
 * 图标按钮
 * @auther linzeyong
 * @date   2017.04.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Image,
} from 'react-native';

export default class BtnIcon extends Component {
    // 默认参数
    static defaultProps = {
        size: 14,
    };
    // 参数类型
    static propTypes = {
        size: React.PropTypes.number,
        press: React.PropTypes.func,
        style: React.PropTypes.object,
        text: React.PropTypes.string,
        txtStyle: React.PropTypes.object
    };
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        if(!this.props.src) return null;
        let width = this.props.size ? this.props.size : 14;

        return (
            <TouchableOpacity style={[styles.iconBox, this.props.style]} onPress={()=>{
                if(this.props.press) {
                    this.props.press();
                }
            }}>
                <Image source={this.props.src} style={{
                    width: width,
                    height: width,
                }} />
                {this.props.text ? 
                    <Text style={[{
                        paddingLeft: 10,
                        color: this.props.color,
                        fontSize: this.props.size,
                    }, this.props.txtStyle]}>{this.props.text}</Text>
                    : null
                }
            </TouchableOpacity>
        );
    }
}

var styles = StyleSheet.create({
    iconBox: {
        padding : 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
});