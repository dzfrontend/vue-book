<template>
    <div>
        <h1>首页</h1>
        <button @click="login" class="btn btn-primary">去登录页面</button>
    </div>
</template>


<script>
export default {
    methods:{ // this.$route this.$router
        login(){
            this.$router.push({path:'/login'})
        }
    }

}
</script>
