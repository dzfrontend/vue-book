<template>
  <div>
    <!-- 管理数据，实现双向绑定 -->
    <!-- :value, @input v-bind="$attrs"接受KInput绑定所有其他input属性-->
    <input :type="type" :value="value" @input="onInput" v-bind="$attrs" />
  </div>
</template>

<script>
import emitter from '../../mixins/emitter';

export default {
  inheritAttrs: false, // false则未被props注册的属性不会作为普通html元素属性被渲染
  mixins: [ emitter ],
  props: {
    value: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
  },
  methods: {
    onInput(e) {
      this.$emit("input", e.target.value);

      // 触发校验
      // this.$parent.$emit("validate");
      // 用$parent提交事件，当KFormItem的结构发生变化的时候(如在KInput上加了一层包裹)，会发生耦合，KFormItem不再是KInput的parent，这时候KFormItem就无法监听$parent的事件

      // 参考element ui form源码中的dispatch方法
      this.dispatch("KFormItem", "validate"); // 向KFormItem组件（组件里需要加上componentName: "KFormItem"进行标识）派发validate事件
    },
  },
};
</script>

<style lang="scss" scoped>
</style>