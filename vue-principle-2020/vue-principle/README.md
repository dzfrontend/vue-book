# 手写vue核心原理

## 一.使用Rollup搭建开发环境

1.什么是Rollup?

Rollup是一个js模块打包器，可以将小块代码编译成大块复杂的代码，rollup.js更专注于js类库打包(开发应用时使用webpack，开发库是使用rollup)。

2.环境搭建

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