/**
 * ast语法树生成render函数
 * 例如有一段html模板为：
 *    <div id="app" style="color:red;font-size:12px;">hello {{ name }} <span>word</span> </div>
 * html编译成ast语法树后，转成render函数如下形式：
 *    render() {
 *      return _c('div', { id: 'app', style: { color: 'red', fontSize: '12px' } }, _v('hello' + _s(name)), _c('span', null, _v('word')))
 *    }
 */

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
// 生成属性
function genProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    // 对样式属性进行特殊处理
    if (attr.name === 'style') {
      let obj = {};
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value;
      });
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`; // 去掉最后一个逗号
}

function genChild(node) {
  if (node.type === 1) {
    // 元素递归generate
    return generate(node);
  } else {
    // 文本
    let text = node.text;
    if (!defaultTagRE.test(text)) {
      // 如果是不带{{ }}的文本（普通文本）
      return `_v(${JSON.stringify(text)})`;
    }
    defaultTagRE.lastIndex = 0; // 正则全局模式, defaultTagRE使用过再使用需置为0

    // 将${{ name }} 转成_s(name)
    let tokens = [];
    let lastIndex = 0; // 遍历索引
    let match,index;
    while(match = defaultTagRE.exec(text)) {
      index = match.index; // 当前匹配索引
      if (index > lastIndex) {
        // 普通文本
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      // 带{{ }}的文本转成_s()
      tokens.push(`_s(${match[1].trim()})`);
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      // 末尾的普通文本
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    return `_v(${tokens.join('+')})`;
  }
}
// 生成子节点字符串
function genChildren(ast) {
  const children = ast.children;
  if (children) {
    return children.map(child => genChild(child)).join(','); // 将转换后的所有节点用逗号连接
  }
}
export function generate(ast) {
  let children = genChildren(ast);
  let code = `_c('${ast.tag}', ${ast.attrs.length ? `${genProps(ast.attrs)}` : 'undefined'}, ${children ? children : ''})`;
  return code;
}