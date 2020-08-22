<template>
  <div>
    <h3>parent</h3>
    <!-- 属性展开 -->
    <Child3 v-bind="$attrs" v-on="$listeners"></Child3>
  </div>
</template>

<script>
  import Child3 from '@/components/communication/Child3.vue';
  
  export default {
    components: {
      Child3
    },
  };
</script>

<style lang="scss" scoped>

</style>