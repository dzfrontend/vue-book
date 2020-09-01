<template>
  <div>
    <!-- 显示label -->
    <label v-if="label">{{label}}</label>
    <!-- 显示内部表单元素 -->
    <slot></slot>
    <!-- 错误提示信息 -->
    <p v-if="error" class="error">{{error}}</p>
    <!-- <p>{{form.rules[prop]}}</p> -->
  </div>
</template>

<script>
import Schema from "async-validator";
import emitter from '../../mixins/emitter';

export default {
  name: "KFormItem",
  componentName: "KFormItem",
  mixins: [ emitter ],
  inject: ["form"], // provide/inject传递KForm数据
  props: {
    label: {
      type: String,
      default: "",
    },
    prop: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      error: "",
    };
  },
  mounted() {
    this.$on("validate", () => {
      this.validate();
    });
    // 每新增一个KFormItem则派发事件告诉KForm组件
    this.dispatch('KForm', 'form.addField', [this]);
  },
  methods: {
    validate() {
      // 当前表单项校验
      // element使用的是async-validator
      // 获取校验规则和当前数据
      const rules = this.form.rules[this.prop];
      const value = this.form.model[this.prop];
      const schema = new Schema({ [this.prop]: rules });
      // 返回promise，全局可以统一处理
      return schema.validate({ [this.prop]: value }, (errors) => {
        // errors存在则校验失败
        if (errors) {
          this.error = errors[0].message;
        } else {
          // 校验通过
          this.error = "";
        }
      });
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>