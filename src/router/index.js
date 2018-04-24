import Vue from 'vue'
import Router from 'vue-router'
import goodsDetail from '@/pages/GoodsDetail'
import Orders from '@/pages/Orders'
import Analysis from '@/pages/Analysis'
import Timeout from '@/pages/Timeout'
import Login from '@/pages/Login'
import OrderConfirm from '@/pages/OrderConfirm'
import SupplierLogin from '@/pages/SupplierLogin'
import SupplierOrderConfirm from '@/pages/SupplierOrderConfirm'
import Goods from '@/pages/Goods'
import NotFound from '@/pages/NotFound'
import Pay from '@/pages/Pay'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/goods',
      component: Goods
    },
    {
      path: '/orders',
      component: Orders
    },
    {
      path: '/goods-detail/:goodsId',
      component: goodsDetail
    },
    {
      path: '/orders',
      redirect: '/index/orders'
    },
    {
      path: '/analysis',
      component: Analysis
    },
    {
      path: '/timeout',
      component: Timeout
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/order-confirm/:v/:from',
      component: OrderConfirm,
      props: true
    },
    {
      path: '/supplier-login',
      component: SupplierLogin
    },
    {
      path: '/supplier-order-confirm',
      component: SupplierOrderConfirm
    },
    {
      path: '*',
      component: NotFound
    },
    {
      path: '/pay/:payType/:orderNo/:totalPrice',
      component: Pay,
      props: true
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
