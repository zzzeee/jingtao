/**
 * api url地址
 * @auther linzeyong
 * @date   2017.04.18
 */

var host = 'http://vpn.jingtaomart.com';
host = 'http://api.jingtaomart.com';

var urls = {
    //服务器地址
    host: host,
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
    getCityProductList: host + '/api/ProductController/getProductListByParameter',
    //获取城市的店铺列表
    getCityShopList: host + '/api/ShopNController/getCityShopListByParame',
    //获取商品详情
    getProductInfo: host + '/api/ProductNController/getProductInfoByProID',
    //获取图文详情
    getProductDetails: host + '/api/ProductController/getProductDetailInfoByProID?gID=',
    //获取推荐商品列表
    getRecommendList: host + '/api/ProductNController/getRecommendedProductsList',
    //获取指定地区的运费
    getProductFreight: host + '/api/ProductNController/getProductFreightByProvinceID',
    //添加商品到购物车
    addCarProduct: host + '/api/ShoppingCartController/productShoppingCartInsert',
    //获取购物车信息
    getCarInfo: host + '/api/ShoppingCartController/getMemberShopCartProductList',
    //登录验证
    checkUser: host + '/api/MemberNController/checkMemberLoginStatus',
    //发送验证码
    sendCode: host + '/api/RegisterNController/sendRegisterMessage',
    //用户注册
    userRegister: host + '/api/RegisterNController/registerMemberInfoAdd',
};

export default urls;