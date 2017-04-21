/**
 * 语言包
 * @auther linzeyong
 * @date   2017.04.18
 */

const language = {
    cn : {
        tab_home: '寻味',
        tab_find: '发现',
        tab_class: '分类',
        tab_car: '购物车',
        tab_personal: '我的',
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