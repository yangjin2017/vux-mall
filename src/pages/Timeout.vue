<template>
  <div class="page page-current">
	  <nav-bar></nav-bar>
	  <div class="content yungu-content-bgcolor">
      <div class="yungu-pay-fail-info">
        <div class="yungu-timeout-bg-img"></div>
        <div class="yungu-pay-bg-text">登录超时</div>
      </div>
      <div class="content-block text-center">
        <p><a class="yungu-pay-fail-button">扫描二维码登录（院内）</a></p>
        <p><router-link to="/login" class="yungu-timeout-login-button">手机验证码登录</router-link></p>
      </div>
		  <div class="yungu-copyright">© 深圳市云谷创新科技有限公司</div>
	  </div>
	</div>
</template>

<script>
import NavBar from '../components/NavBar'
export default {
  components: {
    NavBar
  }
}
</script>
