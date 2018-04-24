<template>
  <div class="page page-current">
    <nav-bar title="支付结算"></nav-bar>
    <div class="content yungu-content-bgcolor">
      <div class="yungu-pay-confirm-info">
        <div class="yungu-pay-confirm-bg-img"></div>
        <div>总金额</div>
        <div class="yungu-pay-confirm-bg-text">{{ totalPrice }}</div>
      </div>
      <div class="content-block text-center">
        <p><a class="yungu-pay-confirm-button" @click="submit">确认支付</a></p>
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
  props: ['payType', 'orderNo', 'totalPrice'],
  components: {
    NavBar
  },
  methods: {
    submit(){
      
    }
  }
}
</script>
