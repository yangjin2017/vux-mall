<template>
  <div class="yungu-my-orders-card">
    <div class="yungu-my-order-header">
      <span class="yungu-order-seller">{{ order.merchantName }}</span>
      <span class="yungu-order-detail"></span>
      <span class="yungu-order-pay">
        <span class="color-default">{{ order.status | orderStatusFilter }}</span>
      </span>
    </div>
    <div class="yungu-my-order-content">
      <ul>
        <template v-for="item in order.mallOrderGoodsSnapList">
          <order-goods-item :key="item.id" :goods="JSON.parse(item.jsonText)"></order-goods-item>
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
        <a class="yungu-my-order-footer-first-a complaint" order-id="'+value.id+'" href="javascript:void(0);">投诉</a>
      </div>
    </div>
  </div>
</template>

<script>
  import OrderGoodsItem from '../components/OrderGoodsItem'
  export default {
    props: {
      order: {}
    },
    filters: {
      orderStatusFilter: function (status) {
        return ['订单关闭', '等待付款', '待发货', '已发货', '订单取消', '交易完成'][status]
      }
    },
    computed: {
      goodsNum: function () {
        var goodsNum = 0
        this.order.mallOrderGoodsSnapList.forEach(item => {
          goodsNum += parseInt(JSON.parse(item.jsonText).goodsNum)
        })
        return goodsNum
      }
    },
    components: {
      OrderGoodsItem
    }
  }
</script>