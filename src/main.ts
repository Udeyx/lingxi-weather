import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/aura-light-green/theme.css'
import Antd from 'ant-design-vue'
import 'primeicons/primeicons.css'

import 'qweather-icons/font/qweather-icons.css'
import ToastService from 'primevue/toastservice'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(PrimeVue, {
    ripple: true
})
app.use(ToastService)
app.use(ElementPlus)

app.mount('#app')
