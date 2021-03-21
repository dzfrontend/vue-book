import Vue from 'vue'
import App from './App.vue'
import store from './store/index'

new Vue({
  render: h => h(App),
  store, // 注入vuex的配置，每个组件上都会有一个$store属性
}).$mount('#app')
