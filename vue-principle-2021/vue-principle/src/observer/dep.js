/**
 * 依赖收集和依赖更新
 * Dep和Watcher的对应关系为多对多：
   一个watcher可以对应多个Dep：一个组件中有多个数据属性，一个数据属性有一个Dep用来收集Watcher，而一个组件对应一个Watcher
   一个Dep可以存多个Watcher
   */

class Dep {
  constructor() {
    this.subs = [];
  }
  // watcher实例依赖收集
  depend() {
    this.subs.push(Dep.target);
  }
  // 依赖更新
  notify() {
    this.subs.forEach(watcher => watcher.update());
  }
}

// Dep为全局变量
Dep.target = null;
export function pushTarget(watcher) {
  Dep.target = watcher;
}
export function popTarget() {
  Dep.target = null;
}

export default Dep;