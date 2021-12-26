/**
 * 虚拟节点 => 真实节点 => vdom diff
 */

// vdom diff算法
export function patch(oldVnode, newVnode) {

  // 初次渲染dom树，oldVnode为vm.$el，所以nodeType为1，newVnode生成真实dom放到vm.$el处
  if (oldVnode.nodeType === 1) {
    let elm = createElm(newVnode); // 生成真实dom
    let parentElm = oldVnode.parentNode; // body
    parentElm.insertBefore(elm, oldVnode.nextSibling); // 在oldVnode后插入真实dom
    parentElm.removeChild(oldVnode); // 删除老节点
    return elm;
  } else { // oldVnode和newVnode都是vdom，进行diff比较

    // 先比对第1层
    // 1 标签名不一样，直接老节点替换成新节点
    if (oldVnode.tag !== newVnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el);
    }

    // 2 标签名一样，比对属性
    newVnode.el = oldVnode.el; // 复用老节点的真实dom，后面比对更新差异部分
    patchProps(newVnode, oldVnode.data);

    // 再比对第n层
    // 3 子节点是文本(children为文本)，文本的比对
    if (!oldVnode.tag) {
      if (oldVnode.text !== newVnode.text) {
        // 替换为新文本
        return oldVnode.el.textContent = newVnode.text;
      }
    }
    
    // 4 递归比对children
    patch(oldVnode.children[0], newVnode.children[0]);

    /*
    let oldChildren = oldVnode.children || [];
    let newChildren = newVnode.children || [];
    

    if (oldChildren.length > 0 && newChildren.length > 0) {
      // oldVnode和newVnode都有children
      
    } else if (newChildren.length > 0) {
      // oldVnode没有children, newVnode有children
      for (let i = 0; i < newChildren.length; i++) {
        // 循环创建新的子节点
        let child = createElm(newChildren[i]);
        newVnode.el.appendChild(child);
      }
    } else if (oldChildren.length > 0) {
      // oldVnode有children, newVnode没有children
      newVnode.el = ''; // 删除老节点
    }
    */
  }
}

// 生成真实dom
export function createElm(vnode) {
  let { tag, children, key, data, text } = vnode;
  if (typeof tag === 'string') { // 元素节点
    // 创建元素，放到vnode.el上
    vnode.el = document.createElement(tag);

    patchProps(vnode);

    // 遍历子节点，将子节点递归渲染内容放到其父节点上
    children.forEach(child => {
      vnode.el.appendChild(createElm(child));
    });
  } else { // 文本节点
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

// 比对属性 用新的属性更新老的属性
function patchProps(vnode, oldProps = {}) {
  let el = vnode.el;
  let newProps = vnode.data || {};

  // 遍历老节点样式，新节点没有就删除
  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {};
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = '';
    }
  }
  
  // 遍历老节点属性，新节点没有的删除
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key);
    }
  }

  // 添加属性props
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === 'class') {
      el.className = el.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}