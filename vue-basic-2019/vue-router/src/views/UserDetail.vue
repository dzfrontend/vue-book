<template>
    <div>
        路由传参：
        <br/>
        当前用户是: 
        <br/>
        路由的url传参：{{this.$route.query.id}}
        <br/>
        路由的路径传参：{{this.$route.params.id}}
    </div>
</template>

<script>
export default {
    // 方法一：可以通过监控$route改变，实现加载数据
    watch:{
        '$route'(){
            console.log('参数变了');
        }
    },
    // 方法二：可以通过路由钩子函数beforeRouteEnter
    // 进入新的页面，组件会调用路由钩子函数beforeRouteEnter
    beforeRouteEnter(to,from,next){ //  路由进入前
        console.log('component enter')
        next(vm=>{
            console.log(vm) // vm在next中能拿到
        });
    },
    // 组件渲染完成后，有属性更新会调用路由钩子函数beforeRouteUpdate
    beforeRouteUpdate(){
        console.log('路由属性更新了，但是组件是复用的')
    },
}
</script>

