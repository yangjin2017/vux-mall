<template>
  <div class="page">
	  <nav-bar :title='title'></nav-bar>
	  <div class="content yungu-content-bgcolor">
      <div class="list-block yungu-bind-mobile">
			  <ul>
				  <li>
					  <div class="item-content">
						  <div class="item-media"><i class="icon icon-form-name"></i></div>
						  <div class="item-inner">
							  <div class="item-title label">手机号</div>
							  <div class="item-input">
								  <input type="text" placeholder="请输入手机号" name="mobile" id="mobile"/>
							  </div>
						  </div>
					  </div>
				  </li>
				  <li>
					  <div class="item-content">
						  <div class="item-media"><i class="icon icon-form-name"></i></div>
						  <div class="item-inner">
							  <div class="item-title label">验证码</div>
							  <div class="item-input">
								  <input type="text" placeholder="请输入验证码" name="verificationCode" id="verificationCode"/>
							  </div>
							  <div class="item-input">
								  <a class="yungu-bind-send-button">获取验证码</a>
							  </div>
						  </div>
					  </div>
					  <div class="item-content">
						  <div class="item-inner">
							  <div class="item-input">
								  <p><a class="yungu-bind-mobile-login">登录</a></p>
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
import NavBar from '../components/NavBar'
export default {
  data: function () {
    return {
      title: '手机号登陆',
      mobile: '',
      verificationCode: ''
    }
  },
  components: {
    NavBar
  }
}
</script>
