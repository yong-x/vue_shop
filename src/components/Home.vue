<template>
  <el-container class="home-container"> <!-- 由于el-container有多个，所以加一个class单独设计样式，而不直接用.el-container -->
    <!--头部区域-->
    <el-header>
      <div>
        <img  src="../assets/heima.png"/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click='logout'>退出</el-button>
    </el-header>

    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse?'64px':'200px'">
            <!-- 菜单栏隐藏按钮-->
            <div @click="toggleCollapse" class="toggle-button"><i :class="isCollapse?'el-icon-caret-right':'el-icon-caret-left'"></i></div>
            <!-- 侧边栏菜单区 -->
            <el-menu
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#3385ff"
              :default-active="currentActiveRoute"
              :unique-opened="true"
              :collapse="isCollapse"
              :collapse-transition="false"

              :router="true"> <!-- router 开启菜单属性index的vue-router模式，以index作为路由值进行跳转-->
              <!-- 一级菜单 -->
              <el-submenu index="1">
                <!-- 一级菜单模板区域-->
                <template slot="title">
                  <!-- 一级菜单的图标-->
                  <i class="el-icon-user-solid"></i>
                  <!-- 一级菜单文本-->
                  <span>用户管理</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item index="/users">
                  <!-- 二级菜单模板区域-->
                  <template slot="title">
                    <!-- 二级菜单的图标-->
                    <i class="el-icon-menu"></i>
                    <!-- 二级菜单文本-->
                    <span>用户列表</span>
                  </template>
                </el-menu-item>

                <el-menu-item index="/userstest">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>用户列表测试</span>
                  </template>
                </el-menu-item>
              </el-submenu>

              <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-key"></i>
                    <span>权限管理</span>
                  </template>
                  <el-menu-item index="/roles">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      <span>角色列表</span>
                    </template>
                  </el-menu-item>

                  <el-menu-item index="2-2">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      <span>权限列表</span>
                    </template>
                  </el-menu-item>
                </el-submenu>

            </el-menu>

      </el-aside>
      <!--右侧内容主体区-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
  export default {
    data(){
      return {
        isCollapse: false  //菜单栏是否折叠显示
      }
    },
    computed: {
      currentActiveRoute(){  //记录当前路由，为菜单激活状态赋值
        return this.$route.path
      }
    },
    methods: {
      logout(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      toggleCollapse(){
        this.isCollapse = !this.isCollapse
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex; //清除子元素的浮动和对其，由本元素进行控制
    justify-content: space-between; //子元素在在主轴从两端开始分散排列
    align-items : center;  //子元素排列方式
    padding-left: 0;
    color: #fff; //子元素中全局字体颜色
    font-size: 25px; //子元素中全局字体大小
    > div {  //less样式语法，设置子div元素样式
      display: flex;
      align-items: center;
      > span {  //less样式语法，设置子div的子span元素样式
        margin: 20px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    > i {
      margin-right: 20px;
    }
    .el-menu {
      border-right: 0;
    }
  }
  .el-main {
    background-color: #DCDCDC;
  }

  .el-submenu [class^=el-icon-] {
    margin-right: 20px;
  }
  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    cursor: pointer;

  }
</style>
