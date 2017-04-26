/**
 * 语言包
 * @auther linzeyong
 * @date   2017.04.18
 */

const language = {
    cn : {
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
    },
};

/**
 * 替换字符串
 * @param str string 包含替换字符的字符串
 * @param s   string 要替换的字符串
 */
export var str_replace = function (str, s) {
    return str.replace(/%s/, s);
};

export default language;