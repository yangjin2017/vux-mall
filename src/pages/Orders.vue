<template>
  <div class="page page-current">
    <nav-bar title="我的订单"></nav-bar>
    <div class="content yungu-my-orders-bg infinite-scroll infinite-scroll-tab" data-distance="0">
      <!-- 这里是页面内容区 -->
      <div class="buttons-tab yungu-my-orders-tab-title">
        <a class="tab-link button yungu-tab-title" :class="status==='1'?'active':''" @click="tabSwitch('1')">待付款</a>
        <a class="tab-link button yungu-tab-title" :class="status==='2'?'active':''" @click="tabSwitch('2')">待发货</a>
        <a class="tab-link button yungu-tab-title" :class="status==='3'?'active':''" @click="tabSwitch('3')">待收货</a>
        <a class="tab-link button yungu-tab-title" :class="status==='4'?'active':''" @click="tabSwitch('4')">历史订单</a>
      </div>
        
      <div class="content-block yungu-my-orders-tab-content">
        <template v-for="item in orderList">
          <order-list-item :order="item" :key="item.id" @refresh="tabSwitch()"></order-list-item>
        </template>
      </div>
      <!-- 加载提示符 -->
      <div class="infinite-scroll-preloader">
        <div class="preloader"></div>
      </div>
    </div>
    <nav class="bar bar-tab">
      <router-link to="/goods" class="tab-item">
        <span class="icon icon-menu"></span>
        <span class="tab-label">首页</span>
      </router-link>
      <a class="tab-item active">
        <span class="icon icon-me"></span>
        <span class="tab-label">我的订单</span>
      </a>
    </nav>
  </div>
</template>

<script>
import NavBar from '../components/NavBar'
import OrderListItem from '../components/OrderListItem.vue'
import { Scroller } from 'vux'
export default {
  name: 'orders',
  data: function () {
    return {
      pageNo: 1,
      pageSize: 10,  // 每次加载添加多少条目
      status: '1',    // {'1': '待付款', '2': '待发货', '3': '待收货', '4': '历史订单'}
      orderList: []
    }
  },
  // TODO: 翻页 | 下拉刷新
  methods: {
    /**
     * @description 切换订单状态
     * @argument String status 订单状态
     */
    tabSwitch: function (status) {
      if (status) {
        this.status = status
      }
      this.pageNo = 1
      this.orderList = []
      this.initData()
    },
    initData: function () {
      this.$_http().orders({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        status: this.status
      }).then(data => {
        this.orderList = this.orderList.concat(data.list)
      })
    }
  },
  components: {
    NavBar,
    Scroller,
    OrderListItem
  },
  created: function () {
    this.initData()
  }
}
</script>
