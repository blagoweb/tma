import './assets/index.css'

import { createApp } from 'vue'
import { retrieveLaunchParams } from '@telegram-apps/sdk-vue'
import App from './App.vue'
import router from './router'
import { errorHandler } from './errorHandler'
import { init } from './init'
import { pinia } from './stores'

init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV)

const app = createApp(App)
app.config.errorHandler = errorHandler
app.use(router)
app.use(pinia)
app.mount('#app')
