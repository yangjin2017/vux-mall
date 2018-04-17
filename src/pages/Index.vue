<template>
  <div class="page page-current">
    <nav-bar :title="title">
      <a slot="right" class="yungu-button yungu-button-link pull-right row open-panel yungu-open-masking" data-panel='#panel-right-demo'>
        <span class="yungu-icon yungu-icon-filter col-50"></span>
        <span class="col-50" @click="showFilter = !showFilter">筛选</span>
        <!-- <x-switch class="col-50" title="" v-model="showFilter"></x-switch> -->
      </a>
    </nav-bar>
    <router-view></router-view>
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
                  <span class="yungu-filter-name" 
                    v-for="item in category[categoryType]"
                    :key="item.id"
                    :title="item.id"
                    :class="{ active: item.id == categoryType2.id }"
                    @click="category1Click">{{ item.categoryCnName }}</span>
                </div>
              </li>
              <li id="li_2" v-if="categoryType2.id">
                <div id="categoryType2" class="categoryClass">{{ categoryType2.categoryCnName }}</div>
                <div id="category2" class="categoryClass">
                  <span class="yungu-filter-name" 
                    v-for="item in category2"
                    :key="item.id"
                    :title="item.id"
                    :class="{ active: item.id == categoryId }"
                    @click="category2Click">{{ item.categoryCnName }}</span>
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
      <router-link :to="'/index/goods/' + categoryId" class="tab-item">
        <span class="icon icon-menu"></span>
        <span class="tab-label">首页</span>
      </router-link>
      <router-link to="/index/orders" class="tab-item">
        <span class="icon icon-me"></span>
        <span class="tab-label">我的订单</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import NavBar from "../components/NavBar";
import { Popup, TransferDom } from "vux";
export default {
  data: function() {
    return {
      type: '',
      showFilter: false,
      categoryId: '',
      categoryType: '',
      category: {},
      categoryType2: {},
      category2: null
    };
  },
  watch: {
    $route: "tabSwitch"
  },
  computed: {
    categoryFmt() {
      return {
        medical: '药械商品',
        ordinary: '普通商品'
      }[this.categoryType]
    },
    title() {
      return {
        goods: '商品列表',
        orders: '我的订单'
      }[this.type]
    }
  },
  methods: {
    tabSwitch() {
      if (this.$route.path.indexOf('orders') > 0) {
        this.type = 'orders'
      } else if (this.$route.path.indexOf('goods') > 0) {
        this.type = 'goods'
      }
    },
    // 商品一级分类选择
    categoryClick(e) {
      this.categoryType = e.target.id   
      this.categoryType2 = {}   
    },
    // 商品二级分类选择
    category1Click(e){
      this.categoryId = e.target.title
      this.categoryType2 = {
        id: e.target.title,
        categoryCnName: e.target.innerHTML
      }
      this.$_http.categories({
        categoryId: this.categoryId
      }).then(data => {
        this.category2 = data
      })
    },
    // 商品三级分类选择
    category2Click(e){
      this.categoryId = e.target.title
    },
    // 商品分类选择重置
    categoryCancel(){
      this.categoryId = ''
      this.categoryType = ''
      this.categoryType2 = {}
    },
    // 商品分类选择完成
    categorySubmit(){
      this.$router.push(`/index/goods/${this.categoryId}`)
      this.showFilter = false
    },
    // 初始化商品分类
    initCategory() {
      this.$_http.categoryMedical().then(data => {
        this.category.medical = data
      })
      this.$_http.categoryOrdinary().then(data => {
        this.category.ordinary = data
      })
    }
  },
  created(){
    this.initCategory()
  },
  components: {
    NavBar,
    Popup
  },
  directives: {
    TransferDom
  }
};
</script>

<style>
.bar-tab .tab-item.router-link-active {
  color: #0894ec;
}
.page {
  z-index: 100;
}
</style>