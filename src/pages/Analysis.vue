<template>
  <div class="content">
    <div class="yungu-analysis-code" v-if="isWeixin">请点击右上方按钮，使用浏览器打开并访问</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isWeixin: this.$_isWeixin() // 判断当前浏览器环境是否为微信内置浏览器
    }
  },
  created() {
    if (this.isWeixin) return
    let m = this.$route.query.m
    if (m === '3') {
      let user = this.$_localUser.getUser
      if (user.userId == null || user.token == null) {
        this.$router.push('supplier-login')
      } else {
        this.$router.push('supplier-order-confirm')
      }
    } else {
      this.login()
    }
  },
  methods: {
    login() {
      let m = this.$route.query.m
      let p = this.$route.query.p
      let v = this.$route.query.v
      this.$_http().scanLogin({
        p: p
      }).then(res => {
        this.$_localUser.removeUser()
        this.$_localUser.setUserId(res.mallSysUserInfoId)
        this.$_localUser.setToken(res.token)
        switch (parseInt(m)) {
          case 1:
            this.$router.push(`order-confirm/${v}/scan`)
            break
          case 2:
            this.$router.push('/orders')
            break
        }
      })
    }
  }
}
</script>

<style>
.yungu-analysis-code {
  text-align: center;
  font-size: 0.9rem;
  margin-top: 40%;
  padding: 0rem 1.6rem 0rem 1.6rem;
}
</style>
