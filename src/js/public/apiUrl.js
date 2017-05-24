/**
 * api url地址
 * @auther linzeyong
 * @date   2017.04.18
 */

var host = 'http://vpn.jingtaomart.com';
host = 'http://api.ub33.cn';

var urls = {
    //首页地图
    homeMap: 'file:///android_asset/newmap/index.html',
    //首页省份及城市的商品列表
    getCityAndProduct: host + '/api/IndexNController/getProvincialInformationAndCities',
    //获取分类
    getProductClassify: host + '/api/ClassificationNController/getClassificationByClassType',
    //获取限时抢购商品
    getPanicBuyingProductList: host + '/api/FindNController/getPanicBuyingActivityProductList',
    //获取发现频道的推荐商家及主推的三个商品
    getFindShopList: host + '/api/FindNController/getFindShopAndProductsList',
    //获取优惠券的图片
    getCouponImages: host + '/api/CouponNController/getCouponInfoByCouponID?couponID=',
    //获取城市的产品列表
    getProductList: host + '/api/ProductController/getProductListByParameter',
};

export default urls;