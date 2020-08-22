<template>
  <div>
    <h3>child3</h3>
    <!-- $attrs -->
    <p>$attrs接收属性：{{$attrs.msg}}</p>
    <button @click="sendToGrandpa">触发$listeners传递的事件</button>
    <!-- inject/provide -->
    <p>{{bar1}}</p>
  </div>
</template>

<script>
  export default {
    // inject: ['bar'], // 类似于props
    inject: {
      bar1: {
        from: 'bar',
        default: 'bar1'
      }
    }, 
    methods: {
      sendToGrandpa() {
        // $emit触发$listeners传递的事件
        this.$emit('foo')
      },
    },
  }
</script>

<style scoped>

</style>