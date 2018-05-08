<template>
  <div class="page">
    <nav-bar title="操作员登录"></nav-bar>
    <div class="content yungu-content-bgcolor">
      <div class="list-block yungu-bind-mobile">
			  <ul>
				  <li>
					  <div class="item-content">
						  <div class="item-media"><i class="icon icon-form-name"></i></div>
						  <div class="item-inner">
							  <div class="item-title label">手机号</div>
							  <div class="item-input">
								  <input type="text" placeholder="手机号码" v-model="phone" v-verify:Mobile tag="手机号码不正确" />
							  </div>
						  </div>
					  </div>
				  </li>
				  <li>
					  <div class="item-content">
						  <div class="item-media"><i class="icon icon-form-name"></i></div>
						  <div class="item-inner">
							  <div class="item-title label">密码</div>
							  <div class="item-input">
								  <input type="password" placeholder="密码" v-model="pwd"/>
							  </div>
						  </div>
					  </div>
					  <div class="item-content">
						  <div class="item-inner">
							  <div class="item-input">
								  <p><a class="yungu-bind-mobile-login" id="login">登录</a></p>
							  </div>
						  </div>
					  </div>
				  </li>
			  </ul>
		  </div>
		  <div class="yungu-copyright">
			  © 深圳市云谷创新科技有限公司
		  </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import verify from '../utils/validate'
import Vue from 'vue'
Vue.use(verify)
export default {
  components: {
    NavBar
  },
  data: function () {
    return {
      phone: '',
      pwd: ''
    }
  }
}

/**
 * 登录
 */
function login (vm) {
  vm.$_http().login({
		username: vm.phone,
		password: vm.pwd
  }).then(res => {
    vm.$_localUser.setUserId(res.mallSysUserInfo.id)
    vm.$_localUser.setToken(res.mallSysUser.token)
    vm.$router.push('suppilerOrderConfirm')
  })
}
</script>
