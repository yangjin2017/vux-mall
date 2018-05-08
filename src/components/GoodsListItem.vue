<template>
  <li class="yungu-item-content row no-gutter" @click="openDetail">
    <div class="yungu-item-image">
      <img :src="goods.goodsImg" />
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
  methods: {
    openDetail() {
      this.$emit('detail')
      this.$router.push(`/goods-detail/${this.goods.id}`)
    }
  }
}
</script>
