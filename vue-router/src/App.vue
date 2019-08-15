<template>
  <div id="app">
    <MNav></MNav>
    <!-- router-view路由视图，会匹配vue-router routes配置选项的path路径，将对应的component显示出来 -->
    <!-- 多个router-view是因为路由配置里面有一个路径对应多个组件的情况 -->
    <router-view key="1"></router-view>
    <router-view key="2" name="name"></router-view>
    <router-view key="3" name="version"></router-view>
  </div>
</template>

<script>
import MNav from './components/MNav.vue'
// 组件先定义，再导入，再使用
export default {
  components:{
    MNav
  }
}
</script>

<style>
</style>
