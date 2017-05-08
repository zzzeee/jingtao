/**
 * 分享选项菜单
 * @auther linzeyong
 * @date   2017.05.02
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import { Size, pixel, Color, PX } from '../public/globalStyle';

export default class PayOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible || false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.visible) {
            this.setState({visible: true});
        }
    }

    hideModal = () => {
        this.setState({visible: false});
    };

    render() {
        let that = this;
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => {}}
            >
                <View style={styles.bodyStyle}>
                    <View style={styles.payBox}>
                        <View style={styles.rowBox1}>
                            <Text style={styles.titleText}>{Lang.cn.selectPayMethod}</Text>
                            <View style={styles.cancelView}>
                                <TouchableOpacity onPress={this.hideModal}>
                                <Image style={styles.cancelImage} source={require('../../images/close.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.rowBox2}>
                            <Text style={styles.defalutFont}>{Lang.cn.totalPayment}</Text>
                            <Text style={styles.redColor1}>{Lang.cn.RMB + '120.00'}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    defalutFont: {
        fontSize: 14,
        color: Color.lightBack,
    },
    redColor1: {
        fontSize: 14,
        color: Color.red,
    },
    redColor2: {
        fontSize: 12,
        color: Color.red,
    },
    bodyStyle: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'flex-end',
    },
    payBox: {
        backgroundColor: Color.lightGrey,
        flexDirection: 'column',
    },
    titleText: {
        fontSize: 16,
        color: Color.lightBack,
    },
    rowBox1: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: PX.marginTB,
        paddingLeft: PX.marginLR,
        backgroundColor: '#fff',
    },
    cancelView: {
        position: 'absolute',
        width: PX.iconSize26,
        height: PX.iconSize26,
        right: PX.marginLR,
        top: 12,
    },
    cancelImage: {
        width: PX.iconSize26,
        height: PX.iconSize26,
    },
    rowBox2: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: PX.marginTB,
        paddingLeft: PX.marginLR,
        paddingRight: PX.marginLR,
        backgroundColor: '#fff',
    },
});