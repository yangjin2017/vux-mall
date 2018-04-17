import axios from 'axios'
import CONSTANCE from './constance.js'
import store from '../store'

export default {
  install (Vue, pluginOptions = {}) {
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

    function fetch ({url, type: method, data: params, isHideLoading}) {
      if (!isHideLoading) {
        store.commit('updateLoadingStatus', {isLoading: true})
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
            this.$router.push('/login')
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

    Vue.prototype.$_http = fetch
  }
}
