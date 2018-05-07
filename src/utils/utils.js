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
            return '0.00'
          }
          var f = parseFloat(value)
          if (isNaN(f)) {
            return '0.00'
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

    function isEmptyObject (obj) {
      for (var p in obj) {
        return false
      }
      return true
    }

    Vue.prototype.$_isEmptyObject = isEmptyObject
  }
}

export const regexUtil = {
  isPhone: function (phone) {
    var pattern = /^1[34578]\d{9}$/
    return pattern.test(phone)
  },
  isChinaName: function (name) {
    var pattern = /^[\u4E00-\u9FA5]{2,6}$/
    return pattern.test(name)
  },
  isAddress: function (address) {
    var pattern = /^[\u4E00-\u9FA5a-zA-Z0-9]{2,30}$/
    return pattern.test(address)
  },
  isCode: function (code) {
    var pattern = /^\d{4}$/
    return pattern.test(code)
  },
  isCardNo: function (card) {
    var pattern = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
    return pattern.test(card)
  },
  isEmail: function (email) {
    var pattern = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
    return pattern.test(email)
  }
}

export const jsonUtil = {
  extend () {},
  /**
   * json数据更新
   * @param {JSONObject} src 目标数据
   * @param {JSONObject} dist  数据源
   */
  update (src, dist) {
    for (var p in src) {
      src[p] = dist[p] || src[p]
    }
  }
}

export const orderUtil = {
  /**
   * 缓存订单信息
   * @param {String} orderNo 订单号
   * @param {String} total 总价
   */
  setOrderSession (orderNo, total) {
    window.localStorage.setItem('order', JSON.stringify({
      orderNo: orderNo,
      total: total
    }))
  },
  // 获取本地缓存的订单信息
  getOrderStorage () {
    return JSON.parse(window.localStorage.getItem('order'))
  }
}
