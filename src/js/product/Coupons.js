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

import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import CouponItem from '../other/CouponItem';

export default class Areas extends Component {
    // 默认参数
    static defaultProps = {
        isShow: false,
        coupons: [],
    };
    // 参数类型
    static propTypes = {
        gid: React.PropTypes.number.isRequired,
        isShow: React.PropTypes.bool.isRequired,
        coupons: React.PropTypes.array.isRequired,
        hideCouponBox: React.PropTypes.func,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
        };
    }

    componentWillMount() {
        if(this.props.coupons && this.props.gid) {
            this.setState({
                datas: this.props.coupons,
            });
        }
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
                    province: {
                        index: index,
                        id: id,
                        name: name
                    }
                });
            }
        }
    };

    render() {
        let { isShow, hideCouponBox, } = this.props;
        if(!isShow) return null;
        let that = this;
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={isShow}
                onRequestClose={() => {
                }}
            >
                <View style={styles.modalHtml}>
                    <View style={styles.modalBody}>
                        <View style={styles.fristRow}>
                            <Text style={styles.txtStyle1}>{Lang[Lang.default].selectDistributionArea}</Text>
                            <TouchableOpacity onPress={hideCouponBox} style={styles.rowCloseBox}>
                                <Image style={styles.rowCloseImg} source={require('../../images/close.png')} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {this.state.datas.map((item, index) => {
                                return (
                                    <CouponItem
                                        key={index}
                                        type={2}
                                        style={styles.couponRow}
                                        width={Size.width * 0.907}
                                        coupon={item}
                                    />);
                            })}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
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
    couponRow: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: PX.marginTB,
    },
});