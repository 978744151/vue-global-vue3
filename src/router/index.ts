import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/svgCanvas',
    name: 'svgCanvas',
    component: () => import('@/views/svgCanvas/index.vue'),
  },
  {
    path: '/template',
    name: 'template',
    component: () => import('@/views/template/index.vue'),
  },
  {
    path: '/template/detail',
    name: 'detail',
    component: () => import('@/views/template/detail.vue'),
  },
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


