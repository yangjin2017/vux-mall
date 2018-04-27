<template>
  <div class="page page-current">
    <nav-bar title="绑定手机号"></nav-bar>
    <div class="content yungu-content-bgcolor">
		<!-- 这里是页面内容区 -->
		  <div class="list-block yungu-bind-mobile">
			  <ul>
				  <li>
					  <div class="item-content">
						  <div class="item-media"><i class="icon icon-form-name"></i></div>
						  <div class="item-inner">
							  <div class="item-title label">手机号</div>
							  <div class="item-input">
								  <input type="text" placeholder="请输入手机号" v-model="mobile"/>
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
								  <input type="text" placeholder="请输入验证码" v-model="code"/>
							  </div>
							  <div class="item-input">
								  <a class="yungu-bind-send-button" :class="{ 'disabled': count > 0 }" @click="verify">{{ count > 0 ? `重新发送(${count})` : '获取验证码' }}</a>
							  </div>
						  </div>
					  </div>
					  <div class="item-content">
						  <div class="item-inner">
							  <div class="item-input">
								  <p><a class="yungu-bind-mobile-login">绑定</a></p>
							  </div>
						  </div>
					  </div>
				  </li>
			  </ul>
		  </div>
		  <div class="yungu-copyright">© 深圳市云谷创新科技有限公司</div>
	  </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar'
import { regexUtil } from '../utils/utils'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      mobile: '',
      code: '',
      count: 0
    }
  },
  watch: {
    count (val) { // 倒计时
      if (val > 0) {
        setTimeout(() => {
          this.count--
        }, 1000)
      }
    }
  },
  methods: {
    verify () {  // 发送短信验证码
      if (this.count > 0) return
      if (!regexUtil.isPhone(this.mobile)) {
        this.$vux.toast.text('请输入正确的手机号码', 'bottom')
        return
      }
      this.$_http(this.$_api.SENDSMS, {
        mobile: this.mobile
      }).then(res => {
        this.count = 60
        this.$vux.toast.text('验证码已发送，请注意查收', 'bottom')
      }).catch(err => {
        switch (err.code) {
          case 'A-00012':
            this.$vux.toast.text('手机号码不正确', 'bottom')
            break

          case 'A-00020':
            this.$vux.toast.text('当前登录用户已绑定手机号码', 'bottom')
            break

          case 'A-00011':
            this.$vux.toast.text('短信验证码发送失败', 'bottom')
            break

          default:
            this.$vux.toast.text('服务异常', 'bottom')
            break
        }
      })
    }
  },
  bindMobile () {
    if (!regexUtil.isPhone(this.mobile)) {
      this.$vux.toast.text('请输入正确的手机号码', 'bottom')
      return
    }
    if (!regexUtil.isCode(this.code)) {
      this.$vux.toast.text('验证码不正确', 'bottom')
      return
    }
    this.$_http(this.$_api.BINDMOBILE, {
      mobile: this.mobile,
      code: this.code
    }).then(res => {
      this.$router.push('/goods')
    }).catch(err => {
      switch (err.code) {
        case 'A-00013':
          this.$vux.toast.text('已绑定手机号码', 'bottom')
          break

        case 'A-00014':
          this.$vux.toast.text('验证码已失效', 'bottom')
          break

        case 'A-00015':
          this.$vux.toast.text('验证码错误', 'bottom')
          break

        default:
          this.$vux.toast.text('服务异常', 'bottom')
          break
      }
    })
  }
}
</script>
