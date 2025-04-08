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
    path: '/template/:id',
    name: 'template-detail',
    component: () => import('@/views/template/detail.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
  },
  
]
console.log(window.__MICRO_APP_BASE_ROUTE__)

const router = createRouter({
  history: createWebHistory( '/g-shopCenter'),
  routes
})


export default router


