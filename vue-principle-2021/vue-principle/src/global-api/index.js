/**
 * Vue的静态方法
 */

import { mergeOptions } from "../util";

export function initGlobalApi(Vue) {
  // 初始化Vue的options属性为空对象
  Vue.options = {};
  // 混合混入方法mixin
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    // console.log(this.options);
  }
}