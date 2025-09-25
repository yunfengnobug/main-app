import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      redirect: '/home',
      component: () => import('../views/layout.vue'),
      children: [
        // 主应用页面
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        },
        // 系统管理相关页面
        {
          path: '/system/settings',
          name: 'system-settings',
          component: () => import('../views/SystemSettingsView.vue'),
        },
        {
          path: '/system/logs',
          name: 'system-logs',
          component: () => import('../views/SystemLogsView.vue'),
        },
      ],
    },
    // 子应用路由 - 直接使用layout处理
    {
      path: '/child-one/:path*',
      name: 'child-one',
      component: () => import('../views/layout.vue'),
    },
    {
      path: '/child-two/:path*',
      name: 'child-two',
      component: () => import('../views/layout.vue'),
    },
  ],
})

export default router
