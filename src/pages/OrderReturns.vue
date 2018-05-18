<template>
  <div class="page page-current">
    <nav-bar title="申请退款" :is-back="true"></nav-bar>
    <div class="content yungu-refund-logistics">
      <label class="yungu-refund-logistics-title">退货地址：</label>
      <div class="yungu-content-list list-block">
        <ul>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title label">收货人</div>
              <div class="item-input">
                <input type="text" v-model="consignee" disabled>
              </div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title label">联系电话</div>
              <div class="item-input">
                <input type="text" v-model="consigneeMoble" disabled>
              </div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title label">收货地址</div>
              <div class="item-input">
                <input type="text" v-model="receivingAddress" disabled>
              </div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title label">物流公司</div>
              <!--<div class="item-after">请选择 <span class="icon icon-right"></span></div>-->
              <div class="item-input">
                <input type="text" v-model="logisticsCompany" placeholder="请输入物流公司" maxlength="20">
              </div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title label">快递单号</div>
              <div class="item-input">
                <input type="number" v-model="logisticsNumber" placeholder="请输入快递单号" maxlength="40">
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="yungu-addresses-add" id="submitBtn">
      <a>提&nbsp;交</a>
    </div>
  </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
export default {
  components: { NavBar },
  data() {
    return {
      consignee: '',
      consigneeMoble: '',
      receivingAddress: '',
      logisticsCompany: '',
      logisticsNumber: '',
      receivingAddressId: ''
    }
  },
  created() {},
  methods: {
    initData() {
      this.$_http().returnsAddress({
        orderId: this.$route.query.orderId
      }).then(data => {
        this.consignee = data.consignee
        this.consigneeMoble = data.consigneeMoble
        this.receivingAddress = data.receivingAddress
        this.receivingAddressId = data.id
      })
    },
    submit() {
      if (!this.logisticsCompany) {
        this.$vux.toast.text('请输入物流公司', 'bottom')
        return
      }
      if (!this.logisticsNumber) {
        this.$vux.toast.text('请输入正确的快递单号', 'bottom')
        return
      }
      let url = 'orderReturns'
      if (this.$route.query.specId) {
        url = 'goodsReturns'
      }
      this.$_http()[url](this.$data).then(res => {
        this.$vux.alert.show({
          title: '提示信息',
          content: '您的退款申请已提交，请等待卖家审核',
          onHide() {
            this.$router.push('/orders')
          }
        })
      })
    }
  }
}
</script>
