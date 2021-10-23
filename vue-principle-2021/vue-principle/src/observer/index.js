import { arrayMethods } from "./array";
import Dep from "./dep";

/**
 * 数据响应式原理处理
 */
class Observer {
  constructor(value) {
    // console.log(value);

    // defineProperty重新定义一个__ob__属性，值为Observer实例
    Object.defineProperty(value, '__ob__', {
      enumerable: false, // 不可枚举，也就是不能够被遍历到，为隐藏属性
      configurable: false, // 不可删除
      value: this // this为Observer实例
    });

    if (Array.isArray(value)) {
      // 数据的value为数组，通过重写的数组方法劫持数据
      value.__proto__ = arrayMethods;
      // 观测数组对象
      this.observeArray(value);
    } else {
      // 使用defineProperty重新定义对象的属性
      this.walk(value);
    }
  }
  // 一步步
  walk(data) {
    let keys = Object.keys(data); // 拿到对象的浅拷贝层的key
    keys.forEach(key => {
      // 把key重新定义到data上面成为响应式数据
      defineReactive(data, key, data[key]);
    });
  }
  observeArray(value) {
    value.forEach(item => {
      // 劫持数组对象的每一项
      observe(item);
    })
  }
}

const defineReactive = (data, key, value) => {
  observe(value); // value有可能是对象，如果是对象就递归遍历深拷贝层的key属性进行重新定义

  // 每个数据属性都有一个Dep
  let dep = new Dep();
  
  Object.defineProperty(data, key, {
    get() {
      console.log('get');
      // 当页面取值，说明这个值用来渲染了，将这个watcher和这个数据属性对应起来
      if (Dep.target) {
        // 让这个数据属性记住这个watcher
        dep.depend();
      }
      return value;
    },
    set(newValue) {
      console.log('set');
      if (newValue === value) return;
      observe(newValue); // 用户将值设置成对象继续监控
      value = newValue;
      dep.notify();
    }
  })
}
export function observe(data) {
  // 必须是对象才进行劫持
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  // 有__ob__自定义属性，说明已经被观测过，不需要再观测
  if (data.__ob__) {
    return data;
  }
  // 观测对象
  return new Observer(data);
}
