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
    //获取产品列表 (城市，店铺，分类)
    getProductList: host + '/api/ProductNController/getProductListByParame',
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
    //更新购物车商品数量
    addCarProductNumber: host + '/api/ShoppingCartController/memberShopCartProductNumEditByCartID',
    //删除购物车商品
    delCarProductNumber: host + '/api/ShoppingCartController/memberShopCartProductDeleteByCartID',
    //登录验证
    checkUser: host + '/api/MemberNController/checkMemberLoginStatus',
    //发送验证码
    sendCode: host + '/api/RegisterNController/sendRegisterMessage',
    //用户注册
    userRegister: host + '/api/RegisterNController/registerMemberInfoAdd',
    //收藏、取消收藏
    collection: host + '/api/MemberNController/memberFollowStatusEditBymID',
    //获取收藏列表
    getCollection: host + '/api/MemberNController/getMemberFollowListBymID',
    //批量收藏商品
    batchCollection: host + '/api/MemberNController/memberFollowProductListByPidAry',
    //修改用户登录密码
    updateUserPassword: host + '/api/MemberNController/memberPasswordEditByMID',
    //会员领取优惠券
    userGiveCoupon: host + '/api/CouponNController/memberReceiveCouponAdd',
    //获取城市图片及广告
    getCityImgBanner: host + '/api/AdsNController/getCityAdsByCityId',
    //获取用户的优惠券列表
    getUserCoupons: host + '/api/CouponNController/getMemberCouponListByMID',
    //获取商家的优惠券列表
    getShopCoupons: host + '/api/CouponNController/getShopProductCouponList',
    //获取用户的地址列表
    getUserAddressList: host + '/api/AddressNController/getMemberShopAddressListByMID',
    //获取所有的省市区
    getAllAreas: host + '/api/RegionNController/getMemberAddressAreaList',
    //添加用户地址
    addUserAddress: host + '/api/AddressNController/memberAddressAdd',
    //编辑用户地址
    editUserAddress: host + '/api/AddressNController/memberShopAddressEdit',
    //删除用户地址
    deleteUserAddress: host + '/api/AddressNController/memberShopAddressDeleteBySaID',
    //获取会员基本信息
    getUserInfo: host + '/api/MemberNController/getMemberInfoByToken',
    //获取积分信息及消费记录
    getIntegralData: host + '/api/MemberNController/getMemberIntegralRecord',
    //结算购物车商品
    confirmOrder: host + '/api/OrderNController/getConfirmOrderListByCartID',
    //提交订单
    updateOrder: host + '/api/OrderNController/memberGenerateOrder',
};

export default urls;