<template>
    <form class="form" @submit.prevent="add">
        <div class="form-group">
            <label for="username" class="control-label">用户名</label>
            <input type="text" class="form-control" v-model="username" id="username">
        </div>
        <div class="form-group">
            <button class="btn btn-success">添加</button>
        </div>
    </form>
</template>

<script>
export default {
    data(){
        return {username:''}
    },  
    // 路由钩子函数
    // 当组件切换时，也就是路由离开时会触发路由钩子函数beforeRouteLeave
    beforeRouteLeave(to,from,next){ 
        // next和express中的next类似
        if(this.username){ 
            let flag = window.confirm('你确定离开吗?');
            if(flag){
                next();
            }
        }else{
            next();
        }
       
    },
    methods:{
        add(){
            let userList = JSON.parse(localStorage.getItem('userList')) || [];
            userList.push({name:this.username,id:Math.random()});
            localStorage.setItem('userList',JSON.stringify(userList));
            this.username = null;
            this.$router.push({name:'userList'});
        }
    }
}
</script>
