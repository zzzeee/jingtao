/**
 * 订单框架
 * @auther linzeyong
 * @date   2017.06.23
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import Utils from '../../public/utils';
import Urls from '../../public/apiUrl';
import { Size, PX, pixel, Color } from '../../public/globalStyle';
import Lang, {str_replace} from '../../public/language';
import Nothing from '../../other/ListNothing';
import OrderItem from './OrderItem';
import { EndView } from '../../other/publicEment';

export default class OrderComponent extends Component {
    // 默认参数
    static defaultProps = {
        orderType: null,
        get_list_ref: (ref)=>{},
    };
    // 参数类型
    static propTypes = {
        mToken: React.PropTypes.string.isRequired,
        orderType: React.PropTypes.number,
        get_list_ref: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            orders: null,
            load_or_error: null,
        };
        this.page = 1;
        this.pageNumber = 10;
        this.loadMoreLock = false;
    }

    componentDidMount() {
        this.loadOrderList();
    }

    //加载订单列表
    loadOrderList = (isHideLoad = false) => {
        let { mToken, orderType, } = this.props;
        if(mToken && !this.loadMoreLock) {
            this.loadMoreLock = true;
            Utils.fetch(Urls.getOrderList, 'post', {
                mToken: mToken,
                oStatus: orderType ? orderType : '',
                pPage: this.page,
                pPerNum: this.pageNumber,
            }, (result)=>{
                console.log(result);
                let obj = {
                    load_or_error: false,
                };
                if(result && result.sTatus == 1 && result.orderAry) {
                    let newOrders = result.orderAry || [];
                    let oldOrders = this.state.orders;
                    if(newOrders.length) {
                        this.page++;
                        this.loadMoreLock = false;
                        obj.orders = oldOrders ? oldOrders.concat(newOrders) : newOrders;
                        console.log(obj.orders);
                    }
                }
                this.setState(obj);
            }, (view)=>{
                this.setState({
                    load_or_error: view,
                });
            }, {
                loadType: 2,
                hideLoad: isHideLoad,
            });
        }
    };

    render() {
        let { navigation, get_list_ref, getListEment, notingString } = this.props;
        let { load_or_error, orders, } = this.state;
        return (
            <View style={styles.flex}>
                {load_or_error === null ? 
                    null :
                    (load_or_error ?
                        load_or_error :
                        (orders && orders.length ?
                            <FlatList
                                ref={get_list_ref}
                                data={orders}
                                contentContainerStyle={styles.flatListStyle}
                                keyExtractor={(item, index)=>(index)}
                                renderItem={this._renderItem}
                                onEndReached={()=>this.loadOrderList(true)}
                                ListFooterComponent={()=>{
                                    if(orders.length > 1) {
                                        return <EndView />;
                                    }else {
                                        return <View />;
                                    }
                                }}
                            /> :
                            <Nothing
                                navigation={navigation}
                                text={notingString}
                                get_list_ref={get_list_ref}
                                getListEment={getListEment}
                            />
                        )
                    )
                }
            </View>
        );
    }

    _renderItem = ({item, index}) => {
        let { mToken, navigation, } = this.props;
        return (
            <OrderItem
                mToken={mToken}
                navigation={navigation}
                orderInfo={item}
            />
        )
    };
}

var styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    flatListStyle: {
        backgroundColor: Color.lightGrey,
    },
});