<script setup>
import { defineOptions, ref } from "vue";
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import {  userLoginService } from '@/api/user.js'
// 引入el自带ICON
import { User, Lock } from '@element-plus/icons-vue'
import Carousel from '@/components/Carousel.vue'


defineOptions({
  name: "LoginPage"
})

const slides = [
  { image: '/src/assets/1.jpg', alt: 'Image 1' },
  { image: '/src/assets/2.jpg', alt: 'Image 2' },
  { image: '/src/assets/3.jpg', alt: 'Image 3' },
  { image: '/src/assets/4.png', alt: 'Image 4' }
]

const form = ref()

// 整个的用于提交的form数据对象
const formModel = ref({
  username: '',
  password: '',
})
// 整个表单的校验规则
// 1. 非空校验 required: true      message消息提示，  trigger触发校验的时机 blur change
// 2. 长度校验 min:xx, max: xx
// 3. 正则校验 pattern: 正则规则    \S 非空字符
// 4. 自定义校验 => 自己写逻辑校验 (校验函数)
//    validator: (rule, value, callback)
//    (1) rule  当前校验规则相关的信息
//    (2) value 所校验的表单元素目前的表单值
//    (3) callback 无论成功还是失败，都需要 callback 回调
//        - callback() 校验成功
//        - callback(new Error(错误信息)) 校验失败
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    }
  ]
}

const userStore = useUserStore()
const router = useRouter()
const login = async () => {
  await form.value.validate()
  // userStore.setToken(res.data.token)
  // 个人用途设置假token
  userStore.setToken('some-fake-token')
  // console.log(userStore.token)
  ElMessage.success('登录成功')
  router.push('/Garden/home')
}

</script>

<template>
  <el-row class = "login-page"> 
    <el-col :span="17" class="show">
      <Carousel :items="slides" :interval="5000" />
    </el-col>
    <el-col
    :span="5"
    :offset="1"
    class="form"
    >
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
      >
        <el-form-item>
          <h1>平谷智慧桃园</h1>
        </el-form-item>
        <el-form-item>
          <el-input
          v-model="formModel.username"
          :prefix-icon="User"
          placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
          v-model="formModel.password"
          :prefix-icon="Lock"
          placeholder="请输入密码"
          type="password"
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
    width: 100vw;
    height: 100vh;
    background-color:#3bf5894d
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