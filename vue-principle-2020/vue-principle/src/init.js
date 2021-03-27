import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 将配置项挂载到实例vm上：vm.$options就可以访问配置项
    const vm = this;
    vm.$options = options;
    // 初始化状态
    initState(vm);
  }
}