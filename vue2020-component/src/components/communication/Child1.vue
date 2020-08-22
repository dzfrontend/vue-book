<template>
  <div>
    <h3>child1</h3>
    <p>{{msg}}</p>
    <button @click="$emit('some-event', 'msg from child1')">点击自定义事件子给父传值</button>
  </div>
</template>

<script>
  export default {
    props: {
      msg: {
        type: String,
        default: ''
      },
    },
    mounted () {
      // 事件总线接收事件
      this.$bus.$on('event-from-child2', msg => {
        console.log('事件总线 Child1:', msg);
      });
      // $parent监听事件
      this.$parent.$on('event-from-child2', msg => {
        console.log('$parent Child1:', msg);
      });
    },
  }
</script>

<style scoped>

</style>