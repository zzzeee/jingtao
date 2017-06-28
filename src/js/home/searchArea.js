/**
 * 提示框组件(适用： 购物车，提交订单删除提醒等)
 * @auther linzeyong
 * @date   2017.06.17
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';

import Lang, {str_replace} from '../public/language';
import { Size, PX, pixel, Color } from '../public/globalStyle';

export default class Area extends Component {
    // 默认参数
    static defaultProps = {
        visiable: false,
    };
    // 参数类型
    static propTypes = {
        visiable: React.PropTypes.bool.isRequired,
        areas: React.PropTypes.array,
        hideAreaBox: React.PropTypes.func,
        setSelectArea: React.PropTypes.func,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            selects: new Set(),
        };
    }

    render() {
        let { 
            visiable,
            areas,
            hideAreaBox,
            setSelectArea,
         } = this.props;
         if(!areas) return null;
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
                        <View style={styles.flex}>
                            <ScrollView contentContainerStyle={styles.scrollStyle}>
                                {areas.map(this.rendArea)}
                            </ScrollView>
                        </View>
                        <View style={styles.bottonsBox}>
                            <TouchableOpacity style={styles.leftBottonStyle} onPress={()=>{
                                this.setState({
                                    selects: new Set(),
                                }, ()=>{
                                    setSelectArea([]);
                                });
                            }} activeOpacity={1}>
                                <Text style={styles.leftBottonText}>{Lang[Lang.default].clear}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.rightBottonStyle} onPress={()=>{
                                setSelectArea(Array.from(this.state.selects));
                                hideAreaBox();
                            }} activeOpacity={1}>
                                <Text style={styles.rightBottonText}>{Lang[Lang.default].determine}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={hideAreaBox} style={styles.footBox}></TouchableOpacity>
                </View>
            </Modal>
        );
    }

    rendArea = (item, index) => {
        let selects = this.state.selects;
        let areaid = item.region_id || null;
        let areaname = item.region_name || '';
        let isSelect = selects.has(areaid);
        let color = isSelect ? Color.mainColor : Color.gainsboro;
        let bgColor = isSelect ? 'rgba(229, 86, 69, 0.1)' : '#fff';
        if(areaid) {
            return (
                <TouchableOpacity key={index} style={[styles.areaItem, {
                    borderColor: color,
                    backgroundColor: bgColor,
                }]} onPress={()=>{
                    if(isSelect) {
                        selects.delete(areaid);
                    }else {
                        selects.add(areaid);
                    }
                    this.setState({ selects });
                }}>
                    <Text numberOfLines={1} style={[styles.areaItemText, {
                        color: color,
                    }]}>{areaname}</Text>
                </TouchableOpacity>
            );
        }else {
            return null;
        }
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    modalHtml: {
        flex: 1,
    },
    modalBody: {
        width: Size.width,
        height: 250,
        borderTopColor: Color.gainsboro,
        borderTopWidth: pixel,
        marginTop: PX.headHeight + PX.rowHeight2,
        backgroundColor: '#fff',
    },
    scrollStyle: {
        flexDirection : 'row',
        flexWrap: 'wrap',
    },
    areaItem: {
        width: (Size.width - 70) / 3,
        height: 27,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Color.lightGrey,
        borderWidth: 1,
        borderRadius: 3,
        margin: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    areaItemText: {
        color: Color.gainsboro,
        fontSize: 11,
    },
    bottonsBox: {
        height: PX.rowHeight2,
        flexDirection : 'row',
        borderTopWidth: pixel,
        borderTopColor: Color.lavender,
    },
    leftBottonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftBottonText: {
        fontSize: 16,
        color: Color.lightBack,
    },
    rightBottonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: pixel,
        borderLeftColor: Color.lavender,
    },
    rightBottonText: {
        fontSize: 16,
        color: Color.lightBack,
    },
    footBox: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
});