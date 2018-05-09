<template>
  <div class="page page-current">
    <a class="yungu-goods-detail-back" @click="back"></a>
    <div class="content yungu-goods-detail">
      <swiper dots-position="center" loop auto height="12.5rem">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in swiperList" :key="index">
          <img :src="item.src" @click="swiperClick(index)">
        </swiper-item>
      </swiper>
      <div v-transfer-dom>
        <previewer :list="swiperList" ref="previewer"></previewer>
      </div>
      <div class="yungu-goods-detail-header">
        <div class="yungu-goods-detail-name">{{ goods.goodsName }}</div>
        <div class="yungu-goods-detail-desc">{{ goods.goodsIntroduction }}</div>
        <div class="yungu-goods-detail-spec">
          <div class="yungu-goods-detail-spec-title">规格 :</div>
          <div class="yungu-goods-detail-spec-option">
            <a v-for="(item, index) in goods.mallGoodsDetailsSpecTVoList" :key="item.id" class="spec" :class="{ active: item.id == bookSpec.id }" @click="chooseSpec(index)">{{ item.specName }}</a>
          </div>
        </div>
        <div class="yungu-goods-detail-num">
          <x-number title="数量 :" v-model="bookNum" fillable width="3rem" align="left" :max="999" :min="bookSpec.specBookMin || 1"></x-number>
          <div class="bookMin" v-if="bookSpec.specBookMin">最小起订量 : {{ bookSpec.specBookMin }}</div>
        </div>
        <div class="yungu-goods-detail-price">
          <span class="yungu-goods-detail-price-now">¥
            <template v-if="bookSpec.priceSpec">{{ bookSpec.priceSpec | priceFormat }}</template>
            <template v-else-if="priceSize.min == priceSize.max">{{ priceSize.min | priceFormat }}</template>
            <template v-else>{{ priceSize.min | priceFormat }} ~ {{ priceSize.max | priceFormat }}</template>
          </span>
        </div>
        <!--商品说明-->
        <div class="yungu-goods-detail-content">
          <div class="buttons-tab" data-offset="44">
            <a v-for="(item, index) in goods.mallGoodsPartList" :key="item.id" :id="'a-tab' + index" class="tab-link button">{{ item.partTitel }}</a>
          </div>

          <div class="tabs yungu-good-detail-tab">
            <div class="tab"></div>
            <iframe v-for="(item, index) in goods.mallGoodsPartList" :key="index" :src="item.partUrl" frameborder="0" scrolling="no"></iframe>
          </div>
        </div>
        <div class="yungu-disabled-content"></div>
      </div>
    </div>
    <nav class="bar bar-tab yungu-goods-detail-nav">
      <!--<a href="#" class="yungu-goods-detail-add-cart">加入购物车</a>-->
      <a @click="purchase" class="yungu-goods-detail-pay">立即购买</a>
    </nav>
  </div>
</template>

<script>
import {
  Previewer,
  Swiper,
  SwiperItem,
  XNumber,
  TransferDom
} from 'vux'
export default {
  data() {
    return {
      goods: {},
      bookNum: 1,
      bookSpec: {}
    }
  },
  computed: {
    swiperList() {
      var arr = []
      arr.push(this.goods.goodsImg)
      arr = arr.concat(this.goods.mallGoodsGallerys)
      return arr.map((item, index) => {
        return { src: item }
      })
    },
    priceSize() {
      if (!this.goods.mallGoodsDetailsSpecTVoList) {
        return ''
      }
      let min = this.goods.mallGoodsDetailsSpecTVoList[0].priceSpec
      let max = this.goods.mallGoodsDetailsSpecTVoList[0].priceSpec
      this.goods.mallGoodsDetailsSpecTVoList.map((item, index) => {
        if (min > item.priceSpec) {
          min = item.priceSpec
        } else if (max < item.priceSpec) {
          max = item.priceSpec
        }
      })
      return {
        min: min,
        max: max
      }
    },
    goodsPart() {
      if (!this.goods.mallGoodsPartList) {
        return
      }
      this.goods.mallGoodsPartList.map((item, index) => {
        this.loadGoodsPartData(item.partUrl, index)
      })
    }
  },
  components: {
    Previewer,
    Swiper,
    SwiperItem,
    XNumber
  },
  methods: {
    initData() {
      this.$_http().goodsDetail({
        goodsId: this.$route.params.goodsId
      }).then(data => {
        this.goods = data
      })
    },
    swiperClick(index) {
      this.$refs.previewer.show(index)
    },
    back() {
      this.$router.go(-1)
    },
    chooseSpec(index) {
      this.bookSpec = this.goods.mallGoodsDetailsSpecTVoList[index]
    },
    purchase() {
      if (this.$_isEmptyObject(this.bookSpec)) {
        this.$vux.alert.show({
          title: '提示信息',
          content: '请选择商品规格！',
          maskZIndex: 2000
        })
        return
      }

      this.$_http().cart({
        mallGoodsSpecTId: this.bookSpec.id,
        specNum: this.bookNum
      }).then(data => {
        this.$router.push(`/order-confirm/${data}/shop`)
      })
    },
    // TODO: 商品详情 -- 参数
    loadGoodsPartData(url, index) {}
  },
  created() {
    this.initData()
  },
  directives: {
    TransferDom
  }
}
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
.yungu-goods-detail-num {
  display: flex;
  align-items: center;
}
.yungu-goods-detail-num .weui-cell__ft {
  padding-left: 0.4rem;
}
.yungu-goods-detail-num .weui-cell {
  padding: 0;
  margin-right: 0.5rem;
}
.yungu-goods-detail-num .vux-number-input,
.yungu-goods-detail-num .vux-number-selector {
  line-height: 1.2rem;
  height: auto;
  color: #333;
}
.yungu-goods-detail-num .vux-number-selector svg {
  fill: #333;
}
</style>
