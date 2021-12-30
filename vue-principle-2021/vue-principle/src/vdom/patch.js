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
    newVnode.el = oldVnode.el; // 复用老节点的真实dom，放到newVnode的el上，后面比对更新差异部分
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
    // patch(oldVnode.children[0], newVnode.children[0]);

    let oldChildren = oldVnode.children || [];
    let newChildren = newVnode.children || [];

    if (oldChildren.length > 0 && newChildren.length > 0) {
      // oldVnode和newVnode都有children
      // Vue中采用双指针来比对
      patchChildren(newVnode.el, oldChildren, newChildren);

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
  }
}

/**
 * 是否为同一个元素
 * 标签名相同并且key相同则是
 */
function isSameVnode(oldVnode, newVnode) {
  return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key
}

/**
 * virtrul-dom diff核心算法
 * el: 要更新的元素
 * oldChildren: 老节点
 * newChildren: 新节点
 */
function patchChildren(el, oldChildren, newChildren) {

  let oldStartIndex = 0; // 老开始指针
  let oldStartVnode = oldChildren[0]; // 老开始节点
  let oldEndIndex = oldChildren.length - 1; // 老结尾指针
  let oldEndVnode = oldChildren[oldEndIndex]; // 老结尾节点

  let newStartIndex = 0; // 新开始指针
  let newStartVnode = newChildren[0]; // 新开始节点
  let newEndIndex = newChildren.length - 1; // 新结尾指针
  let newEndVnode = newChildren[newEndIndex]; // 新结尾节点

  // 同时循环新的节点和老的节点，有一方循环完毕就结束
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    
    // 头结点和头结点比较，标签一致，则从头指针开始比对
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 递归patch，对比更新属性和内容
      patch(oldStartVnode, newStartVnode);
      // 指针后移，两两比对
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) { 
      // 从尾结点开始倒序比对
      patch(oldEndVnode, newEndVnode);
      // 指针前移，两两比对
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }
  }

  // 在结尾新增节点：将新增vdom转成真实dom添加到el后面 => el.appendChild === insertBefore(el, null)
  // 在开头新增节点：将新增vdom转成真实dom添加到el前面
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // el.appendChild(createElm(newChildren[i])); // 需改写成下面
      // 通过尾指针的下一个元素是否存在来判断指针方向
      // 尾指针下一个元素undefined则为正序比对，反之倒序比对
      let dir = newChildren[newEndIndex + 1] === undefined ? null : newChildren[newEndIndex + 1].el;
      el.insertBefore(createElm(newChildren[i]), dir);
    }
  }

  // 头或尾一方删除了元素
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      // newVnode服用了oldVnode的真实dom，newVnode删除了元素，只用删除对应的真实dom
      el.removeChild(oldChildren[i].el);
    }
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