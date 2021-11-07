import { popTarget, pushTarget } from "./dep";
import { nextTick } from "../util";

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
    // this.get();
    // 改为缓存watcher
    queueWatcher(this);
  }
}

let queue = []; // 缓存队列queue：将需要批量更新的watcher，去重存到队列中缓存起来
let has = {};
let pending = false; // 批处理（也就是防抖）

function flushSchedulerQueue() {
  queue.forEach(watcher => { watcher.get(); watcher.cb(); });
  queue = []; // 清空队列
  has = {};
  pending = false;
}

function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    queue.push(watcher);
    has[id] = true;
  }
  if (!pending) {
    // 等待所有的同步代码执行完毕后再执行
    nextTick(flushSchedulerQueue);
    // pending：只跑一次定时器，如果还没清空缓存队列，就不要再开定时器了
    pending = true;
  }
}

export default Watcher;