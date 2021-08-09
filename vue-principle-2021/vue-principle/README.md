# 手写vue核心原理

## 一.使用Rollup搭建开发环境

### 1.1 什么是Rollup?

Rollup是一个js模块打包器，可以将小块代码编译成大块复杂的代码，rollup.js更专注于js类库打包(开发应用时使用webpack，开发库是使用rollup)。

### 1.2 环境搭建

安装的npm包有:

```Bash
npm install rollup
rollup-plugin-babel # 将rollup和babel关联起来
@babel/core # babel核心包
@babel/preset-env # es6转成es5
rollup-plugin-serve # rollup本地服务器
```

在rollup的默认配置文件rollup.config.js中配置：

```js
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  // 定义入口文件
  input: './src/index.js',
  output: {
    format: 'umd', // 定义模块化类型(支持esModule commonjs umd)
    name: 'Vue', // 打包后全局变量的名字
    file: 'dist/umd/vue.js', // 输出文件名
    sourcemap: true, // 转换后代码和转换前代码作映射表，可以调试转换后的代码
  },
  // 插件
  plugin: [
    // babel编译
    babel({
      exclude: 'node_modules/**', // 排除目录
    }),
    // 配置的服务器
    serve({
      port: 3000,
      contentBase: '',
      openPage: '/index.html'
    })
  ]
}
```

入口文件src/index.js export一个fn函数:

```js
export const fn = () => {
}
```

打包后的dist/umd/vue.js源码：

```
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue = {}));
}(this, (function (exports) { 'use strict';

  const fn = () => {
    
  };

  exports.fn = fn;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vue.js.map
```

从源码里面可以看到global.vue={}为工厂函数factory的参数，这是rollup里面配置的`output: {name: 'Vue'}`作用的结果，在浏览器中则可以直接访问到Vue。

package.json配置下面命令：
```bash
# -c使用配置文件rollup.config.js  -w监听更新
"scripts": {
  "dev": "rollup -c -w"
},
```

index.html:

```
<script src="dist/umd/vue.js"></script>
<script>
  console.log(Vue);
</script>
```

运行npm run dev可看到浏览器中输出`console.log(Vue)`结果为fn函数：

```
{ fn: () => { } }
```

# 二.Vue响应式原理

### 2.1 初始化状态时进行数据初始化劫持

在Vue中，我们都知道Vue的数据响应式：当数据发生变化，视图就会更新；所以在初始化状态的时候，需要将数据做一个初始化劫持；所谓的数据劫持，也就是当改变数据的时候应该更新视图。

<b>初始化架构：</b>

在src/index.js中，创建Vue类，并且调用插件initMixin中的初始化_init方法，传入vue实例的配置项。

vue实例为：

```js
const vm = new Vue({
  el: '#app',
  data() {
    return {
      a: '响应式数据原理'
    }
  }
});
```
入口文件：
```js
import { initMixin } from "./init";

// Vue类用构造函数写法
function Vue(options) {
  // 调用initMixin插件里面的_init原型方法
  this._init(options);
}

// 原型方法写成插件的形式便于模块化
initMixin(Vue);

export default Vue;
```

在initMixin插件的_init原型方法中，初始化状态。(src/init.js)

```js
import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 将配置项挂载到实例vm上：vm.$options就可以访问配置项
    const vm = this;
    vm.$options = options;
    // 初始化状态
    initState(vm);
  }
}
```

在初始化状态initState(vm)中，将配置项中传入的data进行数据劫持。(src/state.js)

```js
import { observe } from "./observer/index";

export function initState(vm) {
  const opts = vm.$options;
  // 响应式数据原理和数据相关
  // 数据初始化劫持
  if (opts.data) {
    initData(vm);
  }
}

const initData = (vm) => {
  let data = vm.$options.data;
  // data可以是函数、对象，下面处理后得到对象
  data = typeof data === 'function' ? data.call(vm) : data;
  // 将data放到实例vm上外部可以通过vm._data访问到数据
  vm._data = data;
  observe(data);
}
```

