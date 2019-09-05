// 基类
class Vue {
  // 接收参数处理
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;
    // 这个根元素存在 则编译模板
    if (this.$el) {
      new Compiler(this.$el, this);
    }
  }
}

class Compiler{
  /**
   * 将节点放到内存中，用数据编译模板，最后放回dom中
   * @param {挂载节点} el
   * @param {Vue实例化} vm
   */
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el: document.querySelector(el);
    this.vm = vm;
    // 把当前节点中的元素获取到 放到内存中 => 方便对dom操作模板语法
    let fragment = this.node2fragment(this.el);

    // 用数据编译模板 
    this.compile(fragment);

    // 将内存中的内容放到页面中
    this.el.appendChild(fragment);
  }

  /**
   * 编译内存中的dom节点，解析模板语法
   * @param {*} fragment 
   */
  compile(fragment) {
    let childNodes = fragment.childNodes; // 节点的子节点集合
    [...childNodes].forEach(child => {
      if(this.isElementNode(child)) { // 元素节点 有标签包裹
        this.compileElement(child);
        // 元素节点递归遍历子节点，直到为文本节点为止
        this.compile(child);
      }else { // 没有标签包裹
        this.compileText(child);
      }
    })
  }

  /**
   * 编译元素节点 比如一些指令
   * @param {*} node 
   */
  compileElement(node) {
    let attributes = node.attributes;
    // 判断属性名是不是指令
    [...attributes].forEach(attr => {
      let { name, value:expr } = attr;
      if(this.isDirective(name)) {
        let [, directive] = name.split('-'); // v-model v-html
        CompileUtil[directive](node, expr, this.vm);
      }
    })
  }

  /**
   * 编译文本节点 => 编译{{ xxx }}
   * @param {*} node 
   */
  compileText(node) {
    let content = node.textContent;
    if(/\{\{(.+?)\}\}/.test(content)) {  // {{ xxx }}
      CompileUtil['text'](node, content, this.vm);
    }
  }
  /**
  * 将dom节点放到内存中
  * @param {dom节点} node 
  */
  node2fragment(node) {
    // 创建一个文本碎片(内存中)
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      // appendChild具有移动性
      fragment.appendChild(firstChild);
    }
    return fragment;
  }

  isElementNode(node) { // 判断是不是元素节点
    return node.nodeType === 1;
  }
  /**
   * 判断是否是指令 => v-开头
   * @param {属性name} attrName
   */
  isDirective(attrName) {
    return attrName.startsWith('v-');
  }
}

CompileUtil = {
  /**
   * 取表达式expr中对应vm.$data中的数据
   * @param {*当前实例} vm
   * @param {*表达式} expr 
   */
  getVal(vm, expr) {
    // 例如expr为'user.name'，下面则取出对应的vm.$data里user.name的值
    return expr.split('.').reduce((vmdata, exprdata) => {
      return vmdata[exprdata];
    }, vm.$data);
  },
  /**
   * 处理v-model指令，给输入框赋值value值
   * @param {*节点元素} node 
   * @param {*表达式} expr 
   * @param {*当前实例} vm 
   */
  model(node, expr, vm) {
    let value = this.getVal(vm, expr);
    node.value = value;
  },
  /**
   * 处理“Mustache”语法
   * @param {*节点元素} node 
   * @param {*表达式内容} content 
   * @param {*当前实例} vm 
   */
  text(node, content, vm) {
    // 处理文本内容 去掉{{}}留下里面数据
    let ct = content.replace(/\{\{\s?(.+?)\s?\}\}/g, (...args) => {
      return this.getVal(vm, args[1]);
    });
    node.textContent = ct;
  }
}