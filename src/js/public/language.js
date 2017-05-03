/**
 * 语言包
 * @auther linzeyong
 * @date   2017.04.18
 */

const language = {
    cn : {
        RMB: '¥',
        loading: '正在加载',
        reconnect: '点击重新连接',
        fetchError: '网络请求超时，请检查网络设置。',
        programError: '程序异常',
        logo: '登录',
        register: '注册',
        tab_home: '寻味',
        tab_find: '发现',
        tab_class: '特产分类',
        tab_car: '购物车',
        tab_personal: '个人中心',
        persional: '个人中心',
        goin: '进入',
        allSeller: '所有商家',
        sharePruduct: '分享特产',
        previewing: '正在浏览·%s',
        shareCity: '分享%s特产',
        sellSpecialty: '我要卖特产',
        sellSpecialty_txt: '联系我们卖出更多特产',
        hide: '隐藏%s',
        hide_txt: '在首页隐藏%s信息',
        discount: '%s折',
        guan: '馆',
        day: '天',
        hour: '时',
        minute: '分',
        second: '秒',
        Surplus: '剩余',
        jingtaoIntegral: '境淘积分 %s ',
        myOrder: '我的订单',
        viewAllOrder: '查看所有订单',
        daifukuan: '待付款',
        daifahuo: '待发货',
        daishouhuo: '待收货',
        shouhou: '售后/退款',
        myIntegral: '我的积分',
        personalIntegral: '个人积分',
        myWallet: '我的钱包',
        myCollection: '我的收藏',
        myAddress: '我的地址',
        contactUs: '联系我们',
        helpNote: '帮助说明',
        viewAll: '查看全部',
        youHave: '您还有',
        point: '点',
        untilToday: '到今天为止',
        saveYou: '已为您节省了',
        integralDetailed: '积分明细',
        integralRule: '积分规则',
        shareText: '等老子有了钱，买光这个城市的土特产给你看。',
        shareErrorAlert: '没有安装微信软件，请您安装微信之后再试',
        cancel: '取消',
        circleOfFriends: '朋友圈',
        wxFriends: '微信好友',
        missParam: '缺少参数',
        consignee: '收货人',
        distributionType: '配送方式',
        express: '快递',
        buyerMessage: '买家留言',
        buyerMessagePlaceholder: '选填，可填写与商品有关的其他要求。',
        totalProductNumberL: '共计 %s 件商品',
        total: '共计',
        coupon: '优惠券',
        haveCoupon: '有可用的优惠券',
        integralSwap: '积分抵现',
        canUseIntegral: '可用积分',
        fullSwap: "全额抵现",
        noUseSwap: '不使用抵现',
        diySwapIntegral: '自定义抵现积分',
    },
};

/**
 * 积分规则 包含标题和内容
 */
export const Rule = [{
    title: '境淘积分有什么用？',
    content: '境淘积分可以用来抵扣购物时的订单金额，1积分=1元钱，单次使用积分没有上限呦！O(∩_∩)O',
}, {
    title: '怎么样获取境淘积分',
    content: '1.境淘APP购物后，系统会根据订单金额返还一定的积分作为返利。\n2.在境淘APP办理浦发银行信用卡并绑定您的境淘账号后，会获得80个积分的奖励3.在境淘APP内购物时使用浦发信用卡进行支付后，会获得80个积分的奖励（只限一次）',
}, {
    title: '其它规则',
    content: '1.当您使用积分抵扣订单金额后，该订单将不赠送积分给您。\n2.积分两年一期，到期即清空所有积分。',
}];

/**
 * 替换字符串
 * @param str string 包含替换字符的字符串
 * @param s   string 要替换的字符串
 */
export var str_replace = function (str, s) {
    return str.replace(/%s/, s);
};

export default language;