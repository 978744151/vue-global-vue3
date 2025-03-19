import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/src/index.scss' // element-plus css
import zhCn from 'element-plus/es/locale/lang/zh-cn'



import plugins from './plugins' // plugins



import { createPinia } from 'pinia'
import microApp from '@micro-zoe/micro-app'



import SvgIcon from '@/components/SvgIcon/index.vue'
import elementIcons from '@/components/SvgIcon/svgicon'


import router from './router/index'


import App from './App.vue'

import './style.css'

const pinia = createPinia()

const app = createApp(App)
// 
app.use(router)



// await router.ready()

app.use(pinia)
.use(ElementPlus, { locale: zhCn,namespace:'el' })
.use(plugins)
  // .use(Avue,axios)
  .use(elementIcons)
  .component('svg-icon', SvgIcon).mount('#app')

// 卸载应用
window.unmount = () => {
  app.unmount()
}
