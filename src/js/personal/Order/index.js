/**
 * 个人中心 - 我的订单
 * @auther linzeyong
 * @date   2017.06.20
 */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
} from 'react-native';

import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Lang, {str_replace} from '../../public/language';
import { Size, Color, PX, pixel, FontSize } from '../../public/globalStyle';
import AppHead from '../../public/AppHead';
import BtnIcon from '../../public/BtnIcon';
import OrderPage from './OrderPage';

export default class MyOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selIndex: 0,
        };
        
        this.tabs = [{
            title: Lang[Lang.default].comprehensive,
            value: null,
        }, {
            title: Lang[Lang.default].daifukuan,
            value: -1,
        }, {
            title: Lang[Lang.default].daifahuo,
            value: 1,
        }, {
            title: Lang[Lang.default].daishouhuo,
            value: 3,
        }];
        this.mToken = null;
        this.listRefs = new Array(this.tabs.length);
    }

    componentWillMount() {
        this.initDatas();
    };

    componentDidMount() {
    }

    //初始化数据
    initDatas = () => {
        let { navigation } = this.props;
        if(navigation && navigation.state && navigation.state.params) {
            let params = navigation.state.params;
            let { mToken, index } = params;
            this.mToken = mToken || null;
            this.setState({
                selIndex: index ? index : 0,
            });
        }
    };

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.flex}>
                <AppHead
                    title={Lang[Lang.default].myOrder}
                    left={(<BtnIcon width={PX.headIconSize} press={()=>{
                            navigation.goBack(null);
                    }} src={require("../../../images/back.png")} />)}
                    onPress={()=>{
                        if(this.listRefs[this.state.selIndex]) {
                            this.listRefs[this.state.selIndex].scrollToOffset({offset: 0, animated: true});
                        }
                    }}
                />
                <View style={styles.flex}>
                    <ScrollableTabView
                        renderTabBar={() => <DefaultTabBar />}
                        ref={(_ref)=>this.scrollTabView=_ref}
                        style={styles.tabBarStyle}
                        tabStyle={styles.tabBarItemStyle}
                        // 默认打开第几个（0为第一个）
                        initialPage={this.state.selIndex}
                        //"top", "bottom", "overlayTop", "overlayBottom"
                        tabBarPosition='top'
                        // 选中的下划线颜色
                        tabBarUnderlineStyle={styles.tabUnderLine}
                        // 选中的文字颜色
                        tabBarActiveTextColor={Color.mainColor}
                        // 未选中的文字颜色
                        tabBarInactiveTextColor={Color.lightBack}
                        tabBarTextStyle={styles.tabTextStyle}
                        onChangeTab={(obj)=>{
                            this.setState({
                                selIndex: obj.i,
                            });
                        }}
                    >
                        {this.tabs.map((item, index)=>{
                            return (
                                <View key={index} style={styles.flex} tabLabel={item.title}>
                                    {this.getComponent(index, item.value)}
                                </View>
                            );
                        })}
                    </ScrollableTabView>
                </View>
            </View>
        );
    }

    getComponent = (id, val = null) => {
        if(this.state.selIndex == id) {
            let str = '';
            switch(id) {
                case 0:
                    str = Lang[Lang.default].yourNotShopping;
                    break;
                case 1:
                    str = Lang[Lang.default].yourNotDFKgood;
                    break;
                case 2:
                    str = Lang[Lang.default].yourNotDFHgood;
                    break;
                case 3:
                    str = Lang[Lang.default].yourNotDSHgood;
                    break;
            }
            return <OrderPage 
                mToken={this.mToken}
                navigation={this.props.navigation} 
                orderType={val}
                notingString={str}
                get_list_ref={(ement)=>this.listRefs[this.state.selIndex]=ement}
            />;
        }else {
            return null;
        }
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        backgroundColor: Color.lightGrey,
    },
    tabBarStyle: {
        height: PX.rowHeight2,
    },
    tabBarItemStyle: {
        paddingBottom: 0,
        borderBottomWidth: pixel,
        borderBottomColor: Color.lavender,
    },
    tabUnderLine: {
        height: 2,
        backgroundColor: Color.mainColor,
    },
    tabTextStyle: {
        fontSize: 14,
        paddingTop: 10,
    },
});