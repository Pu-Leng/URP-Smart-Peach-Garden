import axios from 'axios'
// import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://localhost:6370/api'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 请求拦截器
// instance.interceptors.request.use(
//   (config) => {
//     // TODO 2. 携带token
//     const useStore = useUserStore()
//     if (useStore.token) {
//       config.headers.Authorization = useStore.token
//     }
//     return config
//   },
//   (err) => Promise.reject(err)
// )

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 摘取核心响应数据，如果数据undefined说明服务异常
    if (res.status !== 404 ) {
      return res
    }
    // 处理业务失败
    // 处理业务失败, 给错误提示，抛出错误
    // ElMessage.error({message: res.data.message || '服务异常', type:error})
    return Promise.reject(res.data)
  },
  (err) => {
    // 处理401错误
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) {
      router.push('/login')
    }

    // 错误的默认情况 => 只要给提示
    // ElMessage.error({message: res.data.message || '服务异常', type:error})
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
