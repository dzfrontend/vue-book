/**
 * 挂载组件
 */

import { patch } from "./vdom/patch";
import Watcher from "./observer/watcher";

// 组件挂载到el上
export function mountComponent(vm, el) {
  callHook(vm, 'beforMount');

  // 将render函数转换成虚拟dom，再更新到页面上
  // vm._update(vm._render()); 改写成watcher来渲染
  let updateComponent = () => {
    vm._update(vm._render());
  };
  new Watcher(vm, updateComponent, () => {
    callHook(vm, 'beforeUpdate');
  }, true);

  callHook(vm, 'mounted');
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // 将虚拟节点转换成真实节点，并且用新创建的元素替代老的$el
    vm.$el = patch(vm.$el, vnode);
  }
}

// 调用生命周期函数
export function callHook(vm, hook) {
  const handlers = vm.$options[hook]; // vm.$options.created = [a, b, c]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm);
    }
  }
}