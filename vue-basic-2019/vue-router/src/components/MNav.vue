<template>
    <div class="navbar navbar-inverse">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand">管理系统</a>
            </div>
            <div class="navbar-nav nav">
                <li>
                    <router-link :to="{name:'home'}">首页</router-link>
                </li>
                <li>
                    <router-link :to="{name:'profile'}">个人中心</router-link>
                </li>
                <li>
                    <router-link :to="{path:'/user'}">用户管理</router-link>
                    </li>
                <li>
                    <router-link :to="{name:'login'}">登录</router-link>
                </li>
            </div>
        </div>
    </div>
</template>
