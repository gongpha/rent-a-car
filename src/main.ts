import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login'

import Home from './pages/PageHome.vue'
import { createRouter, createWebHistory } from 'vue-router'

//

import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

const app = createApp(App)

const routes = [
	{ path: '/', component: Home, meta: { transition: 'slide-left' } },
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

app.use(vue3GoogleLogin, {
	clientId : "763401886526-6s90c85ivl9hcp0magmhjhhnv9ck1fs9.apps.googleusercontent.com"
})
app.use(router)
app.use(FloatingVue)

app.mount('#app')