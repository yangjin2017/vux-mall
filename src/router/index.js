import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import GoodsList from '@/pages/GoodsList'
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

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/index',
      component: Index,
      redirect: '/index/goods',
      children: [
        {
          path: 'goods', component: GoodsList
        },
        {
          path: 'goods/:categoryId', component: GoodsList
        },
        {
          path: 'orders', component: Orders
        }
      ]
    },
    {
      path: '/goods',
      component: Goods
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
      path: '/order-confirm/:v',
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
