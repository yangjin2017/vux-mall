<template>
  <div class="page page-current">
    <nav-bar :is-back="true" title="投诉"></nav-bar>
    <div class="content yungu-content-bgcolor">
      <div class="yungu-pay-success-info">
        <div class="yungu-order-complaint">
          <div class="yungu-order-complaint-title">投诉内容</div>
          <div class="yungu-order-complaint-content">
            <textarea id="complaint" v-model="complaint" placeholder="请输入投诉内容（两百字以内,可不填）" maxlength="200"></textarea>
          </div>
        </div>
      </div>
      <div class="content-block text-center">
        <p><a class="yungu-pay-success-button">提交</a></p>
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
  },
  data () {
    return {
      complaint: ''
    }
  },
  props: ['orderId'],
  methods: {
    submit () {
      this.$_http(this.$_api.ORDERCOMPLAINT, {
        orderId: this.orderId
      }).then(res => {
        this.$vux.toast.text('投诉成功', 'bottom')
        setTimeout(() => {
          this.$router.push('goods')
        }, 1000)
      })
    }
  }
}
</script>
