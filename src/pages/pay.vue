<template>
  <div class="page page-current">
    <nav-bar title="支付结算">
      <a class="yungu-button yungu-button-link-ok pull-right" slot="right" @click="back">
        <span class="col-100">返回</span>
      </a>
    </nav-bar>
    <div class="content yungu-content-bgcolor">
      <div class="yungu-pay-confirm-info">
        <div class="yungu-pay-confirm-bg-img"></div>
        <div>总金额</div>
        <div class="yungu-pay-confirm-bg-text">{{ total | priceFormat }}</div>
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
import { orderUtil } from '../utils/utils'
export default {
  props: ['payType'],
  components: {
    NavBar
  },
  data () {
    return orderUtil.getOrderStorage()
  },
  methods: {
    back () {
      this.$router.push('/orders')
    },
    submit () {
      const url = ['weixinpay', 'alipay'][this.payType - 1]
      this.$_http()[url]({
        v: this.orderNo
      }).then(res => {
        if (this.payType === '1') {
          window.location.href = res
        } else if (this.payType === '2') {
          var temp = document.createElement('div')
          temp.innerHTML = res
          document.getElementsByTagName('body')[0].appendChild(temp)
        }
      }).catch(err => {
        switch (err.code) {
          case 'A-00047':
            this.$router.push('/pay-success')
            break

          case 'A-00029':

            break

          default:
            break
        }
      })
    }
  }
}
</script>
