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
        color: '#4A4A4A',
        resizeMode: Image.resizeMode.contain,
    };
    // 参数类型
    static propTypes = {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        press: React.PropTypes.func,
        text: React.PropTypes.string,
    };
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let width = this.props.width ? this.props.width : 14;
        let height = this.props.height ? this.props.height : width;

        return (
            <TouchableOpacity style={[styles.iconBox, this.props.style]} onPress={this.props.press}>
                {this.props.src ? 
                    <Image source={this.props.src} resizeMode={this.props.resizeMode} style={[{
                        width: width,
                        height: height,
                    }, this.props.imageStyle]} />
                    : null
                }
                {this.props.text ? 
                    <Text style={[{
                        paddingLeft: 4,
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