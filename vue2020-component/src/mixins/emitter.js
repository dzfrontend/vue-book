/**
 * element ui 组件通信源码：低耦合，替代$parent通信耦合性高的问题(只能父级，不能跨级)
 */
// 广播：自上而下派发事件
function broadcast(componentName, eventName, params) {
  // 遍历所有子元素，直到子元素的组件名()和传入的componentName相同则派发事件
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    // 向上(相当于冒泡)查找直到找到与componentName参数相同的组件名并派发事件
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      // 向上查找直到找到相同名称的组件
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      // 如果找到就跳出循环派发事件
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};