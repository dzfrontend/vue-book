/**
 * html模板 => render函数
 */
// 解析标签和内容正则表达式
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 匹配标签名 例如<aa-bb></aa-bb>中的aa-bb
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // ?:匹配不捕获 匹配命名空间标签名 例如<my:aa></my:aa>中的my:aa
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配以命名空间标签名开头的 例如<my:aa
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 例如</div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性 例如a="aa"或a='aa'或a=aa
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 例如 />
const defaultTagRe = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配双大括号 例如 {{ name }}

// 解析html
function parseHTML(html) {
  let root; //根节点
  let currentElement; // 当前解析的标签
  let stack = []; // 栈

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1, // 1：元素类型 3：文本类型
      children: [],
      attrs,
      parent: null,
    }
  }

  // 开始标签匹配的结果
  function start(tagName, attrs) {
    // console.log('开始标签匹配结果', tagName, attrs);
    let element = createASTElement(tagName, attrs);
    if (!root) {
      root = element;
    }
    currentElement = element;
    stack.push(element);
  }
  // 结束标签匹配的结果
  function end(tagName) {
    // console.log('结束标签匹配结果', tagName);
    // 在标签闭合时用栈的数据结构来创建元素的父子关系
    let element = stack.pop(); // 取出栈中的最后一个 [div, p]
    const currentParent = stack[stack.length - 1];
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }
  // 文本匹配的结果
  function chars(text) {
    // console.log('文本匹配结果', text);
    text = text.replace(/\s/g, '');
    if (text) {
      currentElement.children.push({
        type: 3,
        text,
      });
    }
  }

  // 循环处理html字符串
  while (html) {
    let textEnd = html.indexOf('<');
    if (textEnd === 0) { // 标签
      // 匹配开始标签
      const startTagMatch = parseStartTag();
      // console.log(startTagMatch);
      // console.log(html);
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      
      // 匹配结束标签
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }

    let text;
    if (textEnd > 0) { // 文本
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length);
      chars(text);
    }
    // break;
  }
  // 将html进行截取
  function advance(n) {
    html = html.substring(n);
  }
  // 解析开始标签
  function parseStartTag() {
    // 匹配开始标签
    const start = html.match(startTagOpen);
    if (start) {
      // console.log(start);
      const match = {
        tagName: start[1],
        attrs: [],
      }
      // 删除匹配的开始标签
      advance(start[0].length);
      // console.log(html);

      // 匹配属性
      let attr;
      let end; // 匹配结束标签
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) { // 没有到结束标签并且匹配到属性
        // console.log(attr);
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] });
        // 删除匹配的属性
        advance(attr[0].length);
        // break;
      }
      if (end) {
        // 删除结束标签
        advance(end[0].length);
      }
      return match;
    }
  }
  return root;
}

export function compileToFunctions(template) {
  // console.log(template);
  // 1.将html转换成ast语法树
  let ast = parseHTML(template);
  // console.log(ast);
  // 2.通过ast语法树，重新生成代码
}