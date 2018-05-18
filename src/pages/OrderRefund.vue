<template>
  <div class="page page-current">
    <nav-bar title="申请退款" :is-back="true"></nav-bar>
    <div class="content yungu-content-refund">
      <div class="yungu-my-order-content">
        <ul>
          <template v-for="item in goods">
            <order-goods-item :key="item.id" :goods="JSON.parse(item.jsonText)"></order-goods-item>
          </template>
        </ul>
      </div>
      <div class="list-block yungu-list-block">
        <ul>
          <li class="item-content">
            <div class="item-inner" @click="refundReasonChoose = true">
              <div class="item-title label">退款原因</div>
              <a class="item-after open-popup">
                <span id="refundReason">{{ refundReason ? refundReason : '请选择' }}</span>
                <span class="icon icon-right"></span>
              </a>
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title label">退款金额:</div>
              <div class="item-input yungu-order-refund-price" v-show="refundMoneyShow" @click="refundMoneyShow = false">
                <small>￥</small>
                <span id="refundPrice">{{ (refundMoney > 0 ? refundMoney : total) | priceFormat }}</span>
                <span class="yungu-refund-tips">（退款金额支持手动输入）</span>
              </div>
              <div class="item-input" id="refundPriceInput" v-show="!refundMoneyShow">
                <input type="number" v-focus="!refundMoneyShow" v-model="refundMoney" max="total" min="0" @blur="refundMoneyShow = true">
              </div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title label">退款说明:</div>
              <div class="item-input">
                <input type="text" v-model="refundInstruction" placeholder="请输入退款原因" maxlength="30">
              </div>
            </div>
          </li>
          <li class="item-content yungu-refund-item-content">
            <div class="item-inner">
              <div class="item-title label">上传凭证:</div>
              <input type="file" hidden id="fileInput" accept="image/*" @change="imageSelected"/>
            </div>
            <div class="row" id="mallRefundOrderGoodsSnapList">
              <div class="col-33" v-for="(item, index) in voucher" :key="index" @click="updateImg(index)">
                <img :src="item">
              </div>
              <div class="col-33 add" v-if="voucher.length < 3" @click="imageSelect">
                <img src="../assets/img/bg_picture.png" />
                <p>上传凭证</p>
                <p>(最多三张)</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="yungu-addresses-add" id="submitBtn"><a>提&nbsp;交</a></div>
    </div>
    <div v-transfer-dom>
      <popup v-model="refundReasonChoose" position="bottom">
        <!-- <div class="popup yungu-popup-refund-reason"> -->
			  	<header class="yungu-goods-status-title">退款原因</header>
			  	<div class="list-block yungu-list-block">
            <ul id="refundReasonList">
              <li class="item-content" v-for="item in refundReasons" :key="item.id">
                <label class="item-inner">
                  <div class="item-title">{{ item.value }}</div>
                  <div class="item-after"><input type="radio" class="yungu-radio" name="refund-reason" :value="item.code" v-model="refundReasonId"/></div>
                </label>
              </li>
            </ul>
          </div>
          <a class="yungu-popup-close close-popup" @click="refundReasonChoose = false">关&nbsp;闭</a>
        <!-- </div> -->
      </popup>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import OrderGoodsItem from '../components/OrderGoodsItem.vue'
import { Popup, TransferDom } from 'vux'
export default {
  components: { NavBar, OrderGoodsItem, Popup },
  directives: {
    focus(el, show) {
      if (show) {
        el.focus()
      }
    },
    TransferDom
  },
  data() {
    return {
      goods: [],
      total: 0,
      voucher: [],
      refundReasonId: '',
      refundMoney: '',
      refundInstruction: '',
      refundReasons: [],
      refundMoneyShow: true,
      refundReasonChoose: false,
      voucherActiveIndex: 0
    }
  },
  created() {
    this.initData()
  },
  watch: {
    refundMoney(val) {
      if (val > this.total) {
        this.$vux.toast.text('退款金额不能大于订单金额', 'bottom')
        this.refundMoney = this.total
      }
    }
  },
  computed: {
    refundReason() {
      for (let i = 0; i < this.refundReasons.length; i++) {
        if (this.refundReasons[i].code === this.refundReasonId) {
          return this.refundReasons[i].value
        }
      }
      return ''
    }
  },
  methods: {
    initData() {
      if (this.$route.query.specId) {
        this.initOrderGoodsData()
      } else {
        this.initOrderData()
      }
      this.initRefundReasons()
    },
    initOrderData,
    initOrderGoodsData,
    // 获取退款原因列表
    initRefundReasons() {
      this.$_http().refundReasons()
        .then(data => {
          this.refundReasons = data
        })
    },
    // 选择图片上传
    imageSelect() {
      this.voucherActiveIndex = this.voucher.length
      document.getElementById('fileInput').click()
    },
    // 图片选择完成
    imageSelected(event) {
      let file = event.target.files[0]
      if (file) {
        // 验证图片文件类型
        if (file.type && !/image/i.test(file.type)) {
          return false
        }
        if (file.size > 2 * 1024 * 1024) {
          this.$vux.toast.text('凭证图片不能大于2M', 'bottom')
          return false
        }
      }
      let formData = new FormData()
      formData.append('file', file)
      this.$_http().imageUpload(formData)
        .then(data => {
          this.voucher.splice(this.voucherActiveIndex, 1, data)
        })
    },
    // 更换凭证图片
    updateImg(index) {
      this.voucherActiveIndex = index
      document.getElementById('fileInput').click()
    },
    submit() {
      if (!this.refundReasonId) {
        this.$vux.toast.text('请选择退款原因', 'bottom')
        return
      }
      if (this.refundMoney <= 0 || this.refundMoney > this.total) {
        this.$vux.toast.text('请输入退款金额', 'bottom')
        return
      }
      let params = {
        refundReasonId: this.refundReasonId,
        refundMoney: this.refundMoney,
        refundInstruction: this.refundInstruction,
        imageUrlList: this.voucher.join(','),
        orderId: this.$route.query.orderId,
        specId: this.$route.query.specId
      }
      let url = 'orderRefund'
      if (this.$route.query.specId) {
        url = 'goodsRefund'
      }
      this.$_http()[url](params).then(res => {
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
/**
 * 获取订单详情
 */
function initOrderData() {
  this.$_http().queryOrderDetail({
    orderId: this.$route.query.orderId
  }).then(data => {
    this.goods = data.mallOrderGoodsSnapDetailVoList
    this.total = data.goodsTotalPrice
  })
}

/**
 * 获取订单商品详情
 */
function initOrderGoodsData() {
  this.$_http().orderGoods({
    orderId: this.$route.query.orderId,
    specId: this.$route.query.specId
  }).then(data => {
    this.goods = [data]
    this.total = data.totalPrice
  })
}
</script>

<style scoped>
.yungu-content-refund {padding-bottom: 10rem;}
.page {z-index: 100;}
</style>
