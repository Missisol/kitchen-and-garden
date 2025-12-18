import './assets/styles/main.css'

import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia'
import { routes } from './router.js'
import App from './App.vue'

const pinia = createPinia()

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
.use(pinia)
.use(router)
.mount('#app')
