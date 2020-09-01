<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
// 1.props: model, rules
// 2.validate()
export default {
  name: "KForm",
  componentName: "KForm",
  provide() {
    return {
      form: this, // 这里传递的是表单组件的实例
    };
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    rules: Object,
  },
  created() {
    this.fields = [];
    this.$on('form.addField', item => {
      this.fields.push(item);
    });
  },
  methods: {
    validate(cb) {
      // 全局校验方法
      // 1.执行内部所有FormItem校验方法，统一处理结果
      // 将FormItem数组转换为Promise数组
      /**
       const tasks = this.$children
        .filter((item) => item.prop)
        .map((item) => item.validate());
       */
      
      // $children耦合性高，改用添加的所有的表单项
      const tasks = this.fields.filter((item) => item.prop).map((item) => item.validate());

      // 2.统一检查校验结果
      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => cb(false));
    },
  },
};
</script>

<style lang="scss" scoped>
</style>