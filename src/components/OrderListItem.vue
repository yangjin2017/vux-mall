/**
 * 订单列表 -- 订单卡片
 */
<template>
  <div class="yungu-my-orders-card" @click="orderDetail">
    <div class="yungu-my-order-header">
      <span class="yungu-order-seller">{{ order.merchantName }}</span>
      <span class="yungu-order-detail"></span>
      <span class="yungu-order-pay">
        <span :class="{ 'color-default': order.status == 0, 'color-success': order.status == 5 && order.backStatus != 1 }">{{ orderStatus }}</span>
      </span>
    </div>
    <div class="yungu-my-order-content">
      <ul>
        <template v-for="item in order.mallOrderGoodsSnapList">
          <order-goods-item :key="item.id" :goods="JSON.parse(item.jsonText)">
            <template v-if="order.mallOrderGoodsSnapList.length > 1">
              <template v-if="orderBackStatus == 0">
                <a class="yungu-my-order-btn refund" slot="refund-btn">申请退款</a>
              </template>
              <template v-else-if="orderBackStatus == 2">
                <span v-if="item.backStatus == 5" class="yungu-my-order-btn" slot="refund-btn">退款完成</span>
                <span v-else-if="item.backStatus == 0 || item.backStatus == 4" class="yungu-my-order-btn" slot="refund-btn">退款待处理</span>
                <a v-else-if="item.backStatus == 1" class="yungu-my-order-btn back-delivery" slot="refund-btn">退货</a>
              </template>
            </template>
          </order-goods-item>
        </template>
      </ul>
    </div>
    <div class="yungu-my-order-footer">
      <div class="yungu-my-order-footer-detail">
        <div>
          <span class="yungu-my-order-footer-detail-text">共 {{ goodsNum }} 件商品</span>
          <span class="yungu-my-order-footer-detail-total pull-right">合计 :
            <span class="yungu-my-order-footer-detail-price"><small>￥</small> {{ order.goodsTotalPrice | priceFormat }} </span>
            ( 含运费￥ {{ order.expressPrice | priceFormat }} 元 )
          </span>
        </div>
        <div class="yungu-my-order-footer-detail-post">满 {{ order.freeMailLimit | priceFormat }} 免运费</div>
      </div>
      <div class="yungu-my-order-footer-todo">
        <!-- 待付款 -->
        <template v-if="order.status == 1">
          <a class="yungu-my-order-footer-first-a cancel" @click.stop="orderCancel">取消订单</a>
          <a class="yungu-my-order-footer-last-a pay" @click.stop="orderDetail">去支付</a>
        </template>
        <!-- 待发货 -->
        <template v-else-if="order.status == 2 && orderBackStatus != 1">
          <a class="yungu-my-order-footer-first-a remind" @click.stop="orderRemind">提醒发货</a>
          <a v-if="orderBackStatus === 0" class="yungu-my-order-footer-last-a refund" @click.stop="orderRefund">申请退款</a>
        </template>
        <!-- 待收货 -->
        <template v-else-if="order.status == 3">
          <template v-if="order.backStatus == 1">
            <span class="yungu-my-order-footer-detail-text">卖家已同意,请填写发货地址</span>
            <a class="yungu-my-order-footer-last-a back-delivery" @click.stop="orderReturns">发货</a>
          </template>
          <a v-if="orderBackStatus == 0" class="yungu-my-order-footer-first-a refund" @click.stop="orderRefund">申请退款</a>
          <a v-if="orderBackStatus != 1" class="yungu-my-order-footer-last-a confirm" @click.stop="orderReceiving">确认收货</a>
        </template>
        <!-- 历史订单 -->
        <template v-else>
          <a class="yungu-my-order-footer-first-a complaint" @click.stop="orderComplaint">投诉</a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import OrderGoodsItem from '../components/OrderGoodsItem.vue'
  export default {
    props: {
      order: {}
    },
    computed: {
      // 计算总商品数量
      goodsNum: function () {
        var goodsNum = 0
        this.order.mallOrderGoodsSnapList.forEach(item => {
          goodsNum += parseInt(JSON.parse(item.jsonText).goodsNum)
        })
        return goodsNum
      },
      // 格式化订单状态
      orderStatus () {
        if (this.order.status === 5 && this.order.backStatus === 1) {
          return '退款成功  订单关闭'
        }
        if (this.orderBackStatus === 1) {
          return '申请退款'
        }
        return ['订单关闭', '等待付款', '待发货', '已发货', '订单取消', '交易完成'][this.order.status]
      },
      orderBackStatus () {
        // 退货状态(0:退款审核中；1：审核通过；2：审核未通过；3：无操作；4：待收货；5：交易完成)
        if (this.order.backStatus !== 3 && this.order.backStatus !== 2) {
          return 1  // 订单退货流程进行中
        }
        var goods = this.order.mallOrderGoodsSnapList
        for (var i = 0; i < goods.length; i++) {
          if (goods[i].backStatus !== 2 && goods[i].backStatus !== 3) {
            return 2  // 订单商品退货流程中
          }
        }
        return 0  // 当前订单不在退货流程中
      }
    },
    components: {
      OrderGoodsItem
    },
    methods: {
      // 跳转订单详情
      orderDetail () {
        this.$router.push(`order-detail/${this.order.id}`)
      },
      // 取消订单
      orderCancel () {
        this.$_http().cacelOrder({
          orderId: this.order.id
        }).then(res => {
          const self = this
          this.$vux.alert.show({
            title: '提示信息',
            content: '操作成功',
            onHide () {
              self.$emit('refresh')
            }
          })
        })
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

<style scoped>
.yungu-my-order-content span.yungu-my-order-btn{
  border: none;
}
</style>
