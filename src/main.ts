import { createApp } from 'vue'
import App from './App.vue'
import AdminLogin from './pages/admin/AdminLogin.vue'
import vue3GoogleLogin from 'vue3-google-login'
import VueCookies from 'vue-cookies'
import LoadingPlugin from 'vue-loading-overlay'

import Home from './pages/PageHome.vue'
import Search from './pages/PageSearch.vue'
import Addons from './pages/PageAddons.vue'
import Review from './pages/PageReview.vue'
import Reservation from './pages/PageReservation.vue'
import Reservations from './pages/PageReservations.vue'
import { createRouter, createWebHistory } from 'vue-router'

import AdminMain from './pages/admin/AdminMain.vue'
import AdminCars from './pages/admin/AdminCars.vue'
import AdminCarModels from './pages/admin/AdminCarModels.vue'
import AdminCarModel from './pages/admin/AdminCarModel.vue'
import AdminCar from './pages/admin/AdminCar.vue'


//

import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import AdminReservations from './pages/admin/AdminReservations.vue'
import AdminReservation from './pages/admin/AdminReservation.vue'
import AdminDashboard from './pages/admin/AdminDashboard.vue'

const app = createApp(App)

const routes = [
	{ path: '/', component: Home, meta: { transition: 'slide-left' } },
	{ path: '/search', component: Search },
	{ path: '/addons', component: Addons },
	{ path: '/review', component: Review },
	{ path: '/reservation/:rsvId', component: Reservation },
	{ path: '/reservations', component: Reservations },
	
	{ path: '/admin', component: AdminLogin, meta: { admin: true } },
	{ path: '/adminpanel', component: AdminDashboard, meta: { admin: true } },
	{ path: '/adminpanel/cars', component: AdminCars, meta: { admin: true } },
	{ path: '/adminpanel/models', component: AdminCarModels, meta: { admin: true } },
	{ path: '/adminpanel/car/:carId', component: AdminCar, meta: { admin: true } },
	{ path: '/adminpanel/model/:modelId', component: AdminCarModel, meta: { admin: true } },
	{ path: '/adminpanel/new/car/:branchId', component: AdminCar, meta: { admin: true, newPage: true } },
	{ path: '/adminpanel/new/model', component: AdminCarModel, meta: { admin: true, newPage: true } },
	{ path: '/adminpanel/reservations', component: AdminReservations, meta: { admin: true, newPage: true } },
	{ path: '/adminpanel/reservation/:rsvId', component: AdminReservation, meta: { admin: true, newPage: true } },
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
app.use(VueCookies)
app.use(LoadingPlugin)

app.mount('#app')