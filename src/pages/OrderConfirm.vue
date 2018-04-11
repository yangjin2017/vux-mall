<template>
  <div class="page">
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
  computed: {
    supplierSource: function () {
      
    }
  },
  components: {
    NavBar,
    OrderGoodsItem
  },
  created: function () {
    getPatient(this)
    getOrders(this)
  }
}

// 获取病人信息
function getPatient (vm) {
  const userId = vm.$_localUser.getUser().userId
  vm.$_http({
    url: `mall-user-address/users/${userId}/hospital`,
    type: 'get'
  }).then(res => {
    vm.patient = res
  })
}

// 获取订单信息
function getOrders (vm) {
  const userId = vm.$_localUser.getUser().userId
  const v = vm.$route.query.v

  vm.$_http({
    url: `app-mall-scan/users/${userId}/cart?v=${v}`,
    type: 'get'
  }).then(res => {
    vm.carts = res.carts
    vm.orders = res.orders
  })
}
</script>

<style>
  .page {
    display: block;
  }
  .yungu-order-detail-header-info{
    background: url("../../static/img/icon-go-left-small.png");
    background-repeat:no-repeat;
    background-size:14px 14px;
    min-height: 3.0rem;
    background-repeat:no-repeat;
    background-position: 97% center;
    background-position: -webkit-calc(100% - .6rem) center;
    background-position: calc(100% - .6rem) center;
  }
  .yungu-order-detail-header-info .yungu-order-detail-header-none-address{
    padding-left: 0.6rem;
    min-height: 3.0rem;
    line-height: 3.0rem;
  }
  .yungu-order-detail-header-info .yungu-order-detail-header-lcation{
    /* background: url("../img/icon_address.png"); */
    background-repeat:no-repeat;
    background-position:center;
    -moz-background-size:17px 22px; /* 老版本的 Firefox */
    background-size:17px 22px;
    min-height: 3rem;
    width: 2rem;
    position: absolute;
    left: 0rem;
  }
  .yungu-order-detail-header-info .yungu-order-detail-header-content{
    min-height: 3rem;
    margin-left: 2rem;
    padding-right: 1.8rem;
  }
</style>
