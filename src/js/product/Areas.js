/**
 * 商品详情 - 地区选择(用于运费计算)
 * @auther linzeyong
 * @date   2017.06.04
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

import PropTypes from 'prop-types';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class Areas extends Component {
    // 默认参数
    static defaultProps = {
        isShow: false,
    };
    // 参数类型
    static propTypes = {
        gid: PropTypes.number.isRequired,
        isShow: PropTypes.bool.isRequired,
        areas: PropTypes.array.isRequired,
        hideAreasBox: PropTypes.func,
        getSelectArea: PropTypes.func,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            selectIndex: 0,
            province: null,
            city: null,
        };
    }

    componentWillMount() {
        if(this.props.areas && this.props.gid) {
            this.setState({
                datas: this.props.areas,
            });
        }
    }

    componentDidMount() {
    }

    clickArea = (index, id, name) => {
        if(id && name) {
            let that = this;
            if(this.state.selectIndex > 0) {
                this.setState({
                    city: {
                        index: index,
                        id: id,
                        name: name
                    }
                }, () => {
                    Utils.fetch(Urls.getProductFreight, 'post', {
                        gID: this.props.gid, 
                        pID: this.state.province.id,
                    }, function(result) {
                        if(result && result.sTatus) {
                            let freight = result.pFreight ? parseFloat(result.pFreight) : 0;
                            that.props.getSelectArea(that.state.province, that.state.city, freight);
                        }
                    });
                });
            }else {
                this.setState({
                    selectIndex: 1,
                    city: null,
                    province: {
                        index: index,
                        id: id,
                        name: name
                    }
                });
            }
        }
    };

    changeAreaBox = (x) => {
        if(x == 1 && !this.state.province) return false;
        this.setState({selectIndex: x});
    };

    render() {
        let { isShow, hideAreasBox, getSelectArea, } = this.props;
        if(!isShow) return null;
        let that = this;
        let _datas = [];
        if(this.state.selectIndex == 1 && this.state.province) {
            _datas = this.state.datas[this.state.province.index].child || [];
        }else {
            _datas = this.state.datas;
        }
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={isShow}
                onRequestClose={() => {
                }}
            >
                <View style={styles.modalHtml}>
                    <View style={styles.flex}>
                        <TouchableOpacity style={styles.flex} activeOpacity={1} onPress={hideAreasBox} />
                    </View>
                    <View style={styles.modalBody}>
                        <View style={styles.fristRow}>
                            <Text style={styles.txtStyle1}>{Lang[Lang.default].selectDistributionArea}</Text>
                            <TouchableOpacity onPress={hideAreasBox} style={styles.rowCloseBox}>
                                <Image style={styles.rowCloseImg} source={require('../../images/close.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.secondRow}>
                            <TouchableOpacity onPress={()=>this.changeAreaBox(0)} style={[styles.btnTitle, {
                                backgroundColor: this.state.selectIndex > 0 ? Color.floralWhite : '#fff',
                            }]}>
                                <Text style={styles.txtStyle2}>{Lang[Lang.default].selectProvince}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.changeAreaBox(1)} style={[styles.btnTitle, {
                                backgroundColor: this.state.selectIndex > 0 ? '#fff' : Color.floralWhite,
                            }]}>
                                <Text style={styles.txtStyle2}>{Lang[Lang.default].selectCity}</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {_datas.map((item, index) => {
                                let id = item.region_id || null;
                                let name = item.region_name || null;
                                return (
                                    <TouchableOpacity key={index} style={styles.areaRow} onPress={()=>{
                                        that.clickArea(index, id, name);
                                    }}>
                                        <Text style={styles.txtStyle2}>{name}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    modalHtml: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, .3)',
    },
    modalBody: {
        height: Size.height * 0.65,
        backgroundColor: '#fff',
    },
    txtStyle1: {
        fontSize: 16,
        color: Color.lightBack,
    },
    txtStyle2: {
        fontSize: 14,
        color: Color.lightBack,
    },
    fristRow: {
        height: PX.rowHeight1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
    },
    rowCloseBox: {
        width: PX.iconSize26,
        height: PX.iconSize26,
        position: 'absolute',
        right: 10,
        top: 7,
    },
    rowCloseImg: {
        width: PX.iconSize26,
        height: PX.iconSize26,
    },
    secondRow: {
        height: PX.rowHeight2,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: 5,
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
    },
    btnTitle: {
        borderWidth: 1,
        borderColor: Color.lavender,
        borderBottomWidth: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        width: 93,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: -1,
    },
    areaRow: {
        flex: 1,
        height: 44,
        paddingLeft: 50,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Color.lavender,
    },
});