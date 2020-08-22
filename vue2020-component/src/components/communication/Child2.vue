<template>
  <div>
    <h3>child2</h3>
    <!-- 事件总线 -->
    <button @click="sendToChild1">用事件总线给child1发送消息</button>
    <button @click="sendToChild1Two">用$parent给child1发送消息</button>
  </div>
</template>

<script>
  export default {
    methods: {
      sendToChild1() {
        // 用事件总线发送事件
        this.$bus.$emit('event-from-child2', 'some msg from child2')
      },
      sendToChild1Two() {
        // 用$parent派发事件
        this.$parent.$emit('event-from-child2', 'some msg from child2')
      },
    },
  }
</script>

<style scoped>

</style>