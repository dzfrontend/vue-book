/**
 * render函数 => 虚拟dom
 * 虚拟dom也就是用对象描述dom结构
 */
export function renderMixin(Vue) {
  Vue.prototype._render = function () {
    const vm = this;
    // 调用render函数
    const render = vm.$options.render;
    let vnode = render.call(vm);
    console.log(vnode);
    return vnode;
  }
  Vue.prototype._c = function () {
    // 创建虚拟dom元素
    return createElement(...arguments);
  }
  Vue.prototype._s = function (val) {
    // stringify
    return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val;
  }
  Vue.prototype._v = function (text) {
    // 创建虚拟dom文本元素
    return createTextVnode(text);
  }
}

function createElement(tag, data = {}, ...children) {
  // console.log(arguments);
  return vnode(tag, data, data.key, children);
}

function createTextVnode(text) {
  // console.log(text);
  return vnode(undefined, undefined, undefined, undefined, text);
}

// 生成虚拟dom
function vnode(tag, data, key, children, text) {
  return {
    tag, 
    data, 
    key, 
    children, 
    text
  }
}