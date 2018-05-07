<template>
  <li>
    <div class="yungu-my-order-content-image">
      <x-img :src="goods.goodsImg || goods.specImg" default-src="http://192.168.80.35:8020/mall-web/img/none-image.png" container=".yungu-my-orders-tab-content" :offset="100"></x-img>
    </div>
    <div class="yungu-my-order-content-detail">
      <span class="yungu-my-order-content-detail-name">{{ goods.goodsName || goods.mallGoodsName }}</span>
      <span class="yungu-my-order-content-detail-desc">规格 : {{ goods.specName }}</span>
    </div>
    <div class="yungu-my-order-content-price">
      <span class="yungu-my-order-conent-price-now"><small>￥{{ (goods.priceSpec || goods.specPrice) | priceFormat }}</small> </span>
      <span class="yungu-my-order-conent-price-num">× {{ goods.goodsNum || goods.specNum }}</span>
      <slot name="refund-btn"></slot>
    </div>
  </li>
</template>

<script>
  import { XImg } from 'vux'
  export default {
    props: ['goods'],
    components: {
      XImg
    }
  }
</script>