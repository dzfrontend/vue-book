// vuex的使用请看文档：https://vuex.vuejs.org/zh/
// vuex的配置代码
import Vue from 'vue';
import vuex from 'vuex';

import actions from './actions';
import mutations from './mutations';
import state from './state';
import getters from './getters';
import user from './modules/user';

Vue.use(vuex);
export default new vuex.Store({
  actions,
  mutations,
  state,
  getters,
  // 单独将actions, mutations, state, getters分模块
  modules: {
    user
  }
})