import Vue from 'vue'

// 传入一个组件配置
// 创建它的实例，并且将它挂载到body上
// 返回组件实例
export default function create(Component, props) {
  // 实例创建
  // 方法一：使用extend方式创建组件实例并挂载

  // extend方法返回的组件构造函数
  const ctor = Vue.extend(Component);
  // 组件实例
  const comp = new ctor({ propsData: props });
  // 挂载
  comp.$mount();
  document.body.appendChild(comp.$el);
  comp.remove = () => {
    document.body.removeChild(comp.$el);
    comp.$destroy();
  }
  return comp;
  /**
    // 方式二：借鸡生蛋
    const vm = new Vue({
      render(h) {
        return h(Component, { props })
      }
    }).$mount() // $mount()本质上将vdom=》dom

    // 通过vm.$el获取生成的dom
    document.body.appendChild(vm.$el)

    // 删除函数
    // 获取组件实例
    const comp = vm.$children[0]

    comp.remove = () => {
      document.body.removeChild(vm.$el);
      vm.$destroy();
    }

    return comp;
   */
}