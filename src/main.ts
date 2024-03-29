import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/api/interceptor'
import './assets/style/main.less'

// 加载mock
import './mock'

const app = createApp(App)

// 引入Argo Design UI组件
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
app.use(ArcoVue, {})
app.use(ArcoVueIcon)

// 加载多语言插件
import i18n from './locale'
app.use(i18n)

app.use(createPinia())
app.use(router)

app.mount('#app')
