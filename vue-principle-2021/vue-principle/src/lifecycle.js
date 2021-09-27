/**
 * 挂载组件
 */

import { patch } from "./vdom/patch";

// 组件挂载到el上
export function mountComponent(vm, el) {
  callHook(vm, 'beforMount');
  // 将render函数转换成虚拟dom
  const vnode = vm._render();
  // 再将虚拟dom挂载到页面上
  vm._update(vnode);
  callHook(vm, 'mounted');
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // 将虚拟节点转换成真实节点
    patch(vm.$el, vnode);
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