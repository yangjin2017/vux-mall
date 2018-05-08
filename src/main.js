// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import store from './store'
import App from './App'
import utils from './utils/utils'
import http from './utils/api'
import { ToastPlugin, AlertPlugin } from 'vux'

Vue.use(utils)
Vue.use(http)
Vue.use(ToastPlugin, {position: 'bottom', width: 'auto'})
Vue.use(AlertPlugin)
FastClick.attach(document.body)
Vue.config.productionTip = false

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
