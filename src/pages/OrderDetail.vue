<template>
  <div class="page page-current">
    <nav-bar title="订单详情" :is-back="true"></nav-bar>
    <div class="content">
      <div class="yungu-order-detail-header">
        <div class="yungu-order-detail-header-status" 
          :class="{ 'color-default': order.status == '0',
                    'color-warning': order.status == '4' }">
          <template>
            {{ orderStatus }}<small v-if="order.status == '1'">（ {{ order.payOverTime > 0 ? order.payOverTime : 0 }} 分钟后自动关闭）</small>
          </template>
          <template v-if="order.status == 5">
            {{ order.backStatus == 1 ? '退款成功  订单关闭' : '交易完成' }}
          </template>
        </div>
        <div class="yungu-order-detail-header-info">
          <div class="yungu-order-detail-header-lcation"></div>
          <div class="yungu-order-detail-header-content">
            <div class="yungu-order-detail-header-name-mobile">
              <span class="yungu-order-detail-header-name">收货人 : {{ order.consignee }}</span>
              <span class="yungu-order-detail-header-mobile">{{ order.mobile }}</span>
            </div>
            <div class="yungu-order-detail-header-address">收货地址 : {{ order.receivingAddress }}</div>
          </div>
        </div>
        <div class="yungu-order-detail-header-img"></div>
      </div>

      <!--支付方式-->
		  <div class="yungu-order-confirm-payway" v-if="order.status == '1'">
			  <div class="yungu-order-confirm-payway-title">支付方式</div>
			  <div class="yungu-order-confirm-payway-weixin" @click="payType = '1'">
				  <span>微信支付</span>
				  <span class="yungu-order-confirm-payway-weixin-check" :class="{ active: payType === '1' }"></span>
			  </div>
			  <div class="yungu-order-confirm-payway-alipay" @click="payType = '2'">
				  <span>支付宝支付</span>
				  <span class="yungu-order-confirm-payway-weixin-check" :class="{ active: payType === '2' }"></span>
			  </div>
		  </div>

      <!--订单商品信息-->
      <div class="yungu-my-orders-card">
			  <div class="yungu-my-order-header">
				  <span class="yungu-order-seller">{{ order.merchantName }}</span>
				  <span class="yungu-order-detail"></span>
			  </div>
			  <div class="yungu-my-order-content">
				  <ul>
					  <template v-for="item in order.mallOrderGoodsSnapDetailVoList">
						  <order-goods-item :goods="JSON.parse(item.jsonText)" :key="item.id"></order-goods-item>
					  </template>
				  </ul>
			  </div>
			  <div class="yungu-order-success-detail-footer">
				  <div class="yungu-order-detail-freight">
					  <span>运费</span>
					  <span>￥{{ order.expressPrice | priceFormat }}</span>
				  </div>
				  <div class="yungu-order-detail-total">
					  <span>订单总价</span>
					  <span>￥{{ order.goodsTotalPrice | priceFormat }} (含运费) </span>
				  </div>
				  <div class="yungu-order-detail-real">
					  <span>实付款</span>
					  <span>￥{{ order.goodsTotalPrice | priceFormat }}</span>
				  </div>
			  </div>
		  </div>

		  <div class="yungu-order-detail-footer">
			  <span v-if="order.orderNo">订单编号 : {{ order.orderNo }}</span>
			  <span v-if="order.orderTime">下单时间 : {{ order.orderTime }}</span>
        <span v-if="order.payType">支付方式 : {{ order.payType == 1 ? '微信支付' : '支付宝' }}</span>
        <span v-if="order.payTime">付款时间 : {{ order.payTime }}</span>
        <span v-if="order.payNo && order.status != '1'">交易号 : {{ order.payNo }}</span>
        <span v-if="order.deliveryTime">发货时间 : {{ order.deliveryTime }}</span>
        <span v-if="order.confirmReceiptTime">成交时间 : {{ order.confirmReceiptTime }}</span>
        <span v-if="order.modifyTime">关闭时间 : {{order.modifyTime}}</span>
		  </div>
		  <div class="yungu-disabled-content"></div>
    </div>
    <nav class="bar bar-tab">
      <!--<a class="pull-right yungu-order-detail-confirm" href="#">
				确认收货
			</a>-->
      <!-- <a class="pull-right yungu-order-detail-post" @click="orderComplaint">投诉</a> -->
      <template v-if="order.status == '1'">
        <a class="pull-right yungu-order-detail-confirm" @click="orderPay">付款</a>
			  <a class="pull-right yungu-order-detail-post" @click="orderCancel">取消订单</a>
      </template>
      <template v-else-if="order.status == '2'">
        <span class="yungu-order-tab-btn-refund-status" v-if="backStatus === 1">您的退款申请已提交，请等待卖家审核</span>
        <a class="pull-right yungu-order-detail-confirm btn" v-else-if="backStatus === 0" @click="orderRefund">申请退款</a>
        <a class="pull-right yungu-order-detail-post btn" v-if="backStatus !== 1" @click="orderRemind">提醒发货</a>
      </template>
      <template v-else-if="order.status == '3'">
        <a v-if="backStatus === 1 && order.backStatus === 1" @click="orderReturns" class="pull-right yungu-order-detail-confirm back-delivery">退货</a>
        <span v-else-if="backStatus === 1" class="yungu-order-tab-btn-refund-status">您的退款申请已提交，请等待卖家审核</span>
        <a v-if="backStatus !== 1" @click="orderReceiving" class="pull-right yungu-order-detail-confirm">确认收货</a>
        <a v-if="backStatus === 2" @click="orderRefund" class="pull-right yungu-order-detail-confirm">申请退款</a>
      </template>
    </nav>
    <actionsheet
      v-model="payed"
      :menus="menus"
      @on-click-menu="payedEvent"
      @actionsheet-label-warn-color="'#f6383a'"
      @actionsheet-label-primary-color="'#0894ec'"></actionsheet>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import OrderGoodsItem from '../components/OrderGoodsItem'
