<template>
  <div class="page page-current">
    <nav-bar :title="title" :is-back="true">
      <a class="yungu-button yungu-button-link-text pull-right" slot="right">保存</a>
    </nav-bar>
    <div class="content yungu-content-bgcolor">
      <div class="list-block yungu-content-address-save">
        <ul>
          <li>
            <div class="item-content">
              <div class="item-media">
                <i class="icon icon-form-name"></i>
              </div>
              <div class="item-inner">
                <div class="item-title label">收货人</div>
                <div class="item-input">
                  <input type="text" name="userName" />
                </div>
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
                  <input type="email" name="mobile" />
                </div>
              </div>
            </div>
          </li>
          <li class="item-content item-link" name="changCity">
            <div class="item-media">
              <i class="icon icon-f7"></i>
            </div>
            <div class="item-inner">
              <div class="item-title">所在地区</div>
              <div class="item-after yungu-address-save-city">请选择</div>
            </div>
          </li>
          <li class="align-top">
            <div class="item-content">
              <div class="item-media">
                <i class="icon icon-form-comment"></i>
              </div>
              <div class="item-inner">
                <div class="item-input">
                  <textarea name="address" placeholder="详细地址"></textarea>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!--默认地址-->
      <div class="yungu-address-save-now">
        <span>设为默认地址</span>
        <span class="yungu-address-save-now-check pull-right"></span>
      </div>
      <!--删除地址
            <div class="yungu-address-save-delete">
                <a href="javascript:void(0);">删除地址</a>
            </div>-->
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
      title: '修改地址'
    }
  }
}
</script>
