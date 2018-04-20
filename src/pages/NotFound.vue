<template>
  <section>
    <p class="not-found">404</p>
    <router-link class="link" to="/goods">页面找不到了,返回商城首页</router-link>
  </section>
</template>

<script>
export default {
  
}
</script>

<style>
.not-found {
  margin-top: 60px;
  font-size: 88px;
  color: #747971;
  text-align: center;
  margin-bottom: 0;
}
.link {
  display: block;
  color: #75C6D9;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 300;
}
</style>
