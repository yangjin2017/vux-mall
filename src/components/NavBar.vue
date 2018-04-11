<template>
  <header class="bar bar-nav">
    <slot name="back"></slot>
    <h1 class="title" v-text="title"></h1>
    <slot name="right"></slot>
  </header>
</template>

<script>
  export default {
    props: {
      title: ''
    }
  }
</script>

<style>
</style>
