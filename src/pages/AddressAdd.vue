<template>
  <div class="page page-current">
    <nav-bar :title="title" :is-back="true">
      <a v-show="!areaSelect" class="yungu-button yungu-button-link-text pull-right" slot="right" @click="save">保存</a>
    </nav-bar>
    <div class="content yungu-content-bgcolor" v-show="!areaSelect">
      <div class="list-block yungu-content-address-save">
        <ul>
          <li>
            <div class="item-content">
              <div class="item-media">
                <i class="icon icon-form-name"></i>
              </div>
              <div class="item-inner">
                <div class="item-title label">收货人</div>
                <div class="item-input"><input type="text" v-model="params.userName" maxlength="20" /></div>
              </div>
            </div>
          </li>
          <li>
            <div class="item-content">
              <div class="item-media">
                <i class="icon icon-form-email"></i>
              </div>
              <div class="item-inner">
                <div class="item-title label">联系电话</div>
                <div class="item-input">
                  <input type="email" v-model="params.mobile" maxlength="20" />
                </div>
              </div>
            </div>
          </li>
          <li class="item-content item-link" @click="areaSelect = true">
            <div class="item-media">
              <i class="icon icon-f7"></i>
            </div>
            <div class="item-inner">
              <div class="item-title">所在地区</div>
              <div class="item-after yungu-address-save-city">{{ area.length === 3 ? area.join(' ') : '请选择' }}</div>
            </div>
          </li>
          <li class="align-top">
            <div class="item-content">
              <div class="item-media">
                <i class="icon icon-form-comment"></i>
              </div>
              <div class="item-inner">
                <div class="item-input">
                  <textarea v-model="params.address" placeholder="详细地址" maxlength="20"></textarea>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!--默认地址-->
      <div class="yungu-address-save-now" @click="isDefault = !isDefault">
        <span>设为默认地址</span>
        <span class="yungu-address-save-now-check pull-right" :class="{ active: isDefault }"></span>
      </div>
      <!--删除地址
            <div class="yungu-address-save-delete">
                <a href="javascript:void(0);">删除地址</a>
            </div>-->
    </div>
    <div v-transfer-dom>
      <popup v-model="areaSelect" width="100%" :popup-style="{zIndex: 2000}" position="right">
        <area-select :pid.sync="pid" @choose="areaChoose" @cacel="areaChooseCacel"></area-select>
      </popup>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar'
import AreaSelect from '../components/AreaSelect'
import { Popup, TransferDom } from 'vux'
import { regexUtil, jsonUtil } from '../utils/utils'
export default {
  components: {
    NavBar,
    AreaSelect,
    Popup
  },
  props: ['id'],
  directives: {
    TransferDom
  },
  data () {
    return {
      title: '',
      areaSelect: false,
      pid: 100000,
      area: [],
      isDefault: false,
      params: {
        userName: '',
        mobile: '',
        address: '',
        provinceId: '',
        cityId: '',
        areaId: ''
      }
    }
  },
  created () {
    if (this.id === 'add') {
      this.title = '添加新地址'
      return
    }
    this.title = '修改地址'
    this.$_http(this.$_api.ADDRESS, {
      id: this.id
    }).then(data => {
      jsonUtil.update(this.params, data.userAddress)
      this.isDefault = data.userAddress.isDefault === 'Y'
      this.area = data.address
    })
  },
  methods: {
    // 区域地址信息选择回调
    areaChoose (params) {
      this.params.provinceId = params[0].id
      this.params.cityId = params[1].id
      this.params.areaId = params[2].id
      this.area = [params[0].name, params[1].name, params[2].name]
      this.areaChooseCacel()
    },
    // 取消区域选择，将区域选择组件信息归零
    areaChooseCacel () {
      this.pid = 100000
      this.areaSelect = false
    },
    // 保存地址
    save () {
      if (!regexUtil.isChinaName(this.params.userName)) {
        this.$vux.toast.text('请输入正确的中文姓名', 'bottom')
        return
      }
      if (!regexUtil.isPhone(this.params.mobile)) {
        this.$vux.toast.text('请输入正确的手机号码', 'bottom')
        return
      }
      if (!this.params.areaId) {
        this.$vux.toast.text('请选择所在省市区', 'bottom')
        return
      }
      if (!regexUtil.isAddress(this.params.address)) {
        this.$vux.toast.text('请输入正确的详细地址', 'bottom')
        return
      }

      let params = this.params
      if (this.id !== 'add') {
        params.id = this.id
      }
      if (this.isDefault) {
        params.isDefault = 'Y'
      }

      this.$_http(this.$_api.ADDRESSUPD, params).then(res => {
        this.$vux.toast.text('保存成功', 'bottom')
        this.$router.go(-1)
      }).catch(err => {
        if (err.code === 'A-00010') {
          this.$vux.toast.text('保存失败', 'bottom')
        } else if (err.code === 'A-00009') {
          this.$vux.toast.text('修改失败', 'bottom')
        }
      })
    }
  }
}
</script>
