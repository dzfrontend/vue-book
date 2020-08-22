# vue组件通信的方式

组件通信常用方式：

* props
* `$emit/$on`
* event bus
* vuex

不太常用的边界情况：

* `$parent/$children/$root` （项目中不推荐使用，因为耦合性高，常用于通用组件库中）
* $refs
* 隔层传参provide/inject
* 非prop特性`$attrs/$listeners`

### props

父给子传值

```vue
// child
props: { msg: String }

// parent
<HelloWorld msg="Welcome to Your Vue.js App"/>
```

### 自定义事件`$emit/$on`

`vm.$on(event, callback)`监听当前实例上的自定义事件，事件由vm.$emit触发

`vm.$emit(event, […args])`触发当前实例上的事件，附加参数都会传给`$on`的回调函数

子给父传值

```
// child
this.$emit('add', good)

// parent
<Cart @add="cartAdd($event)"></Cart>
```
父组件使用@add="cartAdd($event)"@就是v-on的简写，监听由子组件`vm.$emit`触发的'add'事件

### 事件总线event bus

任意两个组件之间传值常用事件总线或 vuex的方式。

```
// Bus：事件派发、监听和回调管理
class Bus {
  constructor(){
    this.callbacks = {}  
  }  
  $on(name, fn){
    this.callbacks[name] = this.callbacks[name] || []
    this.callbacks[name].push(fn)  
  }  
  $emit(name, args){
    if(this.callbacks[name]){
      this.callbacks[name].forEach(cb => cb(args))    
    }  
  }
}
  
// main.js
Vue.prototype.$bus = new Bus()
// child1
this.$bus.$on('foo', handle) 
// child2
this.$bus.$emit('foo')
```

> 实践中通常用Vue代替Bus，因为Vue已经实现了相应`$on$emit`接口

### vuex

创建唯一的全局数据管理者store，通过它管理数据并通知组件状态变更。

### `$parent/$root`

兄弟组件之间通信可通过共同祖辈搭桥，`$parent或$root`，`$parent`可以访问父组件，`$root`可以访问根组件，在不同的子组件之间使用相同的中间人做事件的派发和监听，`$parent或$root`就是这样的一个中间人。

```
// brother1
this.$parent.$on('foo', handle) 
// brother2
this.$parent.$emit('foo')
```

### `$children`

父组件可以通过`$children`访问子组件实现父子通信。

父组件直接通过`$children`访问子组件方法，`$children`是子组件集合，`$children[0]`为第一个子组件：

```
// parent
this.$children[0].fn()
```

### refs

获取子节点引用

> refs和`$children`功能类似，refs不仅可以引用子组件实例本身，也可以引用原生的dom元素，而`$children`只能引用子组件实例本身。

```
// parent
<HelloWorld ref="hw"/>
mounted() {  
  this.$refs.hw.fn()
}
```

### `$attrs/$listeners`

包含了父作用域中不作为 prop 被识别且获取的特性绑定 (class和style除外)，也就是当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class和style除外)，并且可以通过v-bind="$attrs"传入内部组件——在创建高级别的组件时非常有用。

`v-bind="$attrs"`可用于属性的隔代传递
`v-on="$listeners"`可用于事件的隔代传递(具体见源码)

```
// grandpa
<parent foo="foo" @foo="onFoo"/>

// parent
// 用v-bind="$attrs"传递所有属性，v-on="$listeners"传递所有事件；$attrs可以接收属性
<p>{{$attrs.foo}}</p>
<child v-bind="$attrs" v-on="$listeners"/>

// child
// child并未在props中声明foo，孙子组件中就用$attrs获取属性，用$emit触发$listeners传递的事件
<p>{{$attrs.foo}}</p>
this.$emit('foo')
```

### provide/inject

能够实现祖先和后代之间传值

```
// ancestor
provide() {
  return {foo: 'foo'}
}

// descendant
inject: ['foo']
```

范例：上面所有组件通信的代码都在这里：[组件通信](./src/components/communication)