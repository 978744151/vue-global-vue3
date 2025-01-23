import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'



import plugins from './plugins' // plugins



import { createPinia } from 'pinia'
import microApp from '@micro-zoe/micro-app'



import SvgIcon from '@/components/SvgIcon/index.vue'
import elementIcons from '@/components/SvgIcon/svgicon'


import router from './router/index.ts'


import App from './App.vue'

import './style.css'

const pinia = createPinia()

const app = createApp(App)
// 
app.use(router)



// await router.ready()

app.use(pinia)
  .use(ElementPlus)
  .use(plugins)
  // .use(Avue,axios)
  .use(elementIcons)
  .component('svg-icon', SvgIcon).mount('#app')

// 卸载应用
window.unmount = () => {
  app.unmount()
}
