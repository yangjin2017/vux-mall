import axios from 'axios'
import { default as CONSTANCE, API } from './constance.js'
import store from '../store'

export default {
  install (Vue, pluginOptions = {}) {
    // 配置请求地址域名信息
    axios.defaults.baseURL = CONSTANCE.DOMAIN

    /**
     * 获取本地缓存用户信息
     */
    function getUser () {
      var userId = window.localStorage.getItem('userId')
      var token = window.localStorage.getItem('token')
      return {
        userId: userId || '',
        token: token || ''
      }
    }

    const apiUrl = {
      // 获取商品详情
      [API.GOODSDETAIL]: params => [`app/mall-goods/goods/${params.goodsId}/message`],
      // 商品加入购物车
      [API.CART]: params => [`mall-user-shop-cart/users/${getUser().userId}/cart`, 'post'],
      // 扫描二维码登录
      [API.SCANLOGIN]: params => ['app-mall-scan/login'],
      // 商品列表
      [API.GOODS]: params => ['app/mall-goods/goods'],
      // 加载药械商品的分类
      [API.CATEGORYMEDICAL]: params => ['app/mall-platform-category/categories/medical'],
      // 加载普通商品的分类
      [API.CATEGORYORDINARY]: params => ['app/mall-platform-category/categories/ordinary'],
      // 加载商品二级分类
      [API.CATEGORIES]: params => [`app/mall-platform-category/parent/${params.categoryId}/categories/`],
      // 获取当前用户地址信息
      [API.PATIENT]: params => [`mall-user-address/users/${getUser().userId}/hospital`],
      // 获取订单列表
      [API.ORDERS]: params => [`app-mall-scan/users/${getUser().userId}/orders`],
      // 获取订单详细信息
      [API.ORDERDETAIL]: params => [`mall-user-shop-cart/users/${getUser().userId}/cart/part`],
      // 用户扫描二维码获取订单详细信息
      [API.ORDERDETAILFROMSCAN]: params => [`app-mall-scan/users/${getUser().userId}/cart`],
      // 在线商城购买商品提交订单
      [API.SUBMITORDER]: params => [`mall-user-order/users/${getUser().userId}/order`, 'post'],
      // 扫码购买商品提交订单
      [API.SUBMITORDERSCAN]: params => [`app-mall-scan/user/orders`, 'post'],
      // 获取地址列表
      [API.ADDRESSES]: params => [`mall-user-address/users/${getUser().userId}/addresses`],
      // 获取国内地址信息
      [API.AREA]: params => [`mall-sys-china/pid/${params.pid}`],
      // 新增|修改收货地址
      [API.ADDRESSUPD]: params => [`mall-user-address/users/${getUser().userId}/address`, params.id ? 'put' : 'post'],
      // 获取指定收货地址信息
      [API.ADDRESS]: params => [`mall-user-address/users/${getUser().userId}/addresses/${params.id}`],
      // 设置默认地址
      [API.DEFAULTADDRESS]: params => [`mall-user-address/users/${getUser().userId}/addresses/${params.id}`, 'put'],
      // 删除地址
      [API.ADDRESSDEL]: params => [`mall-user-address/users/${getUser().userId}/addresses/${params.id}`, 'delete'],
      // 支付宝支付
      [API.ALIPAY]: params => ['mall-pay/pay/alipay', 'post'],
      // 微信支付
      [API.WEIXINPAY]: params => ['mall-pay/pay/weixin', 'post'],
      // 获取支付结果并查询是否绑定手机号
      [API.PAYRESULT]: params => [`app-mall-scan/users/${getUser().userId}/mobile`],
      // 绑定手机号 - 发送验证码
      [API.SENDSMS]: params => ['mall-login/mobile/bind/send', 'post'],
      // 绑定手机号
      [API.BINDMOBILE]: params => ['mall-login/mobile/bind', 'post']
    }

    function fetch (api, data = {}, isHideLoading = false) {
      if (!isHideLoading) {
        store.commit(CONSTANCE.LOADING, {isLoading: true})
      }

      let [url, method = 'get'] = apiUrl[api](data)

      return new Promise((resolve, reject) => {
        axios({
          method: method,
          url: url,
          params: data,
          headers: getUser()
        }).then(response => {
          var data = response.data
          if (!data) {
            this.$vux.toast.text('服务异常', 'bottom')
          } else if (data.code === 'A-00028') {
            this.$router.push('/timeout')
          } else if (data != null && data.code === 'A-00000') {
            resolve(data.obj)
          } else {
            reject(data)
          }
        })
        .catch(() => {
          this.$vux.toast.text('网络异常', 'bottom')
        })
        .finally(() => {
          if (!isHideLoading) {
            store.commit(CONSTANCE.LOADING, {isLoading: false})
          }
        })
      })
    }

    Vue.prototype.$_http = fetch
  }
}
