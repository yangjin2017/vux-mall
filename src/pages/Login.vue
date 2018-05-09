<template>
  <div class="page page-current">
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
                  <input type="text" placeholder="请输入验证码" v-model="verificationCode"/>
                </div>
                <div class="item-input">
                  <a class="yungu-bind-send-button" :class="{ 'disabled': count > 0 }" @click="verify">{{ count > 0 ? `重新发送(${count})` : '获取验证码' }}</a>
                </div>
              </div>
            </div>
            <div class="item-content">
              <div class="item-inner">
                <div class="item-input">
                  <p><a class="yungu-bind-mobile-login" @click="login">登录</a></p>
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
import { regexUtil } from '../utils/utils'
export default {
  data: function () {
    return {
      title: '手机号登陆',
      mobile: '',
      verificationCode: '',
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
  components: {
    NavBar
  },
  methods: {
    verify () {  // 发送短信验证码
      if (this.count > 0) return
      if (!regexUtil.isPhone(this.mobile)) {
        this.$vux.toast.text('请输入正确的手机号码', 'bottom')
        return
      }
      this.$_http().loginSendSms({
        mobile: this.mobile
      }).then(res => {
        this.count = 60
        this.$vux.toast.text('验证码已发送，请注意查收', 'bottom')
      }).catch(err => {
        switch (err.code) {
          case 'A-00012':
            this.$vux.toast.text('手机号码不正确', 'bottom')
            break

          case 'A-00002':
            this.$vux.toast.text('手机号码不存在', 'bottom')
            break

          case 'A-00011':
            this.$vux.toast.text('短信验证码发送失败，请稍候再试', 'bottom')
            break

          default:
            this.$vux.toast.text('服务异常', 'bottom')
            break
        }
      })
    },
    login () {
      const self = this
      if (!regexUtil.isPhone(self.mobile)) {
        this.$vux.toast.text('请输入正确的手机号码', 'bottom')
        return
      }
      if (!regexUtil.isCode(self.verificationCode)) {
        this.$vux.toast.text('验证码不正确', 'bottom')
        return
      }

      self.$_http().login({
        mobile: self.mobile,
        verificationCode: self.verificationCode
      }).then(res => {
        self.$_localUser.setUserId(res.mallSysUserInfo.id)
        self.$_localUser.setToken(res.mallSysUser.token)
        self.$router.go(-2)
      }).catch(err => {
        self.$vux.toast.text(err.msg, 'bottom')
      })
    }
  }
}
</script>
