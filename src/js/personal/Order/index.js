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

export default class MyOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mIntegral: null,
            mUserIntegral: null,
            datas: null,
        };
        this.mToken = null;
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
            let { mToken, } = params;
            this.mToken = mToken || null;
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
                        tabBarPosition='overlayTop'
                        // 选中的下划线颜色
                        tabBarUnderlineStyle={styles.tabUnderLine}
                        // 选中的文字颜色
                        tabBarActiveTextColor={Color.mainColor}
                        // 未选中的文字颜色
                        tabBarInactiveTextColor={Color.lightBack}
                        tabBarTextStyle={styles.tabTextStyle}
                    >
                        <View style={styles.flex} tabLabel={Lang[Lang.default].comprehensive}>
                        </View>
                        <View style={styles.flex} tabLabel={Lang[Lang.default].daifukuan}>
                        </View>
                        <View style={styles.flex}  tabLabel={Lang[Lang.default].daifahuo}>
                        </View>
                        <View style={styles.flex}  tabLabel={Lang[Lang.default].daishouhuo}>
                        </View>
                        <View style={styles.flex}  tabLabel={Lang[Lang.default].daipingjia}>
                        </View>
                    </ScrollableTabView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        backgroundColor: Color.lightGrey,
    },
    topBox: {
        backgroundColor: '#fff',
        marginTop: 10,
        paddingBottom: 30,
        marginBottom: 10,
    },
    tabBarStyle: {
        height: PX.rowHeight2,
    },
    tabBarItemStyle: {
        paddingBottom: 0,
        borderBottomWidth: pixel,
        borderBottomColor: 'red',
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