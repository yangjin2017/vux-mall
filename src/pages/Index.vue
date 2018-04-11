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
                  <span class="yungu-filter-name" c-id="" id="medical">药械商品</span>
                  <span class="yungu-filter-name" c-id="" id="ordinary">普通商品</span>
                </div>
              </li>
              <li id="li_1" style="display: none">
                <div id="categoryType" class="categoryClass"></div>
                <div id="category" class="categoryClass"></div>
              </li>
              <li id="li_2" style="display: none">
                <div id="categoryType2" class="categoryClass"></div>
                <div id="category2" class="categoryClass"></div>
              </li>
            </ul>
          </div>
          <div class="yungu-list-filter-bottons" style="width: 12rem;">
              <div class="yungu-filter-reset pull-left">重置</div>
              <div class="yungu-filter-submit pull-left">完成</div>
          </div>
        </div>
      </popup>
    </div>
    <nav class="bar bar-tab">
      <router-link to="/index/goods" class="tab-item">
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
      title: "商品列表",
      showFilter: false,
      categoryId: ''
    };
  },
  watch: {
    $route: "tabSwitch"
  },
  methods: {
    tabSwitch() {
      this.title = this.$route.path === "/index/goods" ? "商品列表" : "我的订单";
    }
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