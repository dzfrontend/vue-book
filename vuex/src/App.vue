<template>
  <div id="app">
    1.如果vue实例化时注入了vuex的配置(./store/index.js)，每个组件上都会存在一个属性$store，可以通过$store获取vuex配置里面的actions、mutations、state和getters
    <br/>
    $store.state取state里面的数据：{{ $store.state.data }}
    <br/>
    $store.getters取状态计算后的数据：{{ $store.getters.getNewData }}
    <br/>
    2.通过辅助函数mapState可以取state数据，放到computed里面，同理mapGetters取getters数据
    <br/>
    通过mapState(['data'])取state里面的data数据：{{ data }}
    <br/>
    通过mapGetters(['getNewData'])取getters里面的getNewData数据：{{ getNewData }}
    <br/>
    3.分模块user
    <br/>
    $store.state.user取模块user的state的数据：{{ $store.state.user.userName }}
    <br/>
    mapState('user', ['userName'])取模块user的state的数据：{{ userName }}
    <br/>
    4.更新状态 actions => mutations => state
    <br/>
    mutations里接收this.$store.commit的提交，actions里接收this.$store.dispatch的提交，处理异步要经过this.$store.dispatch提交到actions，
    然后actions里面处理异步通过this.$store.commit提交到mutations
    <br/>
    {{ userName }}
    <br/>
    <button @click="change">更改状态</button>
    <button @click="changeAsync">异步更改状态</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  name: 'app',
  computed: {
    ...mapState(['data']), // 取根模块下的state里的data
    ...mapGetters(['getNewData']),
    // 模块user
    ...mapState('user', ['userName']) // 取user模块下的state里的userName
  },
  methods: {
    ...mapMutations('user', ['change_userName']),
    // ...mapActions('user', ['change_userName']),
    change() {
      // 'change_userName'为mutations里面的方法名
      // this.$store.commit('user/change_userName', '小明同学') // user/change_userName指定user模块下mutations为change_userName，也可以用上面mapMutations的形式
      this['change_userName']('小明同学' )
    },
    changeAsync() {
      // 1s后更新username，属于异步操作，需要this.$store.dispatch到actions，而不是this.$store.commit提交到mutaions，需要在actions里处理异步
      this.$store.dispatch('user/change_userName', '小明同学异步操作') // 也可以用下面的mapActions的方法
      // this['change_userName']('小明同学异步操作' )
    }
  }
}
</script>

<style>
</style>
