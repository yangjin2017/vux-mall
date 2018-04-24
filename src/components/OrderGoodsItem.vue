<template>
  <li>
    <div class="yungu-my-order-content-image">
      <img :src="goods.goodsImg || goods.specImg">
    </div>
    <div class="yungu-my-order-content-detail">
      <span class="yungu-my-order-content-detail-name">{{ goods.goodsName || goods.mallGoodsName }}</span>
      <span class="yungu-my-order-content-detail-desc">规格 : {{ goods.specName }}</span>
    </div>
    <div class="yungu-my-order-content-price">
      <span class="yungu-my-order-conent-price-now"><small>￥{{ (goods.priceSpec || goods.specPrice) | priceFormat }}</small> </span>
      <span class="yungu-my-order-conent-price-num">× {{ goods.goodsNum || goods.specNum }}</span>
    </div>
  </li>
</template>

<script>
  export default {
    props: {
      goods: {}
    }
  }
</script>