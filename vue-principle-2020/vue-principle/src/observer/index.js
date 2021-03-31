/**
 * 数据响应式原理处理
 */
class Observer {
  constructor(value) {
    // console.log(value);
    // 使用defineProperty重新定义对象的属性
    this.walk(value);
  }
  // 一步步
  walk(data) {
    let keys = Object.keys(data); // 拿到对象的浅拷贝层的key
    keys.forEach(key => {
      // 把key重新定义到data上面成为响应式数据
      defineReactive(data, key, data[key]);
    });
  }
}

const defineReactive = (data, key, value) => {
  observe(value); // value有可能是对象，如果是对象就递归遍历深拷贝层的key属性进行重新定义
  Object.defineProperty(data, key, {
    get() {
      console.log('get');
      return value;
    },
    set(newValue) {
      console.log('set');
      if (newValue !== value) return;
      observe(newValue); // 用户将值设置成对象继续监控
      value = newValue;
    }
  })
}
export function observe(data) {
  // 必须是对象才进行劫持
  if (typeof data !== 'object' || data === null) {
    return;
  }

  // 观测对象
  return new Observer(data);
}