import { orderUtil } from '../utils/utils'
import { Actionsheet } from 'vux'
export default {
  components: {
    NavBar,
    OrderGoodsItem,
    Actionsheet
  },
  props: ['orderId'],
  data () {
    return {
      order: {},
      payType: '1',
      payed: false,
      menus: [{
        label: '已支付',
        type: 'primary',
        value: 'success'
      }, {
        label: '支付遇到问题',
        type: 'warn',
        value: 'question'
      }]
    }
  },
  created () {
    this.initData()
  },
  computed: {
    /**
     * 计算订单退货状态
     * @return {Boolean} 订单退货状态 0：无操作；1：订单退款中；2：单个商品退款中
     */
    backStatus () {
    // 退货状态(0:退款审核中；1：审核通过；2：审核未通过；3：无操作；4：待收货；5：交易完成)
      if (this.order.backStatus === 2 || this.order.backStatus === 3) {
        const orderGoods = this.order.mallOrderGoodsSnapDetailVoList
        for (var i = 0; i < orderGoods.length; i++) {
          if (orderGoods.backStatus !== 2 && orderGoods.backStatus !== 3) {
            return 2
          }
        }
        return 0
      }
      return 1
    },
    orderStatus () {
      return ['订单关闭', '订单状态 : 等待付款', '订单状态 : 买家已付款', '订单状态 : 卖家已发货', '订单取消'][this.order.status]
    }
  },
  methods: {
    initData () { // 获取订单详情信息
      this.$_http().queryOrderDetail({
        orderId: this.orderId
      }).then(data => {
        this.order = data
      })
    },
    // 取消订单
    orderCancel () {
      this.$_http().cacelOrder({
        orderId: this.orderId
      }).then(res => {
        this.$vux.toast.text('操作成功', 'bottom')
        setTimeout(() => {
          this.$router.push('/order')
        }, 2000)
      })
    },
    // 订单支付
    orderPay () {
      this.$_http().orderPay({
        payType: this.payType,
        orderNo: this.order.orderNo
      }).then(res => {
        orderUtil.setOrderSession(res, this.order.goodsTotalPrice)
        this.$router.push(`/pay/${this.payType}`)
        // TODO:支付完成后actionSheet
      }).catch(err => {
        this.$vux.toast.text(err.msg, 'bottom')
      })
    },
    // 支付完成
    payedEvent (key, item) {
      switch (key) {
        case 'success':
          this.$_http().payResult({
            orderNo: this.order.orderNo,
            payType: this.payType
          }).then(res => {
            if (res) {
              this.$router.push('/pay-success')
            } else {
              this.$router.push('/orders')
            }
          }).catch(() => {
            this.$router.push('/orders')
          })
          break

        case 'question':
          this.$router.push('/orders')
          break

        default:
          break
      }
    },
    // 提醒发货
    orderRemind () {
      this.$_http().orderRemind({
        orderId: this.orderId
      }).then(res => {
        this.$vux.toast.text('操作成功', 'bottom')
      }).catch(err => {
        this.$vux.toast.text(err.msg, 'bottom')
      })
    },
    // 申请退款
    orderRefund () {
      this.$router.push()
    },
    // 确认收货
    orderReceiving () {
      this.$_http().orderReceiving({
        orderId: this.orderId
      }).then(res => {
        this.$router.push('/orders')
      })
    },
    // 退货
    orderReturns () {
      this.$router.push()
    },
    // 投诉
    orderComplaint () {
      this.$router.push(`/order-complaint/${this.order.id}`)
    }
  }
}
</script>

<style>
.yungu-order-tab-btn-refund-status {
  display: block;
  text-align: right;
  line-height: 2.5rem;
  padding-right: 1rem;
}
.back-delivery {
  border-color: #666;
  color: #333;
}
</style>
