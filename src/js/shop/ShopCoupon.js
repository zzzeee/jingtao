/**
 * APP店铺 - 优惠券版块
 * @auther linzeyong
 * @date   2017.06.21
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import Swiper from 'react-native-swiper';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import CouponItem from '../other/CouponItem';
import { Size, pixel, Color, PX, errorStyles } from '../public/globalStyle';
import Lang, {str_replace} from '../public/language';

export default class ShopCoupon extends Component {
    // 默认参数
    static defaultProps = {
        coupons: [],
    };
    // 参数类型
    static propTypes = {
        coupons: React.PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            userCoupons: null,
        }
    }

    componentDidMount() {
        this.initDatas();
    }

    //初始化数据
    initDatas = () => {
        let that = this;
        let { mToken } = this.props;
        if(mToken) {
            Utils.fetch(Urls.getUserCoupons, 'post', {
                mToken: mToken,
            }, (result)=>{
                let _userCoupons = [];
                if(result && result.sTatus && result.couponAry) {
                    let coupons = result.couponAry || [];
                    for(let i in coupons) {
                        let id = coupons[i].hId || 0;
                        let stime = coupons[i].hStartTime || null;
                        let etime = coupons[i].hSendTime || null;
                        let ntime = new Date().getTime();
                        // let isable = coupons[i].isable || 0;
                        let _stime = new Date(that.checkTimeString(stime)).getTime();
                        let _etime = new Date(that.checkTimeString(etime)).getTime();
                        if(id > 0 && ntime > _stime && ntime < _etime) {
                            _userCoupons.push(id);
                        }
                    }
                }
                that.setState({
                    userCoupons: _userCoupons,
                });
            });
        }
    };

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

    render() {
        let { style, navigation, coupons, mToken, shopID, } = this.props;
        if(!coupons || coupons.length < 1 || !this.state.userCoupons) return null;
        return (
            <Image 
                source={require('../../images/find/coupon_bg.png')} 
                resizeMode="stretch" 
                style={[styles.couponBox, style]}
            >
                <Swiper
                    width={Size.width * 0.8}
                    height={160}
                    style={styles.wrapper}
                    horizontal={true}
                    showsPagination={true}
                    paginationStyle={styles.paginationStyle}
                    dot={(<View 
                        style={{
                            backgroundColor:'rgba(255, 255, 255, .3)',
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            margin: 5,
                        }}
                    />)}
                    activeDot={(<View 
                        style={{
                            backgroundColor:'rgba(255, 255, 255, .8)',
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            margin: 5,
                        }}
                    />)}
                    autoplay={true}
                    autoplayTimeout={3}
                    showsButtons={false}>
                    {coupons.map((item, index) => {
                        return (
                            <CouponItem 
                                key={index} 
                                width={Size.width * 0.8} 
                                type={1} 
                                coupon={item} 
                                navigation={navigation}
                                back={'Shop'}
                                backObj={{shopID: shopID}}
                                userid={mToken}
                                userCoupons={this.state.userCoupons}
                            />
                        );
                    })}
                </Swiper>
            </Image>
        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
    },
    paginationStyle: {
        position: 'absolute',
        left: 0,
        right: 0, 
        bottom: 0,
        height: 40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 10,
    },
    couponBox: {
        width: Size.width,
        height: 200,
        marginBottom: PX.marginTB,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});