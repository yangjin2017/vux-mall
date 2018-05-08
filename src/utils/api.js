import axios from 'axios'
import CONSTANCE from './constance.js'
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

    function fetch (url, data = {}, method = 'get', isHideLoading = false) {
      if (!isHideLoading) {
        store.commit(CONSTANCE.LOADING, {isLoading: true})
      }

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

    Vue.prototype.$_http = function () {
      const self = this

      /**
       * 获取本地缓存用户信息
       */
      const getUserId = () => {
        const userId = window.localStorage.getItem('userId')
        if (!userId) {
          self.$router.push('/timeout')
        }
      }

      return {
        // 商品列表
        goods: params => fetch.call(self, 'app/mall-goods/goods', params),
        // 获取商品详情
        goodsDetail: params => fetch.call(self, `app/mall-goods/goods/${params.goodsId}/message`, params),
        // 商品加入购物车
        cart: params => fetch.call(self, `mall-user-shop-cart/users/${getUser().userId}/cart`, params, 'post'),
        // 扫描二维码登录
        scanLogin: params => fetch.call(self, 'app-mall-scan/login', params),
        // 加载药械商品的分类
        categoryMedical: params => fetch.call(self, 'app/mall-platform-category/categories/medical', params),
        // 加载普通商品的分类
        categoryOrdinary: params => fetch.call(self, 'app/mall-platform-category/categories/ordinary', params),
        // 加载商品二级分类
        categories: params => fetch.call(self, `app/mall-platform-category/parent/${params.categoryId}/categories/`, params),
        // 获取当前用户地址信息
        patient: params => fetch.call(self, `mall-user-address/users/${getUserId()}/hospital`, params),
        // 获取订单列表
        orders: params => fetch.call(self, `app-mall-scan/users/${getUserId()}/orders`, params),
        // 获取订单详细信息
        orderDetail: params => fetch.call(self, `mall-user-shop-cart/users/${getUserId()}/cart/part`, params),
        // 用户扫描二维码获取订单详细信息
        orderDetailFromScan: params => fetch.call(self, `app-mall-scan/users/${getUserId()}/cart`, params),
        // 在线商城购买商品提交订单
        submitOrder: params => fetch.call(self, `mall-user-order/users/${getUserId()}/order`, params, 'post'),
        // 扫码购买商品提交订单
        submitOrderScan: params => fetch.call(self, `app-mall-scan/user/orders`, params, 'post'),
        // 获取地址列表
        addresses: params => fetch.call(self, `mall-user-address/users/${getUserId()}/addresses`, params),
        // 获取国内地址信息
        area: params => fetch.call(self, `mall-sys-china/pid/${params.pid}`, params),
        // 新增|修改收货地址
        addressupd: params => fetch.call(self, `mall-user-address/users/${getUserId()}/address`, params, params.id ? 'put' : 'post'),
        // 获取指定收货地址信息
        address: params => fetch.call(self, `mall-user-address/users/${getUserId()}/addresses/${params.id}`, params),
        // 设置默认地址
        defaultaddress: params => fetch.call(self, `mall-user-address/users/${getUserId()}/addresses/${params.id}`, params, 'put'),
        // 删除地址
        addressdel: params => fetch.call(self, `mall-user-address/users/${getUserId()}/addresses/${params.id}`, params, 'delete'),
        // 支付宝支付
        alipay: params => fetch.call(self, 'mall-pay/pay/alipay', params, 'post'),
        // 微信支付
        weixinpay: params => fetch.call(self, 'mall-pay/pay/weixin', params, 'post'),
        // 获取支付结果并查询是否绑定手机号
        payResult: params => fetch.call(self, `app-mall-scan/users/${getUserId()}/mobile`, params),
        // 绑定手机号 - 发送验证码
        sendSms: params => fetch.call(self, 'mall-login/mobile/bind/send', params, 'post'),
        // 绑定手机号
        bindMobile: params => fetch.call(self, 'mall-login/mobile/bind', params, 'post'),
        // 获取订单详情
        queryOrderDetail: params => fetch.call(self, `mall-user-order/users/${getUserId()}/orders/${params.orderId}`, params),
        // 取消订单
        cacelOrder: params => fetch.call(self, `mall-user-order/users/${getUserId()}/orders/cancel/${params.orderId}`, params, 'post'),
        // 订单支付
        orderPay: params => fetch.call(self, 'app-mall-scan/user/order', params, 'post'),
        // 提醒发货
        orderRemind: params => fetch.call(self, `mall-user-order/users/${getUserId()}/orders/remind/${params.orderId}`, params),
        // 确认收货
        orderReceiving: params => fetch.call(self, `mall-user-order/users/${getUserId()}/orders/${params.orderId}/past`, params, 'put'),
        // 投诉
        orderComplaint: params => fetch.call(self, `mall-user-order/users/${getUserId()}/orders/${params.orderId}/complaint`)
      }
    }
  }
}