在数据的初始化劫持中，专门写一个函数observe()来进行数据的响应式处理(src/observer/index.js)。

```js
export function observe(data) {
  console.log(data);
}
```

运行npm run dev，浏览器控制台可以看到observe函数里的console获取到vue实例传入的data如下：

```
{a: "响应式数据原理"}
```

### 2.2 递归对象属性劫持

数据的劫持方案有两种： 
1.对象通过Object.defineProperty劫持数据更新； 
2.数组需单独处理

先来实现对象属性的劫持：

扩展observe方法：(src/observer/index.js)

```js
export function observe(data) {
  // 必须是对象才进行劫持
  if (typeof data !== 'object' || data === null) {
    return;
  }

  // 观测对象
  return new Observer(data);
}
```

创建一个Observer类重新定义对象的属性(src/observer/index.js)

```js
class Observer {
  constructor(value) {
    // console.log(value);
    // 使用defineProperty重新定义对象的属性
    this.walk(value);
  }
  walk(data) {
    let keys = Object.keys(data); // 拿到对象的浅拷贝层的key
    keys.forEach(key => {
      // 把key重新定义到data上面成为响应式数据
      defineReactive(data, key, data[key]);
    });
  }
}
const defineReactive = (data, key, value) => {
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue !== value) return;
      value = newValue;
    }
  })
}
```

创建一个data为深拷贝的对象的vue实例：(index.html)

```js
<script>
  const vm = new Vue({
    el: '#app',
    data() {
      return { a: { b: 1 } };
    }
  });
  console.log(vm._data);
</script>
```

打开http://localhost:3000查看浏览器输出结果：

