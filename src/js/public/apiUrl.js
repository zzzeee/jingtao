/**
 * api url地址
 * @auther linzeyong
 * @date   2017.04.18
 */

var host = 'http://vpn.jingtaomart.com';
host = 'http://api.ub33.cn';

var urls = {
    homeMap: host + '/chinamap/index.html',
    getCityAndProduct: host + '/api/IndexNController/getProvincialInformationAndCities',
    getProductClassify: host + '/api/ClassificationNController/getClassificationByClassType',
    getPanicBuyingProductList: host + '/api/FindNController/getPanicBuyingActivityProductList',
    getFindShopList: host + '/api/FindNController/getFindShopAndProductsList',
};

urls.homeMap = 'http://ceshi.ub33.cn/newmap2/index.html';
urls.homeMap = 'file:///android_asset/newmap/index.html';

export default urls;