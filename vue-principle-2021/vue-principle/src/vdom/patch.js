/**
 * 虚拟节点 => 真实节点
 */

export function patch(oldVnode, vnode) {
  let el = createEle(vnode); // 生成真实dom
  let parentEle = oldVnode.parentNode; // body
  parentEle.insertBefore(el, oldVnode.nextSibling); // 在oldVnode后插入真实dom
  parentEle.removeChild(oldVnode); // 删除老节点
}

// 生成真实dom
function createEle(vnode) {
  let { tag, children, key, data, text } = vnode;
  if (typeof tag === 'string') { // 元素节点
    // 创建元素，放到vnode.el上
    vnode.el = document.createElement(tag);

    updateProperties(vnode);

    // 遍历子节点，将子节点递归渲染内容放到其父节点上
    children.forEach(child => {
      vnode.el.appendChild(createEle(child));
    });
  } else { // 文本节点
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

// 生成属性
function updateProperties(vnode) {
  let el = vnode.el;
  let newProps = vnode.data || {};
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