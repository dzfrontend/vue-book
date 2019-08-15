<template>
    <div>
        <h3>用户列表</h3>
        <table class="table table-bordered">
            <tr>
                <th>用户id</th>
                <th>用户名</th>
            </tr>
            <tr v-for="list in lists" :key="list.id">
                <td>
                    <router-link :to="{path:'/user/detail',query:{id:list.id}}">{{list.id}}
                    </router-link>
                </td>
                <td>
                    <router-link :to="{name:'userDetail',params:{id:list.id}}">{{list.name}}</router-link>    
                </td>  
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    data(){
       return { lists:[]}
    },
   
    created(){
         this.lists = JSON.parse(localStorage.getItem('userList'))||[]
    }
}
</script>

