import { initMixin } from "./init";

// Vue类用构造函数写法
function Vue(options) {
  // 调用initMixin插件里面的_init原型方法
  this._init(options);
}

// 原型方法写成插件的形式便于模块化
// 初始化options配置项
// Vue.prototype._init = function (options) {
// }
initMixin(Vue);

export default Vue;