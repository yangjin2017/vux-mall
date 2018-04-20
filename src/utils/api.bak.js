import axios from 'axios'
import CONSTANCE from './constance.js'
import store from '../store'

export default {
  install (Vue, pluginOptions = {}) {
    axios.defaults.baseURL = CONSTANCE.DOMAIN
    // 请求时的拦截
    axios.interceptors.request.use(function (config) {
      // 发送请求之前做一些处理
      console.log(config)
      return config
    }, function (error) {
      // 当请求异常时做一些处理
      return Promise.reject(error)
    })

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

    function fetch (url, method, params) {
      params = params || {}
      console.log(this)
      const isHideLoading = params.loading
      if (!isHideLoading) {
        store.commit('updateLoadingStatus', {isLoading: true})
      } else {
        delete params.loading
      }
      return new Promise((resolve, reject) => {
        axios({
          method: method,
          url: url,
          params: params,
          headers: getUser()
        }).then(response => {
          var data = response.data
          if (!data) {
            reject(data)
          } else if (data.code === 'A-00028') {
            this.$router.push('/timeout')
          } else if (data != null && data.code === 'A-00000' && data.obj !== undefined) {
            resolve(data.obj)
          }
        }, err => {
          reject(err)
        })
        .catch(error => {
          reject(error)
        })
        .finally(() => {
          if (!isHideLoading) {
            store.commit('updateLoadingStatus', {isLoading: false})
          }
        })
      })
    }

    Vue.prototype.$_http = {
      scanLogin: params => fetch('app-mall-scan/login', 'get', params),   // 扫描二维码登录
      goods: params => fetch('app/mall-goods/goods', 'get', params),   // 商品列表
      categoryMedical: params => fetch('app/mall-platform-category/categories/medical', 'get', params),   // 加载药械商品的分类
      categoryOrdinary: params => fetch('app/mall-platform-category/categories/ordinary', 'get', params),  // 加载普通商品的分类
      categories: params => fetch(`app/mall-platform-category/parent/${params.categoryId}/categories/`, 'get', params),   // 加载商品二级分类
      goodsDetail: params => fetch(`app/mall-goods/goods/${params.goodsId}/message`, 'get', params),   // 获取商品详情
      goodsPartData: params => fetch(params.url, 'get', {loading: true}),   // 加载商品详情介绍
      cart: params => fetch(`mall-user-shop-cart/users/${getUser().userId}/cart`, 'post', params),   // 请求商品是否可以购买
      patient: params => fetch(`mall-user-address/users/${getUser().userId}/hospital`, 'get'),    // 获取当前用户地址信息
      orderDetail: params => fetch(`mall-user-shop-cart/users/${getUser().userId}/cart/part`, 'get', params)   // 获取订单详细信息
    }
  }
}
