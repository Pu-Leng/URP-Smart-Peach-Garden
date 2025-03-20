<script setup>
import { defineOptions } from "vue";
import { HomeFilled, Menu as IconMenu, FolderAdd, SwitchButton, TurnOff, Histogram, VideoCameraFilled, UploadFilled, Picture} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'

defineOptions({
  name: "MapHeader"
})

const userStore = useUserStore()
const logout = () => {
  userStore.removeToken();
}


</script>

<template>
  <!-- el-menu 整个菜单组件
      :default-active="$route.path"  配置默认高亮的菜单项
      router  router选项开启，el-menu-item 的 index 就是点击跳转的路径 -->
  <el-container class="layout">
    <el-header>
      <el-menu
        :default-active="$route.path"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        router
      >
        <!-- 使用elp菜单自带的api，router，进行路由的跳转 -->
        <el-menu-item index="/login">
          <img
            style="width: 52px"
            src="@/assets/CAU.png"
            alt="MapPage"
          />
        </el-menu-item>
        <div class="flex-grow" >
          <div class="title">平谷智慧桃园</div>
        </div>
        <el-menu-item index="/Garden/home" >
          <el-icon><home-filled/></el-icon>
          <span>桃园首页</span>
        </el-menu-item>
        <el-sub-menu index ='1'>
          <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>数据可视化</span>
          </template>
          <el-menu-item index="/Garden/VisualManage/screen"><el-icon><TurnOff /></el-icon>数据大屏</el-menu-item>
          <el-menu-item index="/Garden/VisualManage/chart"><el-icon><Histogram /></el-icon>图表展示</el-menu-item>
          <el-menu-item index="/Garden/VisualManage/digitaltwin"><el-icon><VideoCameraFilled /></el-icon>桃树数字孪生</el-menu-item>
          <!-- <el-sub-menu index="2-4">
            <template #title>item four</template>
            <el-menu-item index="2-4-1">item one</el-menu-item>
            <el-menu-item index="2-4-2">item two</el-menu-item>
            <el-menu-item index="2-4-3">item three</el-menu-item>
          </el-sub-menu> -->
        </el-sub-menu>
        <el-sub-menu index ='2'>
          <template #title>
            <el-icon><FolderAdd /></el-icon>
            <span>数据管理</span>
          </template>
          <el-menu-item index="/Garden/DataManage/storage"><el-icon><UploadFilled /></el-icon>数据导入与存储</el-menu-item>
          <el-menu-item index="/Garden/DataManage/process"><el-icon><Picture /></el-icon>数据处理</el-menu-item>
          <!-- <el-menu-item index="3-3">item three</el-menu-item>
          <el-sub-menu index="3-4">
            <template #title>item four</template>
            <el-menu-item index="3-4-1">item one</el-menu-item>
            <el-menu-item index="3-4-2">item two</el-menu-item>
            <el-menu-item index="3-4-3">item three</el-menu-item>
          </el-sub-menu> -->
        </el-sub-menu>
        <!-- 退出登录按钮，点击清除token -->
        <el-menu-item
        @click="logout"
        index = '/'
        >
          <el-icon><SwitchButton /></el-icon>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <el-footer>平谷智慧桃园 ©2024 Created by C281</el-footer>
  </el-container>
</template>


<style lang="scss" scoped>
.flex-grow {
  flex-grow: 1;
}

.layout{
  height: 100vh;
  .el-main{
    display: flex;
    padding: 0;
  }
  .el-header{
    padding: 0px;
    .title{
      line-height:59px;
      font-size: 30px;
      font-weight: 900;
      font-family: 'Microsoft JhengHei';
      color:#383838
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #666;
    --el-footer-height: 25px;
    padding: 0px
  }
}
</style>