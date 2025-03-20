import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", component: () => import("@/views/login/index.vue") },
    {
      path: "/",
      component: () => import("@/views/layout/index.vue"),
      // 暂时重定向为login
      redirect: "/login",
      children: [
        {
          path: '/Garden/home',
          component: () => import('@/views/map/ShowMap.vue')
        },
        { 
          path: "/Garden/DataManage/storage", 
          component: () => import("@/views/DataManageView/storage.vue"),
        },
        { path:"/Garden/DataManage/process", component: () => import("@/views/DataManageView/process.vue")},
        { path:"/Garden/VisualManage/chart", component: () => import("@/views/VisualManage/chart.vue")},
        { path:"/Garden/VisualManage/digitaltwin", component: () => import("@/views/VisualManage/DigitalTwin.vue")},
        { path:"/Garden/VisualManage/screen", component: () => import("@/views/VisualManage/screen.vue")}
      ]
    }
  ]
})

// 调试用
// router.beforeEach((to) => {
//   if (to.path == "/Garden") return "/Garden/home"
// })

// 登录访问拦截 => 默认是直接放行的
// 根据返回值决定，是放行还是拦截
// 返回值：
// 1. undefined / true  直接放行
// 2. false 拦回from的地址页面
// 3. 具体路径 或 路径对象  拦截到对应的地址
  //  '/login'   { name: 'login' }
router.beforeEach((to) => {
  // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
  // 调试
  // if (to.path !== '/login') return '/login'
})

export default router