import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import microApp from '@micro-zoe/micro-app'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css'
import router from './router'
import { microAppConfig } from './config'

// 启动micro-app
microApp.start({
  preFetchApps: microAppConfig.getPreloadApps(),
})

microApp.setData('child-one', {
  result: 6666666,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.mount('#app')
