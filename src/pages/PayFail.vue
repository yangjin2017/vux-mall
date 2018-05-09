<template>
  <div class="page page-current">
    <nav-bar>
      <router-link to="/orders" slot="right" class="yungu-button yungu-button-link-ok pull-right">
        <span class="col-50">完成</span>
      </router-link>
    </nav-bar>
    <div class="content yungu-content-bgcolor">
      <div class="yungu-pay-fail-info">
        <div class="yungu-pay-bg-img"></div>
        <div class="yungu-pay-bg-text">发起支付失败</div>
      </div>
      <div class="content-block text-center">
        <p><a class="yungu-pay-fail-button">请稍候重新扫描二维码</a></p>
      </div>
		  <div class="yungu-copyright">
			  © 深圳市云谷创新科技有限公司
		  </div>
	  </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
export default {
  components: {
    NavBar
  }
}
</script>
