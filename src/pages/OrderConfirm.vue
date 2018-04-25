<template>
  <div class="page page-current">
    <nav-bar title='确认订单'></nav-bar>
    <div class="content yungu-order-detail-success">
      <!-- 这里是页面内容区 -->
      <div class="yungu-order-detail-header" @click="chooseAddress">
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
          <input class="yungu-item-input" type="text" v-model="identityCard" placeholder="请输入身份证号" maxlength="18" />
        </div>
        <div class="yungu-input-content">
          <div class="yungu-item-title">邮箱：</div>
          <input class="yungu-item-input" type="text" v-model="mailbox" placeholder="请输入邮箱" maxlength="40" />
        </div>
      </div>
      <!--订单详情-->
      <form class="yungu-order-form">
        <div class="yungu-order-confirm-detail">
          <div class="yungu-my-orders-card" v-for="order in orders" :key="order.mallSupplierInfoId">
            <div class="yungu-my-order-header">
              <span class="yungu-order-seller">{{ order.mallSupplierInfoName }}</span>
            </div>
            <div class="yungu-my-order-content">
              <ul>
                <template v-for="(item, index_goods) in order.goodsList">
                  <order-goods-item :key="index_goods" :goods="item"></order-goods-item>
                </template>
              </ul>
            </div>
            <div class="yungu-my-order-footer">
              <div class="yungu-my-order-footer-detail">
                <div>
                  <span class="yungu-my-order-footer-detail-text">共{{ goodsNum }}件商品</span>
                  <span class="yungu-my-order-footer-detail-total pull-right">
                    <span class="yungu-my-order-footer-detail-price">合计 :￥{{ goodsPrice | priceFormat }}</span>
                  ( 含运费￥{{ orders.postPrice | priceFormat }}元 )
                  </span>
                </div>
                <div class="yungu-my-order-footer-detail-post" v-if="order.freeMailLimit > 0">满{{ order.freeMailLimit | priceFormat }}包邮，免运费</div>
              </div>
              <div class="yungu-order-confirm-remark">
                <div class="yungu-order-confirm-remark-title">买家留言</div>
                <div class="yungu-order-confirm-remark-content">
                  <textarea maxlength="200" placeholder="请输入备注内容（可不填）" v-model="leavingMsg"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <!--支付方式-->
      <div class="yungu-order-confirm-payway">
        <div class="yungu-order-confirm-payway-title">支付方式</div>
        <div class="yungu-order-confirm-payway-weixin payMode" @click="payMode = 1">
          <span>微信支付</span>
          <span class="yungu-order-confirm-payway-weixin-check" :class="{ active: payMode == 1 }"></span>
        </div>
        <div class="yungu-order-confirm-payway-alipay payMode" @click="payMode = 2">
          <span>支付宝支付</span>
          <span class="yungu-order-confirm-payway-weixin-check" :class="{ active: payMode == 2 }"></span>
        </div>
      </div>
    </div>
        
    <nav class="bar bar-tab yungu-order-confirm-nav">
      <div class="yungu-order-confirm-total-price">合计 : <span>￥{{ goodsPrice | priceFormat }}</span></div>
      <a @click="submit">提交订单</a>
    </nav>
  </div>  
</template>

<script>
import NavBar from '../components/NavBar'
import OrderGoodsItem from '../components/OrderGoodsItem'
import { regexUtil } from '../utils/utils'
import { AlertModule } from 'vux'
import { axiosForm } from '../utils/api'
export default {
  data: function () {
    return {
      patient: {},
      identityCard: '',
      mailbox: '',
      carts: null,
      orders: [],
      goodsNum: 0,
      goodsPrice: 0,
      payMode: 1,
      leavingMsg: ''
    }
  },
  props: ['v', 'from'],
  computed: {
    supplierSource: function () {
      let supplierSource = '1'
      this.orders.map(item => {
        if (item.supplierSource == '2') {
          supplierSource = '2'
          return
        }
      })
      return supplierSource
    }
  },
  components: {
    NavBar,
    OrderGoodsItem
  },
  created: function () {
    this.getPatient()
    switch (this.from) {
      case 'scan':
        this.getOrdersFromScan()
        break;
    
      case 'shop':
        this.getOrders()
        break;
    
      default:
        break;
    }
  },
  methods: {
    getPatient,
    getOrders,
    getOrdersFromScan,
    getGoodsNumAndTotalPrice,
    submit,
    chooseAddress(){
      this.$router.push('/addresses')
    }
  }
}

// 获取病人信息
function getPatient () {
  const userId = this.$_localUser.getUser().userId
  this.$_http(this.$_api.PATIENT).then(res => {
    this.patient = res
  })
}

// 订单商品数量及总价计算
function getGoodsNumAndTotalPrice() {
  let goodsNum = 0
  let goodsPrice = 0
  this.orders[0].goodsList.map(goods => {
    goodsNum += goods.specNum
    goodsPrice += goods.specPrice * goods.specNum
  })
  if (goodsPrice < this.orders.freeMailLimit) {
    goodsPrice += parseFloat(this.orders.postage)
  }
  this.goodsNum = goodsNum
  this.goodsPrice = goodsPrice
}

// 获取订单信息
function getOrders () {
  this.$_http(this.$_api.ORDERDETAIL, {
    idList: this.v
  }).then(res => {
    this.orders = res
    this.getGoodsNumAndTotalPrice()
  })
}

// 用户扫描二维码获取订单信息
function getOrdersFromScan() {
  this.$_http(this.$_api.ORDERDETAILFROMSCAN, {
    v: this.v
  }).then(res => {
    this.orders = res.orders
    this.carts = res.carts
    this.getGoodsNumAndTotalPrice()
  })
}

//  提交订单
function submit() {
  // let url = `mall-user-order/users/${this.$_localUser.getUser().userId}/order`
  // if (this.from === 'scan') {
  //   url = 'app-mall-scan/user/orders'
  // }
  let url = this.$_api.SUBMITORDER
  if (this.from === 'scan') {
    url = this.$_api.SUBMITORDERSCAN
  }

  const self = this
  let params = {
    payType: this.payMode,
    addressId: this.patient.id,
    idList: this.v,
    // orderFullList: [{
    //   mallSupplierInfoId: self.orders[0].mallSupplierInfoId,
    //   leavingMsg: self.leavingMsg
    // }]
    'orderFullList[0].mallSupplierInfoId': self.orders[0].mallSupplierInfoId,
    'orderFullList[0].leavingMsg': self.leavingMsg
  }

  if (this.supplierSource === '2') {
    if (!regexUtil.isCardNo(this.identityCard)) {
      AlertModule.show({
        title: '提示信息',
        content: '请输入正确的身份证号'
      })
      return
    }
    if (!regexUtil.isEmail(this.mailbox)) {
      AlertModule.show({
        title: '提示信息',
        content: '请输入正确的邮箱'
      })
      return
    }
    params.identityCard = this.identityCard
    params.mailbox = this.mailbox
  }

  this.$_http(url, params).then(res => {
    this.$router.push(`/pay/${this.payMode}/${res}/${this.goodsPrice}`)
  }).catch(res => {
    if (res.code == 'A-00044') {
      AlertModule.show({
        title: '提示信息',
        content: '收货地址必填'
      })
    }
  })
}
</script>

<style>
.content {
  bottom: 2.9rem;
}
</style>
