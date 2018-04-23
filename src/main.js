// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import store from './store'
import App from './App'
import utils from './utils/utils'
import http from './utils/api'
import { API } from './utils/constance'

Vue.use(utils)
Vue.use(http)
FastClick.attach(document.body)
Vue.config.productionTip = false
Vue.prototype.$_api = API

router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true})
  next()
})

router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: false})
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
