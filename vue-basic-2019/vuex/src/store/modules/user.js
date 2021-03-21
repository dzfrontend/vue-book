// 将actions、mutations、state和getters分模块 => user模块

export default {
  namespaced: true, // 命名空间必须为true，才可以使用vuex的分模块
  state: {
    userName: '小明'
  },
  getters: {
    getNewUserName(state) {
      return 'getters' + state.userName
    }
  },
  mutations: {
    // mutations里接收this.$store.commit
    change_userName(state, payload) {
      state.userName = payload
    }
  },
  actions: {
    // actions里接收this.$store.dispatch，处理异步要经过actions，并且可以多次触发mutations
    change_userName({ commit }, payload) {
      setTimeout(() => {
        commit('change_userName', payload)
      }, 1000);
    }
  },
}