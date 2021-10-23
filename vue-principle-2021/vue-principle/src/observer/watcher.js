import { popTarget, pushTarget } from "./dep";

/**
 * 数据依赖更新原理
 * 作用：渲染数据（渲染watcher）
 */
let id = 0; // 更新策略是以组件为单位，这个id是组件watcher的唯一标识
class Watcher {
  // fn 为vm._update(vm._render())
  constructor(vm, fn, cb) {
    this.vm = vm;
    this.fn = fn;
    this.cb = cb;
    this.id = id++;

    if(typeof fn === 'function') {
      this.getter = fn;
    }
    this.get();
  }
  get() {
    // this为当前Watcher实例
    // 取数据的值前添加Watcher实例(取数据的值也就是调用vm._render()的时候)
    pushTarget(this);
    this.getter();
    // 取数据的值后删掉Watcher实例
    popTarget();
  }
  update() {
    // 重新渲染
    this.get();
  }
}

export default Watcher;