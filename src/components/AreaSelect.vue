<template>
  <div class="page page-current">
    <nav-bar :title="title">
      <a class="button button-link button-nav pull-left back" @click="back" data-transition='slide-out' slot="left">
        <span class="yungu-icon yungu-icon-go-right"></span>
      </a>
    </nav-bar>
    <div class="content yungu-content-bgcolor">
      <ul class="yungu-content-citys">
        <li class="yungu-content-citys-root" :class="{ 'yungu-content-citys-parent': level < 2 }" v-for="(item, index) in areas[level]" :key="item.id" @click="choose(index)">{{ item.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar'
export default {
  props: {
    pid: {
      type: Number,
      default: 100000
    }
  },
  components: {
    NavBar
  },
  data () {
    return {
      areas: [],
      level: 0,
      selected: []
    }
  },
  computed: {
    title () {
      return ['所在省级地区', '所在市级地区', '所在区级地区'][this.level]
    }
  },
  created () {
    this.initData()
  },
  watch: {
    pid (val) {
      this.initData()
      if (val === 100000) {
        this.level = 0
      }
    }
  },
  methods: {
    // 选择地址信息
    choose (index) {
      const area = this.areas[this.level][index]
      this.selected[this.level] = area
      if (this.level === 2) {
        this.$emit('choose', this.selected)
      } else {
        this.level++
        this.$emit('update:pid', area.id)
      }
    },
    // 初始化页面数据
    initData () {
      this.$_http().area({
        pid: this.pid
      }).then(data => {
        this.areas.splice(this.level, 1, data)
      })
    },
    // 返回
    back () {
      if (this.level === 0) {
        this.$emit('cacel')
      } else {
        this.level--
      }
    }
  }
}
</script>
