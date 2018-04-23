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
      // 获取订单详细信息
      [API.ORDERDETAIL]: params => [`mall-user-shop-cart/users/${getUser().userId}/cart/part`]
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
            store.commit(CONSTANCE.LOADING, {isLoading: false})
          }
        })
      })
    }

    Vue.prototype.$_http = fetch
  }
}
