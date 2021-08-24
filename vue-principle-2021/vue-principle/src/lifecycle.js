/**
 * 挂载组件
 */

import { patch } from "./vdom/patch";

export function mountComponent(vm, el) {
  // 调用render函数渲染到el上
  // 渲染render函数，需要将render函数转换成虚拟节点，再将虚拟节点渲染到页面上
  const vnode = vm._render();
  vm._update(vnode);
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // 将虚拟节点转换成真实节点
    patch(vm.$el, vnode);
  }
}