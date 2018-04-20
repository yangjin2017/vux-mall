<template>
  <div class="page page-current">
    <nav-bar title='确认订单'></nav-bar>
    <div class="content yungu-order-detail-success">
      <!-- 这里是页面内容区 -->
      <div class="yungu-order-detail-header">
        <div class="yungu-order-detail-header-info">
          <div class="yungu-order-detail-header-content">
            <div class="pull-left yungu-order-detail-header-lcation"></div>
            <div class="yungu-order-detail-header-name-mobile">
              <span class="yungu-order-detail-header-name">{{ patient.userName }}</span>
              <span class="yungu-order-detail-header-mobile">{{ patient.mobile }}</span>
            </div>
            <div class="yungu-order-detail-header-address">{{ patient.address }}</div>
          </div>
        </div>
        <div class="yungu-order-detail-header-img"></div>
      </div>
      <!-- 海淘商品退货信息 -->
      <div class="yungu-order-delivery-extra" id="identityInfo" v-if="supplierSource === '2'">
        <div class="yungu-order-delivery-extra-title">该订单包含海淘商品，需要补充身份信息</div>
        <div class="yungu-input-content">
          <div class="yungu-item-title">身份证号：</div>
          <input class="yungu-item-input" type="text" v-model="identityCard" placeholder="请输入身份证号" />
        </div>
        <div class="yungu-input-content">
          <div class="yungu-item-title">邮箱：</div>
          <input class="yungu-item-input" type="text" v-model="mailbox" placeholder="请输入邮箱" />
        </div>
      </div>
      <!--订单详情-->
      <form class="yungu-order-form">
        <input type="hidden" name="payType" value="1"/>
        <input type="hidden" name="carts" v-model="carts"/>
        <input type="hidden" name="idList"/>
        <input type="hidden" name="addressId"/>
        <input type="hidden" name="identityCard">
        <input type="hidden" name="mailbox">
        <div class="yungu-order-confirm-detail">
          <div class="yungu-my-orders-card" v-for="(order, index) in orders" :key="order.mallSupplierInfoId">
            <div class="yungu-my-order-header">
              <input type="hidden" :value="order.mallSupplierInfoId" :name="'orderFullList['+ index +'].mallSupplierInfoId'"/>
              <span class="yungu-order-seller">{{ order.mallSupplierInfoName }}</span>
            </div>
            <div class="yungu-my-order-content">
              <ul>
                <template v-for="(item, index_goods) in order">
                  <order-goods-item :key="index_goods" :goods="item"></order-goods-item>
                </template>
              </ul>
            </div>
            <div class="yungu-my-order-footer">
              <div class="yungu-my-order-footer-detail">
                <div>
                  <span class="yungu-my-order-footer-detail-text">共{{ order.goodsNum }}件商品</span>
                  <span class="yungu-my-order-footer-detail-total pull-right">
                    <span class="yungu-my-order-footer-detail-price">￥合计 :{{ orders.goodsTotalPrice }}</span>
                  ( 含运费￥{{ orders.postPrice }}元 )
                  </span>
                </div>
                <div class="yungu-my-order-footer-detail-post" v-if="order.freeMailLimit > 0">满{{ order.freeMailLimit }}包邮，免运费</div>
              </div>
              <div class="yungu-order-confirm-remark">
                <div class="yungu-order-confirm-remark-title">买家留言</div>
                <div class="yungu-order-confirm-remark-content">
                  <textarea :name="'orderFullList['+ index +'].leavingMsg'" maxlength="200" placeholder="请输入备注内容（可不填）"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <!--支付方式-->
      <div class="yungu-order-confirm-payway">
        <div class="yungu-order-confirm-payway-title">支付方式</div>
        <div class="yungu-order-confirm-payway-weixin payMode">
          <span>微信支付</span>
          <span class="yungu-order-confirm-payway-weixin-check active" data-id="1"></span>
        </div>
        <div class="yungu-order-confirm-payway-alipay payMode">
          <span>支付宝支付</span>
          <span class="yungu-order-confirm-payway-weixin-check" data-id="2"></span>
        </div>
      </div>
    </div>
        
    <nav class="bar bar-tab yungu-order-confirm-nav">
      <div class="yungu-order-confirm-total-price">合计 : <span>￥</span></div>
      <a id="submit">提交订单</a>
    </nav>
  </div>  
</template>

<script>
import NavBar from '../components/NavBar'
import OrderGoodsItem from '../components/OrderGoodsItem'
export default {
  data: function () {
    return {
      patient: {},
      identityCard: '',
      mailBox: '',
      carts: null,
      orders: null
    }
  },
  props: ['v'],
  computed: {
    supplierSource: function () {
      
    }
  },
  components: {
    NavBar,
    OrderGoodsItem
  },
  created: function () {
    this.getPatient()
    this.getOrders()
  },
  methods: {
    getPatient,
    getOrders
  }
}

// 获取病人信息
function getPatient () {
  const userId = this.$_localUser.getUser().userId
  this.$_http.patient().then(res => {
    this.patient = res
  })
}

// 获取订单信息
function getOrders () {
  this.$_http.orderDetail({
    idList: this.v
  }).then(res => {
    this.orders = res
  })
}
</script>
