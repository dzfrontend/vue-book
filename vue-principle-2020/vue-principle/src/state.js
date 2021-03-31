/**
 * 初始化状态相关
 * 状态有：data props watch computed
 */

import { observe } from "./observer/index";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  // 响应式数据原理和数据相关
  // 数据初始化劫持
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}

const initProps = () =>  {

}

// 数据初始化劫持
const initData = (vm) => {
  let data = vm.$options.data;
  // data可以是函数、对象，下面处理后得到对象
  data = typeof data === 'function' ? data.call(vm) : data;
  // 将data放到实例vm上外部可以通过vm._data访问到数据
  vm._data = data;
  /**
   * 数据的劫持方案：
   * 1.对象 Object.defineProperty
   * 2.数组 需单独处理
   */
  observe(data);
}

const initComputed = () => {

}

const initWatch = () => {

}