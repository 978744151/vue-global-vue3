import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})


export default router


