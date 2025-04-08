import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


import plugins from './plugins' // plugins



// 引入 element-plus

import { createPinia } from 'pinia'






import SvgIcon from '@/components/SvgIcon/index.vue'

import elementIcons from '@/components/SvgIcon/svgicon'

import router from './router/index'

import App from './App.vue'

import './style.css'


const pinia = createPinia()

let app = null






window.mount = () => {
  app = createApp(App)
  // setupElementPlus(app)
  app.use(pinia)
    .use(router)
    .use(ElementPlus, { locale: zhCn })
    .use(plugins)
    .use(elementIcons)
    .component('svg-icon', SvgIcon).mount('#app')
  // fixBugForVueRouter4(router)
}

window.unmount = () => {
  app.unmount()
  // history?.destroy()
  app = null
  // router = null
  // history = null
}

// 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount()
}
