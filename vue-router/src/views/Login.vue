<template>
    <div>
        <button @click="login" class="btn btn-danger">登录</button>
    </div>
</template>

<script>
export default {
    methods:{
        login(){
            localStorage.setItem('login',true);
            this.$router.push({name:'profile'});
        }
    }
}
</script>
