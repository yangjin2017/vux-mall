<template>
  <div class="page page-current">
    <nav-bar title="支付结果">
      <a class="yungu-button yungu-button-link-ok pull-right" slot="right" @click="back">
        <span class="col-100">返回</span>
      </a>
    </nav-bar>
    <div class="content yungu-content-bgcolor">
      <template v-if="status === 'A-00013'">
        <div class="yungu-pay-success-info">
          <div class="yungu-pay-bg-img"></div>
          <div class="yungu-pay-bg-text">支付成功</div>
        </div>
      </template>
      <template v-if="status === 'A-00035'">
        <div class="yungu-pay-success-info">
          <div class="yungu-pay-bg-img"></div>
          <div class="yungu-pay-bg-text">支付成功</div>
        </div>
        <div class="content-block text-center">
          <p><a class="yungu-pay-success-button">立即绑定手机号，随时掌握订单动态</a></p>
        </div>
      </template>
      <template v-if="status === 'A-00046'">
        <div class="yungu-pay-fail-info">
          <div class="yungu-pay-bg-img"></div>
          <div class="yungu-pay-bg-text">支付失败</div>
        </div>
        <div class="content-block text-center">
          <p><a class="yungu-pay-fail-button">请稍候查询支付结果或重新支付</a></p>
        </div>
      </template>
		  <div class="yungu-copyright">© 深圳市云谷创新科技有限公司</div>
	  </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar'
import { orderUtil } from '../utils/utils'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      status: ''
    }
  },
  created () {
    this.$_http().payResult({
      orderNo: orderUtil.getOrderStorage().orderNo
    }).catch(err => {
      this.status = err.code
    })
  },
  methods: {
    // 返回跳转订单列表页
    back () {
      this.$router.push('/orders')
    },
    // 绑定手机号
    bindMobile () {
      this.$router.push('/bind-mobile')
    }
  }
}
</script>
