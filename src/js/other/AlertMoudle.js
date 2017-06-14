/**
 * 提示框组件(适用： 购物车，提交订单删除提醒等)
 * @auther linzeyong
 * @date   2017.05.18
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
} from 'react-native';

import { Size, PX, pixel, Color } from '../public/globalStyle';

export default class AlertMoudle extends Component {
    // 默认参数
    static defaultProps = {
        visiable: false,
        leftColor: '#fff',
        rightColor: Color.lightBack,
        leftBgColor: Color.mainColor,
        rightBgColor: '#ddd',
    };
    // 参数类型
    static propTypes = {
        visiable: React.PropTypes.bool.isRequired,
        text: React.PropTypes.string,
        leftText: React.PropTypes.string,
        leftClick: React.PropTypes.func,
        leftColor: React.PropTypes.string,
        leftBgColor: React.PropTypes.string,
        rightText: React.PropTypes.string,
        rightClick: React.PropTypes.func,
        rightColor: React.PropTypes.string,
        rightBgColor: React.PropTypes.string,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { 
            visiable, 
            text, 
            leftText, 
            leftClick,
            leftColor,
            leftBgColor,
            rightText, 
            rightClick,
            rightColor,
            rightBgColor,
         } = this.props;
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={visiable}
                onRequestClose={() => {
                }}
            >
                <View style={styles.modalHtml}>
                    <View style={styles.modalBody}>
                        <View style={styles.alertTextView}>
                            <Text style={styles.alertText}>{text}</Text>
                        </View>
                        <View style={styles.bottonsBox}>
                            <TouchableOpacity style={[styles.leftBottonStyle, {
                                backgroundColor: leftBgColor,
                            }]} onPress={leftClick} activeOpacity={1}>
                                <Text style={[styles.leftBottonText, {color: leftColor}]}>{leftText}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.rightBottonStyle, {
                                backgroundColor: rightBgColor,
                            }]} onPress={rightClick} activeOpacity={1}>
                                <Text style={[styles.rightBottonText, {color: rightColor}]}>{rightText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    modalHtml: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    modalBody: {
        width: Size.width * 0.8,
        height: 180,
    },
    alertTextView: {
        height: 130,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    alertText: {
        fontSize: 16,
        color: Color.lightBack,
    },
    bottonsBox: {
        height: 50,
        flexDirection : 'row',
        borderTopWidth: pixel,
        borderTopColor: Color.lavender,
    },
    leftBottonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 5,
    },
    leftBottonText: {
        fontSize: 16,
    },
    rightBottonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 5,
        borderLeftWidth: pixel,
        borderLeftColor: Color.lavender,
    },
    rightBottonText: {
        fontSize: 16,
    },
});