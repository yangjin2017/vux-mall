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

    const apiUrl = {
      [CONSTANCE.API.GOODSDETAIL]: params => [`app/mall-goods/goods/${params.goodsId}/message`],
      [CONSTANCE.API.CART]: params => [`mall-user-shop-cart/users/${getUser().userId}/cart`, 'post']
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
