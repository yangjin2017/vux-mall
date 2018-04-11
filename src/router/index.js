import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import GoodsList from '@/pages/GoodsList'
import Orders from '@/pages/Orders'
import Analysis from '@/pages/Analysis'
import Timeout from '@/pages/Timeout'
import Login from '@/pages/Login'
import OrderConfirm from '@/pages/OrderConfirm'
import SupplierLogin from '@/pages/SupplierLogin'
import SupplierOrderConfirm from '@/pages/SupplierOrderConfirm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      component: Index,
      redirect: '/goods',
      children: [
        {
          path: 'goods/:categoryId', component: GoodsList
        },
        {
          path: 'orders', component: Orders
        }
      ]
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
      path: '/order-confirm',
      component: OrderConfirm
    },
    {
      path: '/supplier-login',
      component: SupplierLogin
    },
    {
      path: '/supplier-order-confirm',
      component: SupplierOrderConfirm
    }
  ]
})
