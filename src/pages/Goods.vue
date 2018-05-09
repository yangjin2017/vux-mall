<template>
  <div>
    <nav-bar title="商品列表">
      <a slot="right" class="yungu-button yungu-button-link pull-right row open-panel yungu-open-masking" data-panel='#panel-right-demo'>
        <span class="yungu-icon yungu-icon-filter col-50"></span>
        <span class="col-50" @click="showFilter = !showFilter">筛选</span>
      </a>
    </nav-bar>
    <div class="content pull-to-refresh-content" id="content">
      <!-- 默认的下拉刷新层 -->
      <!-- <div class="pull-to-refresh-layer">
        <div class="preloader"></div>
        <div class="pull-to-refresh-arrow"></div>
      </div> -->
      <!-- 这里是页面内容区 -->
      <scroller ref="goodsScroller" lock-x :use-pulldown="true" :use-pullup="true" height="-50" @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" :pulldown-config="pulldownConfig" :pullup-config="pullupConfig">
        <div class="yungu-content-list" id="goods">
          <ul>
            <template v-for="item in goodsList">
              <goods-item :goods="item" :key="item.id" @detail="saveScroll"></goods-item>
            </template>
          </ul>
        </div>
      </scroller>
      <!-- <div class="infinite-scroll-preloader" id="infinite-scroll-preloader">
        <div class="preloader"></div>
      </div> -->
    </div>
    <!-- 分类选择弹窗 -->
    <div v-transfer-dom>
      <popup v-model="showFilter" position="right" style="background-color: #fff;">
        <div style="width: 12rem;">
          <div class="yungu-list-filter-panel">
            <ul>
              <li>
                <div>商品分类</div>
                <div id="category1">
                  <span class="yungu-filter-name" @click="categoryClick" :class="{ active: categoryType == 'medical' }" id="medical">药械商品</span>
                  <span class="yungu-filter-name" @click="categoryClick" :class="{ active: categoryType == 'ordinary' }" id="ordinary">普通商品</span>
                </div>
              </li>
              <li id="li_1" v-if="categoryType">
                <div id="categoryType" class="categoryClass">{{categoryFmt}}</div>
                <div id="category" class="categoryClass">
                  <span class="yungu-filter-name" v-for="item in category[categoryType]" :key="item.id" :title="item.id" :class="{ active: item.id == categoryType2.id }" @click="category1Click">{{ item.categoryCnName }}</span>
                </div>
              </li>
              <li id="li_2" v-if="categoryType2.id">
                <div id="categoryType2" class="categoryClass">{{ categoryType2.categoryCnName }}</div>
                <div id="category2" class="categoryClass">
                  <span class="yungu-filter-name" v-for="item in category2" :key="item.id" :title="item.id" :class="{ active: item.id == categoryId }" @click="category2Click">{{ item.categoryCnName }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="yungu-list-filter-bottons" style="width: 12rem;">
            <div class="yungu-filter-reset pull-left" @click="categoryCancel">重置</div>
            <div class="yungu-filter-submit pull-left" @click="categorySubmit">完成</div>
          </div>
        </div>
      </popup>
    </div>
    <nav class="bar bar-tab">
      <a class="tab-item active">
        <span class="icon icon-menu"></span>
        <span class="tab-label">首页</span>
      </a>
      <router-link to="/orders" class="tab-item">
        <span class="icon icon-me"></span>
        <span class="tab-label">我的订单</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import NavBar from '../components/NavBar'
import GoodsItem from '../components/GoodsListItem'
import { Popup, TransferDom, Scroller } from 'vux'
export default {
  name: 'goods',
  data: function() {
    return {
      showFilter: false,
      categoryId: '',
      categoryType: '',
      category: {},
      categoryType2: {},
      category2: null,
      pageNo: 1,
      pageSize: 15,
      hospitalCode: '',
      goodsList: [],
      scrollTop: 0,
      mescroll: null,
      pulldownConfig: {
        content: '下拉刷新',
        downContent: '下拉刷新',
        upContent: '松开刷新页面'
      },
      pullupConfig: {
        downContent: '加载更多',
        upContent: '加载更多'
      }
    }
  },
  computed: {
    categoryFmt() {
      return {
        medical: '药械商品',
        ordinary: '普通商品'
      }[this.categoryType]
    }
  },
  methods: {
    // 商品一级分类选择
    categoryClick(e) {
      this.categoryType = e.target.id
      this.categoryType2 = {}
    },
    // 商品二级分类选择
    category1Click(e) {
      this.categoryId = e.target.title
      this.categoryType2 = {
        id: e.target.title,
        categoryCnName: e.target.innerHTML
      }
      this.$_http().categories({
        categoryId: this.categoryId
      })
      .then(data => {
        this.category2 = data
      })
    },
    // 商品三级分类选择
    category2Click(e) {
      this.categoryId = e.target.title
    },
    // 商品分类选择重置
    categoryCancel() {
      this.categoryId = ''
      this.categoryType = ''
      this.categoryType2 = {}
    },
    // 商品分类选择完成
    categorySubmit() {
      this.showFilter = false
      this.refresh()
    },
    // 初始化商品分类
    initCategory() {
      this.$_http().categoryMedical().then(data => {
        this.category.medical = data
      })
      this.$_http().categoryOrdinary().then(data => {
        this.category.ordinary = data
      })
    },
    // 获取商品列表数据
    initData: function() {
      this.$_http().goods({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        categoryId: this.categoryId,
        hospitalCode: this.hospitalCode
      }).then(response => {
        this.goodsList = this.goodsList.concat(response.list)
      })
    },
    // 刷新页面
    refresh: function() {
      this.pageNo = 1
      this.goodsList = []
      this.initData()
      this.$nextTick(() => {
        this.$refs.goodsScroller.reset()
        this.$refs.goodsScroller.donePulldown()
      })
    },
    // 记录滚动条位置
    saveScroll() {
      this.scrollTop = document.getElementById('content').scrollTop
    },
    // 加载更多数据
    loadMore () {
      this.pageNo++
      this.initData()
      this.$nextTick(() => {
        this.$refs.goodsScroller.reset()
        this.$refs.goodsScroller.donePullup()
      })
    }
  },
  created() {
    this.initCategory()
    this.initData()
  },
  // 当页面重新显示时将滚动条回滚到之前记录的位置
  activated() {
    document.getElementById('content').scrollTop = this.scrollTop
  },
  components: {
    NavBar,
    Popup,
    Scroller,
    GoodsItem
  },
  directives: {
    TransferDom
  }
}
</script>

<style>
.page {
  z-index: 100;
}
.pull-to-refresh-content.content{
  top: 2.2rem;
  bottom: 2.5rem;
}
</style>