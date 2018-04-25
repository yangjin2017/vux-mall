<template>
  <div class="page page-current">
    <nav-bar title="管理收货地址" :is-back="true"></nav-bar>
    <div class="content yungu-content-bgcolor">
      <div class="yungu-addresses-content">
        <ul id="yungu-addresses">
          <li v-for="item in addresses" :key="item.id">
            <div class="yungu-addresses-content-info">
              <div class="yungu-address-name-mobile">
                <span class="yungu-address-name">{{ item.userName }}</span>
                <span class="yungu-address-mobile">{{ item.mobile }}</span>
              </div>
              <div class="yungu-address-detail">{{ item.address }}</div>
            </div>
            <div class="yungu-addresses-content-todo">
              <span class="yungu-addresses-content-now" :class="{ active: item.isDefault == 'Y' }">默认地址</span>
              <span class="yungu-addresses-content-delete">删除</span>
              <span class="yungu-addresses-content-edit">编辑</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="yungu-addresses-add" @click="addAddress">
        <a>添加地址</a>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar'
export default {
  data () {
    return {
      addresses: {}
    }
  },
  components: {
    NavBar
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.$_http(this.$_api.ADDRESSES).then(data => {
        this.addresses = data
      })
    },
    addAddress () {
      this.$router.push('/address-add')
    }
  }
}
</script>
