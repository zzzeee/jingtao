/**
 * 商品详情 - 优惠券列表
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

import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, PX, pixel, Color } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';
import CouponItem from '../other/CouponItem';

export default class Coupons extends Component {
    // 默认参数
    static defaultProps = {
        isShow: false,
        coupons: [],
    };
    // 参数类型
    static propTypes = {
        isShow: React.PropTypes.bool.isRequired,
        coupons: React.PropTypes.array.isRequired,
        hideCouponBox: React.PropTypes.func,
    };
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            userCoupons: null,  //已领取过的优惠券
        };
        this._userCoupons = [];
    }

    componentWillMount() {
        if(this.props.coupons) {
            this.setState({
                datas: this.props.coupons,
            });
        }
    }

    componentDidMount() {
        let { userid, type } = this.props;
        let that = this;
        if(userid && type != 3) {
            Utils.fetch(Urls.getUserCoupons, 'post', {
                mToken: userid,
                cUse: 1,
                cStatus: 1,
            }, (result) => {
                if(result && result.sTatus && result.couponAry) {
                    let datas = result.couponAry || [];
                    let coupons = [];
                    for(let i in datas) {
                        let id = datas[i].hId || 0;
                        let isUse = (datas[i].mhuse && datas[i].mhuse != '0') ? true : false;
                        let stime = datas[i].hStartTime || null;
                        let etime = datas[i].hSendTime || null;
                        let ntime = new Date().getTime();
                        stime = that.checkTimeString(stime);
                        etime = that.checkTimeString(etime);
                        let _stime = new Date(that.checkTimeString(stime)).getTime();
                        let _etime = new Date(that.checkTimeString(etime)).getTime();
                        if(id > 0 && !isUse && ntime < _etime) {
                            coupons.push(id);
                        }
                    }
                    that._userCoupons = coupons;
                    that.setState({
                        userCoupons: coupons,
                    });
                }
            });
        }
    }

    //检查时间是否带有时分秒
    checkTimeString = (t) => {
        if(t) {
            let str = t.replace(/-/g, "/") || '';
            if(str && str.length <= 10 && str.indexOf(':') < 0) {
                str = str + ' 00:00:00';
            }
            return str
        }
        return t;
    };

    addCoupon = (id) => {
        let _id = parseInt(id) || 0;
        if(_id > 0) {
            let list = this._userCoupons || [];
            let isok = true;
            for(let i in list) {
                if(_id == list[i]) {
                    isok = false;
                    break;
                }
            }
            if(isok) {
                list.push(_id);
                this._userCoupons = list;
            }
        }
    };

    render() {
        let {
            type,
            isShow, 
            hideCouponBox, 
            userid, 
            navigation, 
            back, 
            backObj,
            callback,
            userCoupons,
        } = this.props;
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
                    <View style={styles.flex}>
                        <TouchableOpacity style={styles.flex} activeOpacity={1} onPress={hideCouponBox} />
                    </View>
                    <View style={styles.modalBody}>
                        <View style={styles.fristRow}>
                            <Text style={styles.txtStyle1}>{Lang[Lang.default].receiveCoupon}</Text>
                            <TouchableOpacity onPress={hideCouponBox} style={styles.rowCloseBox}>
                                <Image style={styles.rowCloseImg} source={require('../../images/close.png')} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {this.state.datas.map((item, index) => {
                                return (
                                    <CouponItem
                                        key={index}
                                        type={type ? type : 2}
                                        userid={userid}
                                        style={styles.couponRow}
                                        width={Size.width * 0.907}
                                        coupon={item}
                                        userCoupons={userCoupons ? userCoupons : that.state.userCoupons}
                                        callback={callback ? callback : that.addCoupon}
                                        back={back}
                                        backObj={backObj}
                                        navigation={navigation}
                                        hideCouponBox={hideCouponBox}
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
    couponRow: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: PX.marginTB,
    },
});