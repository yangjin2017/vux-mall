<template>
  <div class="page page-current">
    <nav-bar title="管理收货地址" :is-back="true"></nav-bar>
    <div class="content yungu-content-bgcolor">
      <div class="yungu-addresses-content">
        <ul id="yungu-addresses">
          <li v-for="(item, index) in addresses" :key="item.id">
            <div class="yungu-addresses-content-info">
              <div class="yungu-address-name-mobile">
                <span class="yungu-address-name">{{ item.userName }}</span>
                <span class="yungu-address-mobile">{{ item.mobile }}</span>
              </div>
              <div class="yungu-address-detail">{{ item.address }}</div>
            </div>
            <div class="yungu-addresses-content-todo">
              <span class="yungu-addresses-content-now" :class="{ active: item.isDefault == 'Y' }" @click="setDefaultAddress(item.id, item.isDefault)">默认地址</span>
              <span class="yungu-addresses-content-delete" @click="del(index)">删除</span>
              <span class="yungu-addresses-content-edit" @click="addAddress(item.id)">编辑</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="yungu-addresses-add" @click="addAddress('add')">
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
    // 获取该用户添加过的地址信息列表
    initData () {
      this.$_http().addresses().then(data => {
        this.addresses = data
      })
    },
    // 添加 | 编辑地址信息
    addAddress (id) {
      this.$router.push(`/address-add/${id}`)
    },
    // 设置当前地址信息为默认地址
    setDefaultAddress (id, isDefault) {
      if (isDefault === 'Y') return
      this.$_http().defaultaddress({
        id: id
      }).then(res => {
        this.$vux.toast.text('修改默认地址成功', 'bottom')
        this.addresses.map(item => {
          if (item.id === id) {
            item.isDefault = 'Y'
          } else if (item.isDefault === 'Y') {
            item.isDefault = 'N'
          }
        })
      }).catch(err => {
        if (err.code === 'A-00009') {
          this.$vux.toast.text('修改默认地址失败', 'bottom')
        }
      })
    },
    // 删除地址
    del (index) {
      if (this.addresses[index].isDefault === 'Y') {
        this.$vux.toast.text('不能删除默认地址', 'bottom')
        return
      }
      this.$_http(this.$_api.ADDRESSDEL, {
        id: this.addresses[index].id
      }).then(res => {
        if (res) {
          this.$vux.toast.text('删除成功', 'bottom')
          this.initData()
        } else {
          this.$vux.toast.text('不能删除默认地址', 'bottom')
        }
      }).catch(err => {
        if (err.code === 'A-00039') {
          this.$vux.toast.text('删除地址信息失败', 'bottom')
        }
      })
    }
  }
}
</script>
