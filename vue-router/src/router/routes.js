import Home from '../views/Home'

export default [
  // vue-router路由路径配置
  {
    path: '/',
    redirect: { name: 'home' } // 访问首页默认重定向到home
  },
  {
    path: '/home', // 路径
    name: 'home', // name标识
    // component: Home // 组件
    components: {
      // 一个路径对应多个路由，所以需要多个router-view，router-view的name就是下面配置的key值
      default: Home, // 默认router-view渲染的组件
      name: () => import('../views/Name.vue'),
      version: () => import('../views/Version.vue'),
    }
  },
  // 利用webpack的import()按需加载，只有首页默认显示，其他访问时才加载
  {
    path: '/profile',
    name: 'profile',
    meta: { // 路由元信息
      needLogin: true // 用于判断当前路由是否需要登录
    },
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/user',
    name: 'user',
    // 添加二级菜单，子路由，所以router-view应该放到/user路径对应的组件里面
    children: [
      { path: '', redirect: { name: 'userAdd' } }, // 访问/user，默认到userAdd路由
      { path: 'add', name: 'userAdd', component: () => import('../views/UserAdd.vue') },
      { path: 'list', name: 'userList', component: () => import('../views/UserList.vue') },
      {
        path: 'detail/:id',
        name: 'userDetail',
        component: () => import('../views/UserDetail.vue'),
        // 可以在组件里面调用路由钩子函数，也可以在路由配置里面调用路由钩子函数
        beforeEnter(to, from, next) {
          console.log('enter');
          next();
        }
      }
    ],
    component: () => import('../views/User.vue')
  }
]