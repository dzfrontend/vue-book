// 数据代理
const proxy = (vm, data, key) => {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key];
    },
    set(newValue) {
      vm[data][key] = newValue;
    }
  });
}

// 策略对象
const strats = {};
// 简单处理数据的合并
strats.data = function (parentVal, childVal) {
  return childVal;
}

// 生命周期的合并
const mergeHook = (parentVal, childVal) => {
  if (childVal) {
    if (parentVal) {
      // 数组合并
      return parentVal.concat(childVal);
    } else {
      // 第一次parentVal为空，只会进这里，将childVal转换为数组
      return [childVal];
    }
  } else {
    return parentVal;
  }
};

const LIFECICLE_HOOKS = ['beforeCreate', 'created', 'beforMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestory', 'destroyed'];
LIFECICLE_HOOKS.forEach(hook => {
  // 这里用策略模式，每一个生命周期钩子函数用相同的mergeHook方法策略
  strats[hook] = mergeHook;
});

const mergeOptions = (parent, child) => {
  const options = {};

  // 合并parent和child的key
  for(let key in parent) {
    mergeField(key);
  }

  // 处理child的key
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }

  // key合并
  function mergeField(key) {
    if (strats[key]) {
      // 根据key用不同的策略进行合并
      options[key] = strats[key](parent[key], child[key]);
    } else {
      // 默认合并
      options[key] = child[key];
    }
  }

  return options;
}

/**
 * nextTick实现原理
 */
let callbacks = [];
let pending = false;
function flushCallbacks() {
  // callbacks.forEach(cb => cb());
  // callbacks = [];
  while (callbacks.length) {
    // 批处理所有的cb
    let cb = callbacks.shift();
    cb();
  }
  pending = false;
} 

// 异步方法，做了兼容处理
const timerFunc = () => {
  // 异步方法里：等待所有的nextTick的cb push到callbacks里，批处理所有的cb
  if (Promise) { // 浏览器支持Promise，使用异步方法Promise.resolve.then
    Promise.resolve().then(flushCallbacks);
  } else if (setImmediate) { // setImmediate也是异步方法，性能比setTimeout好
    setImmediate(flushCallbacks);
  } else {
    setTimeout(flushCallbacks, 0);
  }
}

const nextTick = (cb) => {
  callbacks.push(cb);
  if (!pending) {
    // 页面中n次调用nextTick方法，callbacks里push回调cb函数n次，pending这里防抖处理，只用执行一次异步方法timerFunc
    timerFunc();
    pending = true;
  }
}

export { proxy, mergeOptions, nextTick };