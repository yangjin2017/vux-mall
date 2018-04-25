<template>
  <header class="bar bar-nav">
    <a class="button button-link button-nav pull-left" v-if="isBack" @click="back">
      <span class="yungu-icon yungu-icon-go-right"></span>
    </a>
    <h1 class="title" v-text="title"></h1>
    <slot name="right"></slot>
  </header>
</template>

<script>
  export default {
    props: {
      title: String,
      isBack: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      back(){
        this.$router.go(-1)
      }
    }
  }
</script>

<style>
</style>
