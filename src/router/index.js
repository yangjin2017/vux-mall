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
import Addresses from '@/pages/Addresses'
import AddressesAdd from '@/pages/AddressAdd'
import PaySuccess from '@/pages/PaySuccess'
import BindMobile from '@/pages/BindMobile'
import OrderDetail from '@/pages/OrderDetail'
import OrderComplaint from '@/pages/OrderComplaint'
import PayFail from '@/pages/PayFail'
import OrderRefund from '@/pages/OrderRefund'

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
      path: '/pay/:payType',
      component: Pay,
      props: true
    },
    {
      path: '/addresses',
      component: Addresses
    },
    {
      path: '/address-add/:id',
      component: AddressesAdd,
      props: true
    },
    {
      path: '/pay-success',
      component: PaySuccess
    },
    {
      path: '/bind-mobile',
      component: BindMobile
    },
    {
      path: '/order-detail/:orderId',
      component: OrderDetail,
      props: true
    },
    {
      path: '/order-complaint/:orderId',
      component: OrderComplaint,
      props: true
    },
    {
      path: '/pay-fail',
      component: PayFail
    },
    {
      path: '/order-refund',
      component: OrderRefund
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
