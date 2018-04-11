<template>
  <div class="content pull-to-refresh-content">
    <!-- 默认的下拉刷新层 -->
    <div class="pull-to-refresh-layer">
      <div class="preloader"></div>
      <div class="pull-to-refresh-arrow"></div>
    </div>
    <!-- 这里是页面内容区 -->
    <div class="yungu-content-list">
      <ul id="goods">
        <template v-for="item in goodsList">
          <goods-item :goods="item" :key="item.id"></goods-item>
        </template>
      </ul>
      <div class="infinite-scroll-preloader" id="infinite-scroll-preloader">
        <div class="preloader"></div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from '../components/GoodsListItem'
export default {
  data: function () {
    return {
      pageNo: 1,
      pageSize: 15,
      categoryId: '',
      hospitalCode: '',
      goodsList: []
    }
  },
  methods: {
    initData: function () {
      this.$_http({
        url: 'app/mall-goods/goods',
        type: 'get',
        data: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          categoryId: this.categoryId,
          hospitalCode: this.hospitalCode
        }
      }).then(response => {
        this.goodsList = this.goodsList.concat(response.list)
      })
    },
    refresh: function () {
      this.pageNo = 1
      this.goodsList = []
      this.initData()
    }
  },
  created: function () {
    this.initData()
  },
  components: {
    GoodsItem
  }
}
</script>

<style>
</style>