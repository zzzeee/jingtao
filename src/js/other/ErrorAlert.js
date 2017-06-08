/**
 * 感叹号错误提示(适用于: 购物车，注册等)
 * @auther linzeyong
 * @date   2017.06.07
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    Animated,
} from 'react-native';

import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class ErrorAlert extends Component {
    // 默认参数
    static defaultProps = {
        message: '',
        visiable: false,
        type: 1,
    };
    // 参数类型
    static propTypes = {
        message: React.PropTypes.string.isRequired,
        visiable: React.PropTypes.bool.isRequired,
        hideModal: React.PropTypes.func,
        type: React.PropTypes.number,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
        };
        this.timer = null;
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    render() {
        if(this.props.visiable) {
            this.timer = setTimeout(this.props.hideModal, 2500);
        }
        let img = {};
        let type = this.props.type || 1;
        if(type == 1) {
            img = require('../../images/careful_big.png');
        }else if(type == 2) {
            img = require('../../images/success.png');
        }
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.props.visiable}
                onRequestClose={() => {
                    this.timer && clearTimeout(this.timer);
                }}
            >
                <TouchableOpacity 
                    style={modalStyle.modalBody} 
                    activeOpacity={1} 
                    onPress={this.props.hideModal} 
                    onLongPress={this.props.hideModal} 
                >
                    <View style={modalStyle.alertBody}>
                        <View style={modalStyle.alertIconView}>
                            <Image source={require('../../images/careful_big.png')} style={modalStyle.alertIcon} />
                        </View>
                        <Text style={modalStyle.alertMssage}>{this.props.message}</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}

var modalStyle = StyleSheet.create({
    modalBody: {
        width: Size.width,
        height: Size.height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBody: {
        width: 240,
        height: 132,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, .7)',
        alignItems: 'center',
    },
    alertIconView: {
        width: 50,
        height: 50,
        marginTop: 28,
        marginBottom: 14,
    },
    alertIcon: {
        width: 50,
        height: 50,
    },
    alertMssage: {
        fontSize: 16,
        color: '#fff',
    },
});