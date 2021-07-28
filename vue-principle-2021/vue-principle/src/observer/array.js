/**
 * 重写数组的方法劫持数组数据
 * 劫持数组数据的方法有push, shift, unshift, splice, sort, reverse, pop
 */

// 继承原生数组Array的原有方法
// arrayMethods._proto_ = Array.prototype 继承原生数组的原型方法
export let arrayMethods = Object.create(Array.prototype);

// 需扩展重写的方法
let methods = ['push', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'pop'];

methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    console.log(`数组重写方法${method}被调用`);
    const result = Array.prototype[method].apply(this, args);

    // push, unshift追加的数据，splice粘接的数据可能是对象，需要劫持
    let obData; // 数组中追加/粘接的对象
    switch (method) {
      case 'push':
        obData = args;
        break;
      case 'unshift':
        obData = args;
        break;
      case 'splice': // vue.$set原理
        obData = args.slice(2);
      default:
        break;
    }
    if (obData) this.__ob__.observeArray(obData);

    return result;
  }
})
