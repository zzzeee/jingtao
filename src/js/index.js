/**
 * 导航管理
 * @auther linzeyong
 * @date   2017.04.27
 */
import React, { Component } from 'react';
import {
    StatusBar,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import { StackNavigator } from 'react-navigation';
import { Color, PX } from './public/globalStyle';
import JPushModule from 'jpush-react-native';

import Welcome from './welcome';
// import TabNavScreen from './tabNav';
import TabView from './tabView';
import Login from './login';
import LoginWord from './login/LoginWord';
import Register from './login/register';
import FrogetPass from './login/FrogetPass';
import Product from './product';
import Search from './home/search';
import CityGoodShopList from './home/CityGoodShopList';
import MyIntegral from './personal/MyIntegral';
import IntegralRule from './personal/IntegralRule';
import AddOrder from './car/AddOrder';
import Coupon from './car/Coupon';
import OrderHelp from './car/OrderHelp';
import OrderNotify from './car/OrderNotify';
import AddressList from './personal/AddressList';
import AddressAdd from './personal/AddressAdd';
import CouponList from './personal/CouponList';
import Collection from './personal/Collection';
import MyOrder from './personal/Order';
import OrderDetail from './personal/Order/OrderDetail';
import OrderLogistics from './personal/Order/OrderLogistics';
import Join from './personal/Join';
import About from './personal/About';
import Help from './personal/Help/';
import HelpPrivacy from './personal/Help/privacy';
import HelpTransaction from './personal/Help/transaction';
import SetApp from './personal/SetApp';
import ProductList from './class/ProductList';
import Shop from './shop';
import ShopSearch from './shop/ShopSearch';
import Banner from './find/PufaBanner';
import LoginExplain from './find/LoginExplain';

//显示格式
class MyNavScren extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        JPushModule.notifyJSDidLoad();
        JPushModule.addReceiveCustomMsgListener((map) => {
            console.log("addReceiveCustomMsgListener: ");
            console.log(map);
        });
        JPushModule.addReceiveNotificationListener((map) => {
            //收到通知
            console.log("收到通知 addReceiveNotificationListener: ");
            console.log(map);
        });
        JPushModule.addReceiveOpenNotificationListener((map) => {
            //打开通知
            console.log("打开通知 addReceiveOpenNotificationListener: ");
            console.log(map);
        });
        JPushModule.addGetRegistrationIdListener((registrationId) => {
            console.log("addGetRegistrationIdListener: ");
            console.log("Device register succeed, registrationId " + registrationId);
        });
    }

    componentWillUnmount() {
        JPushModule.removeReceiveCustomMsgListener();
        JPushModule.removeReceiveNotificationListener();
        JPushModule.removeReceiveOpenNotificationListener();
        JPushModule.removeGetRegistrationIdListener();
    }

    render() {
        let { navigation, NavScreen } = this.props;
        // let { router, screen } = NavScreen;      //不可用
        // let { router, screen } = Login;          //不可用
        // let { router, screen } = TabNavScreen;   //可用
        // console.log(TabNavScreen);
        // console.log(router);
        // console.log(screen);
        // console.log(router2);
        // console.log(screen2);
        /**
         * router = {
         *   getActionForPathAndParams: function getActionForPathAndParams(path, params),
         *   getComponentForRouteName: function getComponentForRouteName(routeName),
         *   getComponentForState: function getComponentForState(state),
         *   getPathAndParamsForState: function getPathAndParamsForState(state),
         *   getScreenConfig: function (),
         *   getScreenOptions: function (navigation, screenProps),
         *   getStateForAction: function getStateForAction(action, inputState),
         * }
         */
        let isShowStatu = NavScreen.name == 'Shop' ? false : true;
        return (
            <View style={styles.flex}>
                <StatusBar hidden={!isShowStatu} backgroundColor={Color.mainColor} barStyle="light-content" />
                <View style={[styles.container, {
                    marginTop: (isShowStatu && Platform.OS === 'ios') ? PX.statusHeight : 0,
                }]}>
                    <NavScreen navigation={navigation} />
                </View>
            </View>
        );
    }
}


//欢迎页
const WelcomeScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Welcome} />
);

//首页主页
const TabNavScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={TabView} />
);

//登录
const LoginScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Login} />
);

//登录 - 用户须知
const LoginWordScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={LoginWord} />
);

//注册
const RegisterScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Register} />
);

//忘记密码
const FrogetPassScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={FrogetPass} />
);

//首页 - 搜索页
const SearchScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Search} />
);

