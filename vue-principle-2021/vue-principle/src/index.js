import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vdom/index.js";
import { initGlobalApi } from "./global-api/index.js";
import { stateMixin } from "./state";

// Vue类用构造函数写法
function Vue(options) {
  // 调用initMixin插件里面的_init原型方法
  this._init(options);
}

// 原型方法写成插件的形式便于模块化
initMixin(Vue);
lifecycleMixin(Vue); // 混合生命周期
renderMixin(Vue);
stateMixin(Vue);

// Vue的静态方法：Vue.mixin
initGlobalApi(Vue);

export default Vue;