<template>
  <div>
    <h2>组件通信</h2>
    <!-- props, 自定义事件 -->
    <Child1 msg="some msg from parent" 
      @some-event="onSomeEvent"></Child1>
    <!-- 事件总线, $parent -->
    <Child2 ref="child2" msg="some message"></Child2>
    <!-- $children, refs -->
    <div>
      <button @click="sendToChild1">$children父组件获取子组件的方法</button>
      <button @click="sendToChild1Two">refs获取子组件引用</button>
    </div>

    <!-- $attrs/$listeners，inject/provide -->
    <Parent msg="msg from grandpa"
      @foo="onFoo"></Parent>
  </div>
</template>

<script>
  import Child1 from '@/components/communication/Child1.vue'
  import Child2 from '@/components/communication/Child2.vue'
  import Parent from '@/components/communication/Parent.vue'
  
  export default {
    provide() {
      return {
        bar: 'provide bar'
      }
    },
    components: {
      Child1, Child2, Parent
    },
    methods: {
      onSomeEvent(msg) {
        console.log('自定义事件 Communition:', msg);
      },
      sendToChild1() {
        // 父组件可以通过$children访问子组件，访问内部的sendToChild1方法，$children是所有的子组件数组
        this.$children[1].sendToChild1();
      },
      sendToChild1Two() {
        // refs获取子节点引用
        this.$refs.child2.sendToChild1Two();
      },
      onFoo() {
        console.log('$listeners传递事件 grandpa：msg from Child3');
      }
    },
  }
</script>

<style scoped>

</style>