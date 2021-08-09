/**
 * render函数 => 创建虚拟节点(虚拟dom)
 */

export function mountComponent(vm, el) {
  // 调用render函数渲染到el上
  // 渲染render函数，需要将render函数转换成虚拟节点，再将虚拟节点渲染到页面上
  vm._update(vm._render());
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    
  }
}