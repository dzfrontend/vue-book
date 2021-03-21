import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import router from './router'

// ------ 路由钩子函数开始 ------
// 路由钩子函数触发顺序：beforeEach => beforeEnter => beforeRouteEnter => beforeResolve => afterEach => beforeRouteUpdate => beforeRouteLeave
// 进入新的页面，根组件会触发beforeEach
// 然后进入路由配置中，路由配置会触发beforeEnter
// 然后进入组件中，组件中会触发beforeRouteEnter
// 解析完成，根组件中会触发beforeResolve
// 当前路由进入完毕，根组件中会触发afterEach
// 当属性变化，并没有重新加载组件，会触发beforeRouteUpdate
// 当组件切换时，也就是路由离开时会触发beforeRouteLeave

router.beforeEach((to, from, next) => {
  let matched = to.matched.some((match) => match.meta.needLogin); // 取路由配置中的meta.needLogin来判断是否需要登录
  if (matched) { // 需要登录
    let isLogin = localStorage.getItem('login');
    if (isLogin) {
      next();
    } else {
      next({ name: 'login' }) // 跳转到登录页
    }
  } else {
    // 不需要登录访问登录页
    if (to.name === 'login') {
      next({ name: 'home' })
    }
    next();
  }
});

router.beforeResolve((to, from, next) => {
  console.log('resolve');
  next();
});
router.afterEach((to, from) => {
  console.log('after Each')
})
// ------ 路由钩子函数结束 ------
new Vue({
  router, // 根组件实例化时使用VueRouter
  render: h => h(App),
}).$mount('#app')