//首页 - 城市的商品、店铺列表
const CityGoodShopListScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={CityGoodShopList} />
);

//商品详情页
const ProductScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Product} />
);

//个人中心 - 我的积分
const MyIntegralScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={MyIntegral} />
);

//个人中心 - 我的积分 - 积分规则
const IntegralRuleScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={IntegralRule} />
);

//个人中心 - 我的地址
const AddressListScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={AddressList} />
);

//个人中心 - 我的地址 - 新增地址
const AddressAddScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={AddressAdd} />
);

//个人中心 - 我的优惠券
const CouponListScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={CouponList} />
);

//个人中心 - 我的收藏
const CollectionScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Collection} />
);

//个人中心 - 我的订单
const MyOrderScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={MyOrder} />
);

//个人中心 - 我的订单 - 订单详情
const OrderDetailScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={OrderDetail} />
);

//个人中心 - 我的订单 - 订单详情 - 物流信息
const OrderLogisticsScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={OrderLogistics} />
);

//个人中心 - 商家入驻
const JoinScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Join} />
);

//个人中心 - 联系方式
const AboutScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={About} />
);

//个人中心 - 帮助中心
const HelpScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Help} />
);

//个人中心 - 帮助中心 - 个人隐私保护
const PrivacyScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={HelpPrivacy} />
);

//个人中心 - 帮助中心 - 交易条款
const TransactionScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={HelpTransaction} />
);

//个人中心 - 设置
const SetAppScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={SetApp} />
);

//购物车 - 提交订单
const AddOrderScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={AddOrder} />
);

//购物车 - 提交订单 - 选择优惠券
const CouponScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Coupon} />
);

//购物车 - 提交订单 - 订单帮助
const OrderHelpScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={OrderHelp} />
);

//购物车 - 提交订单 - 支付完成
const OrderNotifyScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={OrderNotify} />
);

//特产分类
const ProductListScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={ProductList} />
);

//店铺页
const ShopScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Shop} />
);

//店铺页 - 搜索
const ShopSearchScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={ShopSearch} />
);

//发现页 - 广告页
const BannerScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={Banner} />
);

//发现页 - 广告页 - 登录说明
const LoginExplainScreen = ({ navigation }) => (
    <MyNavScren navigation={navigation} NavScreen={LoginExplain} />
);

const AppNavigator = StackNavigator({
    Welcome: {
        screen: WelcomeScreen,
    },
    TabNav: {
        screen: TabNavScreen,
    },
    Login: {
        screen: LoginScreen,
    },
    LoginWord: {
        screen: LoginWordScreen,
    },
    Register: {
        screen: RegisterScreen,
    },
    FrogetPass: {
        screen: FrogetPassScreen,
    },
    Product: {
        screen: ProductScreen,
    },
    Search: {
        screen: SearchScreen,
    },
    CityGoodShopList: {
        screen: CityGoodShopListScreen,
    },
    MyIntegral: {
        screen: MyIntegralScreen,
    },
    IntegralRule: {
        screen: IntegralRuleScreen,
    },
    AddOrder: {
        screen: AddOrderScreen,
    },
    CouponList: {
        screen: CouponListScreen,
    },
    Coupon: {
        screen: CouponScreen,
    },
    OrderHelp: {
        screen: OrderHelpScreen,
    },
    Collection: {
        screen: CollectionScreen,
    },
    MyOrder: {
        screen: MyOrderScreen,
    },
    OrderDetail: {
        screen: OrderDetailScreen,
    },
    OrderLogistics: {
        screen: OrderLogisticsScreen,
    },
    OrderNotify: {
        screen: OrderNotifyScreen,
    },
    AddressList: {
        screen: AddressListScreen,
    },
    AddressAdd: {
        screen: AddressAddScreen,
    },
    Join: {
        screen: JoinScreen,
    },
    About: {
        screen: AboutScreen,
    },
    Help: {
        screen: HelpScreen,
    },
    Privacy: {
        screen: PrivacyScreen,
    },
    Transaction: {
        screen: TransactionScreen,
    },
    SetApp: {
        screen: SetAppScreen,
    },
    ProductList: {
        screen: ProductListScreen,
    },
    Shop: {
        screen: ShopScreen,
    },
    ShopSearch: {
        screen: ShopSearchScreen,
    },
    Banner: {
        screen: BannerScreen,
    },
    LoginExplain: {
        screen: LoginExplainScreen,
    },
}, {
    initialRouteName: 'Welcome',
    headerMode: 'none',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
});

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
});

export default AppNavigator;