![object1](https://user-images.githubusercontent.com/20060839/114256986-6ffcbd00-99ef-11eb-9c7f-e14168b45df3.png)

发现{ a: { b: 1 } }这个对象浅拷贝的一层被重新定义上了get和set方法，标志着成功数据劫持，但深一层的对象{ b: 1 }并没有被劫持；所以需要递归劫持深拷贝层的对象属性。

在defineReactive里面递归劫持深拷贝层的属性：

```
const defineReactive = (data, key, value) => {
  observe(value); // value有可能是对象，如果是对象就递归遍历深拷贝层的key属性进行重新定义
  ...
}
```

查看结果，发现{b: 1}层对象也被重新定义上了get和set方法，说明b属性已经被劫持。

![object2](https://user-images.githubusercontent.com/20060839/114257004-87d44100-99ef-11eb-8924-46ce72edb9b4.png)

### 2.3 重写数组方法劫持

在vue的实例中定义数组数据：

```js
data() {
  return { 
    arr: [1, 2, 3], // 数组
  };
}
```
打印出`vm._data`，按照对象劫持的方式，可以查看数组arr的每一个元素都被劫持了；

![arr1](https://user-images.githubusercontent.com/20060839/114256929-3af06a80-99ef-11eb-988f-a9ac6faafbc1.png)


当我们改变数组第一个元素时，却只能`vm._data.arr[0] = 0`这样改变，通过数组arr的索引去改变元素的值才能被vue响应式数据监听，这样不符合操作习惯，开发中很少对数组索引操作；而且当数组的元素多了起来，每一个数组元素都需要get和set去劫持，明显越来越损耗性能了。

在vue中，为了性能考虑不对数组进行Object.defineProperty拦截，vue中通过拦截可以改变数组的方法进行数据劫持，所以下面重写数组方法。

##### 数组元素劫持

在Observer类的构造函数里接收的value可以为数组，判断value为数组的情况下，在数组数据原型上扩展数组劫持方法。(src/observer/index.js)

```js
import { arrayMethods } from "./array";
class Observer {
  constructor(value) {
    if (Array.isArray(value)) {
      // 数据的value为数组，通过重写的数组方法劫持数据
      value.__proto__ = arrayMethods;
    } else {
      // 使用defineProperty重新定义对象的属性
      this.walk(value);
    }
  }
}
```
新建src/observer/array.js，重写数组的部分方法进行劫持数组数据。

```js
// 继承原生数组Array的原有方法
export let arrayMethods = Object.create(Array.prototype);

// 需扩展重写的方法
let methods = ['push', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'pop'];

methods.forEach(method => {
  arrayMethods[method] = function() {
    console.log(`数组重写方法${method}被调用`);
    const result = Array.prototype[method].apply(this, arguments);
    return result;
  }
})
```

这样就实现了value为数组情况下，value实例原型上扩展重写了`'push', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'pop'`这7个数组劫持方法，当通过这7个方法改变value值时，会被劫持到调用，这样就可以做更新视图的操作了。

比如通过`vm._data.arr.push(4)`改变数组数据，控制台会监听打印结果如下。

```
// 控制台输出
数组重写方法push被调用
```

通过输出`console.log(vm._data)`查看数据的结构如下。

![arr2](https://user-images.githubusercontent.com/20060839/114257031-b3efc200-99ef-11eb-8d9f-24c2037c0bb3.png)

可以看到数据`arr`的原型上有重写的7个数组方法；如果我们想用其他数组方法如concat的时候，也是可以用的，这是因为顺着原型链找到了原生数组的方法，在array.js中`Object.create(Array.prototype)`继承了原生数组的方法，形成了原型链。

但是也因为concat方法没有被重写，当通过`vm._data.arr.concat([4])`改变arr数据时，劫持不到arr数据发生变化。

##### 数组对象劫持

数据为数组单一元素时，可以通过重写的数组方法来劫持数组元素的变化。当数组中元素不再是单一的元素而是对象的时候，改变数组对象时，这时就不能观测到变化。

```js
const vm = new Vue({
  el: '#app',
  data() {
    return { 
      arrObj: [ { a: 1 } ], // 数组元素为对象
    };
  }
});
// 改变数组对象时，无法观测到数据变化
vm._data.arrObj[0].a = 2;
```

处理数组中对象的劫持，将数组中对象的每一项劫持。(src/observe/index.js)

```js
class Observer {
  constructor(value) {
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods;
      // 观测数组对象
      this.observeArray(value);
    }
    ...
  }
  observeArray(value) {
    value.forEach(item => {
      // 将数组对象的每一项劫持
      observe(item);
    })
  }
}
```

当value是数组对象时，observeArray方法将数组的对象的每一项劫持观测。

![arr3](https://user-images.githubusercontent.com/20060839/114257045-c5d16500-99ef-11eb-8295-23725d5936a2.png)

上面打印`vm._data`，数组对象加上了get和set，`vm._data.arrObj[0].a = 2`改变数组对象时，就可以监听到数据的变化了。

同理，当对数组arrObj进行push一个对象的时候，新加的数组对象没有进行劫持操作。应该在数组重写方法里面，对数组对象做拦截劫持。

```js
methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    console.log(`数组重写方法${method}被调用`);
    const result = Array.prototype[method].apply(this, args);

    let obData; // 数组中追加/粘接的对象
    switch (method) {
      case 'push':
        obData = args;
        break;
      case 'unshift':
        obData = args;
        break;
      case 'splice': // vue.$set原理
        obData = args.slice(2);
      default:
        break;
    }
    
    if (obData) this.__ob__.observeArray(obData);

    return result;
  }
})

```
在重写的数组方法中，push和unshift追加的数据，splice粘接的数据可能是对象，调用observeArray劫持数组中的对象。(src/observer/array.js)

`this.__ob__.observeArray`为Observer类原型上的方法，需要在Observer里挂载到实例的`__ob__`属性上。

```js
class Observer {
  constructor(value) {
    // defineProperty重新定义一个__ob__属性，值为Observer实例
    Object.defineProperty(value, '__ob__', {
      enumerable: false, // 不可枚举，也就是不能够被遍历到，为隐藏属性
      configurable: false, // 不可删除
      value: this // this为Observer实例
    });
    ...
  }
}
```

在数据上挂载了__ob__的属性，`enumerable: false`配置为不可枚举，隐藏属性避免value为对象而defineReactive陷入死循环。`this.__ob__.observeArray`数组重写方法里就可以直接用调用了。(src/observer/index.js)

用`vm._data.arrObj.push({ b: 2 })`向arrObj数组里push一个对象，查看`vm._data`的打印结果。

![arr4](https://user-images.githubusercontent.com/20060839/114257057-dbdf2580-99ef-11eb-866e-120da7486797.png)

结果显示新push的对象已经被劫持了，当改变其值也就会被监听到。

### 2.4 数据代理

使用数据的时候，当前只能通过`vm._data.arrObj`取到实例中的数据，如何直接变成vm.arrObj的形式方便操作数据呢？这里就需要用到数据代理，当在vm上取属性时，将属性的取值代理到vm._data上。

在数据的初始化initData函数中，对数据进行代理。(src/state.js)

```js
const initData = (vm) => {
  let data = vm.$options.data;
  // data可以是函数、对象，下面处理后得到对象
  data = typeof data === 'function' ? data.call(vm) : data;
  // 将data放到实例vm上外部可以通过vm._data访问到数据
  vm._data = data;

  // 数据代理
  for (let key in data) {
    // 当通过vm.key取值时，就去vm._data.key上取值
    proxy(vm, '_data', key);
  }
  ...
}
```

遍历data的每一个key，当通过vm.key取值时，就去vm._data.key上取值，这样就实现了数据代理。那怎样实现数据代理呢？还是用Object.defineProperty来重新定义key。

写一个proxy函数如下：

```js
const proxy = (vm, data, key) => {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key];
    },
    set(newValue) {
      vm[data].key = newValue;
    }
  });
}
```

使用Object.defineProperty重新定义了数据data中的key后，通过vm.key取值实际上是从vm._data.key取值；通过vm.key设值，也是设置到vm._data.key上了，这样就实现数据代理。

数据代理后，打印vm实例，如下图所示，vm实例上就有了配置项data里的所有key属性，以隐藏属性形式存在。

![proxy](https://user-images.githubusercontent.com/20060839/114258316-63c92d80-99f8-11eb-83c9-316881d07316.png)

# 三.模板编译

### 3.1 html编译成ast语法树

vue中的渲染逻辑是默认先会找配置项中的render方法进行渲染，没有传入render方法会查找template渲染，没有template最后才会找当前el指定元素中的内容进行渲染。

```js
const vm = new Vue({
  el: '#app',
  render(h) {
    return h('div', { id: 'a'}, hello);
  },
  // template: '<div id="a">hello</div>'
});
```

上面的template等价于render函数，其实也就是template里面的模板内容最终是转换成render函数里面的内容；这一过程就需要用到ast解析template成为ast语法树，最后转换成render函数。

初始化init.js中，在Vue原型上扩展$mount挂载方法，里面写上vue的渲染逻辑：(src/init.js)

```js
import { compileToFunctions } from "./compiler/index";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    ...

    // 模板编译
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }
  // 挂载
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);

    if (!options.render) {
      // 配置项无render取template
      let template = options.template;
      if (!template && el) {
        // 无template有el，取el里html内容
        template = el.outerHTML;
      }
      // 将模板编译成render函数
      const render = compileToFunctions(template);
      options.render = render;
    }
  }
}
```

接着需要将html模板编译成render函数，如何将html模板编译成render函数呢？这个时候就需要描述html结构，再将描述的html结构转换成js语法生成render函数。这样一种<b>描述html结构的方式就是ast语法树</b>。(src/compiler/parse.js)

将html编译成ast语法树的过程在src/compiler/parse.js路径文件里面，主要用正则解析html，用栈创建元素的父子关系形成ast语法树，这里不做过多阐述。

``` html
<div id="app" style="color:red;font-size:12px;">hello {{ name }} <span>word</span></div>
```
上面一段template模板转成ast语法树的结构如下：

![ast](https://user-images.githubusercontent.com/20060839/128676391-7126f796-3812-461f-953c-f55a8cd77639.png)


### 3.2 ast语法树转换成render函数形式

在上面的ast语法树中，想要渲染到页面，需要转成render函数的形式。

例如将上面一段html编译成ast语法树后，接着需要转成render的函数为如下形式：

```js
render() {
  return _c('div', { id: 'app', style: { color: 'red', fontSize: '12px' } }, _v('hello' + _s(name)), _c('span', null, _v('word')))
}
```
其中_c表示渲染元素，_v渲染文本，_s渲染数据。

新建src/compiler/generate.js，generate函数先从根节点开始转换ast为render函数形式，并且将根节点的属性转换成对应的对象。

```js
export function generate(ast) {
  let children = genChildren(ast);
  let code = `_c('${ast.tag}', ${ast.attrs.length ? `${genProps(ast.attrs)}` : 'undefined'}, ${children ? children : ''})`;
  return code;
}
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
```

根节点转换后，再遍历子节点渲染成render形式。

```js
// 生成子节点字符串
function genChildren(ast) {
  const children = ast.children;
  if (children) {
    return children.map(child => genChild(child)).join(','); // 将转换后的所有节点用逗号连接
  }
}
```

子节点转换genChild函数里面判断节点类型，如果是元素节点，则递归调用generate函数；如果是文本节点，则将普通文本转换成_v()，将双大括号文本转换成_s()。

```js
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
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
```

将ast语法树传入函数generate(ast)调用后，生成的render函数形式结果如下：

```js
_c('div', {id:"app",style:{"color":"red","font-size":"12px"}}, _v("hello"+_s(name)),_c('span', undefined, _v("word")))
```

在compileToFunctions函数中(src/compiler/index.js)，将render函数字符串转成render函数并返回该函数。

```js
export function compileToFunctions(template) {
  ...
  // 将render函数字符串转成render函数
  let render = new Function(`with(this){ return ${code} }`);
  return render;
}
```

### 3.3 创建虚拟dom

render函数生成后，需要渲染到页面上。渲染render函数，需要将render函数转换成虚拟节点，再将虚拟节点渲染到页面上，这个虚拟节点也就是我们常说的虚拟dom。

在原型的挂载函数$mount中，新增render函数转为虚拟dom的_render方法调用：(src/init.js)

```js
Vue.prototype.$mount = function (el) {
    const vm = this;
    ...
    if (!options.render) {
      ...
      const render = compileToFunctions(template);
      options.render = render;
    }

    // 挂载组件
    vm._render();
  }
```

新建vdom/index.js：(src/vdom/index.js)

新建renderMixin方法，并在入口文件src/index.js里调用`renderMixin(Vue)`，传入Vue。在Vue原型的_render方法里调用vm.$options.render函数，并且写好_c，_s，_v方法用于将render函数转成虚拟dom。

```js
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
```
接着写创建虚拟dom元素和虚拟dom文本元素的方法，它们都公用一个vnode方法，生成一样的用对象来描述的dom结构。

```js
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
```

控制台打印虚拟dom的结构如下：

![虚拟dom](https://user-images.githubusercontent.com/20060839/128677920-16a3c903-63b5-43d7-8e67-3ed58f4f423d.png)

通过和上面3.1中ast语法树的结构对比发现，虚拟dom结构和ast语法树的结构类似。

而虚拟dom和ast语法树的不同在于：<b>vdom用来描述dom对象，可以放一些自定义属性；ast转换的结果一定是根据html代码来的，不能新增一些不存在的属性。</b>

