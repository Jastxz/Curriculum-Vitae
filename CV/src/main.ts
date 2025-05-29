import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './i18n'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(i18n)
app.use(pinia)
app.mount('#app')