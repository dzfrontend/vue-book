<template>
  <div>
    <!-- KForm -->
    <KForm :model="model" :rules="rules" ref="loginForm">
      <KFormItem label="用户名" prop="username">
        <KInput v-model="model.username" placeholder="请输入用户名"></KInput>
      </KFormItem>
      <KFormItem label="密码" prop="password">
        <KInput v-model="model.password" placeholder="请输入密码"></KInput>
      </KFormItem>
      <KFormItem>
        <button @click="login">登录</button>
      </KFormItem>
    </KForm>
  </div>
</template>

<script>
import KInput from "@/components/form/KInput.vue";
import KFormItem from "@/components/form/KFormItem.vue";
import KForm from "@/components/form/KForm.vue";
import create from '@/utils/create'
import Notice from '@/components/Notice.vue';

export default {
  components: {
    KInput,
    KFormItem,
    KForm
  },
  data() {
    return {
      model: {
        username: "tom",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "请输入用户名" }],
        password: [{ required: true, message: "请输入密码" }]
      }
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          create(Notice, {
            title: '提示',
            message: 'success submit',
            duration: 3000
          }).show()
        } else {
          create(Notice, {
            title: '提示',
            message: 'error submit',
            duration: 3000
          }).show()
        }
      });
    }
  }
};
</script>

<style scoped>
</style>