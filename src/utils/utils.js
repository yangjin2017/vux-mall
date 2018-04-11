export default {
  install (Vue, pluginOptions = {}) {
    /**
     * 判断是否处于微信环境
     */
    function isWeixin () {
      var ua = window.navigator.userAgent.toLowerCase()
      return /MicroMessenger/i.test(ua)
    }

    Vue.prototype.$_isWeixin = isWeixin

    const localUser = {
      setUserId: function (userId) {
        window.localStorage.setItem('userId', userId)
      },
      setToken: function (token) {
        window.localStorage.setItem('token', token)
      },
      getUser: function () {
        return {
          userId: window.localStorage.getItem('userId'),
          token: window.localStorage.getItem('token')
        }
      },
      removeUser: function () {
        window.localStorage.removeItem('userId')
        window.localStorage.removeItem('token')
      }
    }

    Vue.prototype.$_localUser = localUser

    Vue.mixin({
      filters: {
        priceFormat: function (value) {
          if (!value) {
            return 0.00
          }
          var f = parseFloat(value)
          if (isNaN(f)) {
            return 0.00
          }
          f = Math.round(f * 100) / 100
          var s = f.toString()
          var rs = s.indexOf('.')
          if (rs < 0) {
            rs = s.length
            s += '.'
          }
          while (s.length <= rs + 2) {
            s += '0'
          }
          return s
        },
        numberFormat: function (value) {
          return value || 0
        },
        floatFormat: function (value) {
          return value ? parseFloat(value) : 0
        }
      }
    })
  }
}
