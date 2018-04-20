<template>
  <div id="app">
    <keep-alive include="index,goods">
      <router-view></router-view>
    </keep-alive>
    <loading v-model="isLoading"></loading>
  </div>
</template>

<script>
import { Loading } from 'vux'
import { mapState } from 'vuex'
export default {
  name: 'app',
  components: {
    Loading
  },
  computed: {
    ...mapState({
      isLoading: state => state.vux.isLoading
    })
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import './assets/css/sm.css';
@import './assets/css/yungu-main.css';

body {
  background-color: #fbf9fe;
}
</style>
