<template>
  <li class="yungu-item-content row no-gutter" @click="openDetail">
    <div class="yungu-item-image">
      <x-img :src="goods.goodsImg" container="div.scroll-container" :offset="100" error-class="img-err" default-src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="></x-img>
    </div>
    <div class="yungu-item-desc">
      <div class="yungu-item-desc-name">
        <b>{{goods.goodsName}}</b>
      </div>
      <div class="yungu-item-desc-spec">{{ goods.goodsIntroduction }}</div>
      <div class="yungu-item-desc-price">¥ {{ goods.priceSpec | priceFormat }}</div>
    </div>
  </li>
</template>

<script>
import { XImg } from 'vux'
export default {
  props: {
    goods: {
      id: '',
      goodsName: '',
      goodsImg: '',
      goodsSn: '',
      goodsStatus: '',
      isSpecial: '',
      goodsIntroduction: '',
      priceSpec: ''
    }
  },
  components: {
    XImg
  },
  methods: {
    openDetail() {
      this.$emit('detail')
      this.$router.push(`/goods-detail/${this.goods.id}`)
    }
  }
}
</script>
