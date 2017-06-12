/**
 * 个人中心 - 我的优惠券
 * @auther linzeyong
 * @date   2017.06.12
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native';

import User from '../public/user';
import Urls from '../public/apiUrl';
import Utils from '../public/utils';
import { Size, Color, PX, pixel, FontSize } from '../public/globalStyle';
import AppHead from '../public/AppHead';
import Lang, {str_replace} from '../public/language';
import BtnIcon from '../public/BtnIcon';
import CouponItem from '../other/CouponItem';

var _User = new User();

export default class CouponList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coupons: [],
        };
        this.mToken = null;
    }

    componentDidMount() {
        this.initDatas();
    }

    initDatas = (use = null, expire = null) => {
        // if(!this.mToken) {
        //     this.mToken = await _User.getUserID(_User.keyMember);
        // }
        // let uCoupons = await this.getUserCoupons(use, expire);
        // // console.log(uCoupons);
        // this.setCouponList(uCoupons);
        let that = this;
        Utils.fetch(Urls.getUserCoupons, 'post', {
            mToken: '6AFDA0482920705B99742B9683E6F3DB',
        }, (result)=>{
            console.log(result);
            if(result && result.sTatus && result.couponAry) {
                let coupons = result.couponAry || [];
                that.setState({ coupons });
            }
        });
    };

    //获取用户的优惠券
    getUserCoupons = (use, expire) => {
        if(this.mToken) {
            let obj = {mToken: this.mToken};
            if(use) obj.cUse = use;
            if(expire) obj.cStatus = expire;
            return Utils.async_fetch(Urls.getUserCoupons, 'post', obj);
        }else {
            return null;
        }
    };

    setCouponList = (datas) => {
        if(datas && datas.sTatus && datas.couponAry) {
            let coupons = datas.couponAry || [];
            this.setState({ coupons });
        }
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <AppHead
                    title={Lang[Lang.default].myCoupons}
                    left={<BtnIcon width={PX.headIconSize} press={()=>{
                         navigation.goBack(null);
                    }} src={require("../../images/back.png")} />}
                    onPress={() => {
                        this.ref_flatList && this.ref_flatList.scrollToOffset({offset: 0, animated: true});
                    }}
                />
                {this.state.coupons?
                    <FlatList
                        ref={(_ref)=>this.ref_flatList=_ref} 
                        data={this.state.coupons}
                        contentContainerStyle={styles.flatListStyle}
                        keyExtractor={(item, index) => (index)}
                        enableEmptySections={true}
                        renderItem={this._renderItem}
                        ListHeaderComponent={this.pageHead}
                    />
                    : null
                }
            </View>
        );
    }

    _renderItem = ({item, index}) => {
        return (
            <View style={styles.couponRow}>
            <CouponItem
                type={2}
                width={Size.width * 0.907}
                coupon={item}
            />
            </View>
        );
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Color.lightGrey,
    },
    flatListStyle: {
        backgroundColor: '#fff',
    },
    couponRow: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: PX.marginLR,
    },
});