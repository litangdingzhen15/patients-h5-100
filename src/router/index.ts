import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({
  showSpinner: false // 进度条转圈特效关闭
})

const router = createRouter({
  // * 传入的值会拼接在网站地址后面，默认是'/'
  // * 在vite.config.ts文件中修改base可以更改BASE_URL
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' }
    },
    {
      path: '/consult/dep',
      component: () => import('@/views/Consult/ConsultDep.vue'),
      meta: { title: '选择科室' }
    },
    {
      path: '/consult/illness',
      component: () => import('@/views/Consult/ConsultIllness.vue'),
      meta: { title: '病情描述' }
    },
    {
      path: '/consult/pay',
      component: () => import('@/views/Consult/ConsultPay.vue'),
      meta: { title: '问诊支付' }
    },
    {
      path: '/room',
      component: () => import('@/views/Room/roomIndex.vue'),
      meta: { title: '问诊室' },
      beforeEnter(to) {
        if (to.query.payResult === 'false') return '/user/consult'
      }
    },
    {
      path: '/user/consult',
      component: () => import('@/views/User/ConsultPage.vue'),
      meta: { title: '问诊记录' }
    },
    {
      path: '/login/callback',
      component: () => import('@/views/Login/LoginCallback.vue'),
      meta: { title: 'QQ登录-绑定手机' }
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: {
            title: '健康百科'
          }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: {
            title: '消息通知'
          }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: {
            title: '个人中心'
          }
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  NProgress.start()
  const store = useUserStore()
  const whiteList = ['/login', '/login/callback'] // 白名单
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
})

router.afterEach((to) => {
  document.title = `${to.meta.title || ''}-${import.meta.env.VITE_APP_TITLE}`
  NProgress.done()
})

export default router
