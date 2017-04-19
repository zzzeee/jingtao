import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import lang from '../public/language';
import BtnIcon from '../public/BtnIcon';
import { Size, pixel, Color } from '../public/globalStyle';

export default class FloatMenu extends Component {
    // 默认参数
    static defaultProps = {
        cityName: '',
        visible: false,
    };
    // 参数类型
    static propTypes = {
        cityName: React.PropTypes.string,
        visible: React.PropTypes.bool,
    };
    constructor(props) {
        super(props);

        this.renderObject = this.renderObject.bind(this);
        this.buttons = [{
            'title' : lang['cn']['shareCity'].replace(/%s/, this.props.cityName),
            'icon' : require('../../images/share.png'),
            'detail' : '',
            'press' : null,
        }, {
            'title' : lang['cn']['sellSpecialty'],
            'icon' : require('../../images/partner.png'),
            'detail' : lang['cn']['sellSpecialty_txt'],
            'press' : null,
        }, {
            'title' : lang['cn']['hide'].replace(/%s/, this.props.cityName),
            'icon' : require('../../images/hide.png'),
            'detail' : lang['cn']['hide_txt'].replace(/%s/, this.props.cityName),
            'press' : null,
        }];
    }

    render() {
        let pageY = this.props.pageY || 0;
        let menuH = this.buttons.length * 40 + 10;
        let top = 0, arrowUp = false, arrowDown = false;
        if(Size.height - pageY > menuH) {
            top = pageY;
            arrowUp = true;
        }else if(pageY > menuH) {
            top = pageY - menuH;
            arrowDown = true;
        }

        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {}}
            >
                <TouchableOpacity style={styles.btnBody} underlayColor='transparent' onPress={()=>{
                }} >
                    <View style={[styles.shareBox, {top : top}]}>
                        {arrowUp ? 
                        <View style={[styles.smallIconBox, {marginBottom : -5, justifyContent: 'flex-start'}]}>
                            <Icon name="sort-up" size={14} color="#fff" />
                        </View>
                        : null}
                        {this.buttons.map((tab, i) => this.renderObject(tab, i))}
                        {arrowDown ? 
                        <View style={[styles.smallIconBox, {marginTop : -5, justifyContent: 'flex-end'}]}>
                            <Icon name="sort-down" size={14} color="#fff" />
                        </View>
                        : null}
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    renderObject = (obj, i) => {
        let title = obj.title || '';
        let detail = obj.detail || '';

        return (
            <TouchableOpacity key={i} underlayColor='transparent' onPress={()=>{return false;}} >
                <View style={styles.shareRow}>
                    <Image source={obj.icon} style={styles.icon} />
                    <View style={styles.textBox}>
                        <Text numberOfLines={1} style={styles.bigText}>{title}</Text>
                        <Text numberOfLines={1} style={styles.smallText}>{detail}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    btnBody: {
        width: Size.width,
        height: Size.height,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    shareBox: {
        position: 'absolute',
        left: 0,
        borderRadius: 5,
        width: Size.width - 20,
        marginLeft: 10,
        backgroundColor: '#fff',
    },
    shareRow: {
        flex: 1,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: pixel,
        borderColor: Color.appColor13,
    },
    icon: {
        width: 26,
        height: 26,
        marginLeft: 16,
        marginRight: 16,
    },
    textBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    smallIconBox: {
        height: 10,
        alignItems: 'flex-end',
        paddingRight : 20,
        paddingTop: 6,
        paddingBottom: 6,
    },
    bigText: {
        alignItems: 'center',
        fontSize: 16,
        color: Color.appColor8,
    },
    smallText: {
        fontSize: 13,
        color: Color.appColor9,
    },
});