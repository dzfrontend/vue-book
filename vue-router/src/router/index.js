import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

// 第三方插件引入后，要使用Vue.use()调用插件里面的install方法

// VueRouter install方法中，注册了两个全局组件，router-view和router-link，可以在任何组件中使用这两个组件
// 并且在每个组件上定义了两个属性，$router和$route，可以通过this访问它们
Vue.use(VueRouter);

export default new VueRouter({
  mode: 'hash', // hash或者history两种模式
  routes
})