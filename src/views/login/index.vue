<script setup>
import { defineOptions } from "vue";
import { useRouter } from 'vue-router'

defineOptions({
  name: "LoginPage"
})

// 引入el自带ICON
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const login = () => {
  router.push('/') //这里暂时写成这样，后面要改
}

</script>

<template>
  <el-row class = "login-page"> 
    <el-col :span="17" class="show">
      桃园展示轮播图
    </el-col>
    <el-col
    :span="5"
    :offset="1"
    class="form"
    >
      <el-form>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item>
          <el-input
          :prefix-icon="User"
          placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
          :prefix-icon="Lock"
          placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div>
            <el-checkbox>记住我</el-checkbox>
          </div>
        </el-form-item>
        <!-- type为el样式的一种属性，下面两个按钮里的方法后面要改一改 -->
        <el-form-item>
          <el-button
            class="button1"
            type="primary"
            auto-insert-space
            @click="login"
            >登录</el-button>
          <el-button
            class="button2"
            type="primary"
            auto-insert-space
            @click="login"
            >以游客身份游览</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang = "scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .show{
    background-color:#409eff
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .button1 {
      width: 35%;
    }
    .button2{
      width: 61%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>