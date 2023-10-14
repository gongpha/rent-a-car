<script lang="ts">

import { defineComponent, inject } from 'vue'
import { googleAuthCodeLogin } from 'vue3-google-login'
import axios from 'axios';
import { apiURL } from '../envvars';
import type { VueCookies } from 'vue-cookies';

const $cookies = inject<VueCookies>('$cookies')

export default defineComponent({
	components: { },
	props: {
		url: String,
		displayname: String,
	},
	
	methods: {
		login: function () {
			googleAuthCodeLogin().then((response) => {
				axios.get(apiURL + '/googlelogin/auth', {
					params: {
						code: response.code,
					},
					withCredentials: true,
				}).then((response) => {
					let returnCode : string = response.data.return
					if (returnCode == "ERROR") {
						console.error("Error logging in bro")
						return
					}
					$cookies!.set('csrf_access_token', response.data.token) // damn
					document.location.href="/";
				})
			})
		},

		logout: function () {
			axios.post(apiURL + '/logout', {}, {
				withCredentials: true
			}).then((response) => {
				let returnCode : string = response.data.return
				if (returnCode == "ERROR") {
					console.error("Error logging out bro")
					return
				}
				document.location.href="/";
			})
		}
	}
})

</script>

<template>
	<div v-if="url" class="profilebutton-info">
		<div class="profilebutton-info-header">
			<img class="pfp-big" :src=url :alt=displayname>
			<h1>{{ displayname }}</h1>
		</div>
		<nav class="menu">
		<ul>
			<router-link to="/reservations"><li>การจองของฉัน</li></router-link>
			<!--a href="#"><li>โปรไฟล์ของฉัน</li></a-->
			<a href="#" @click="logout"><li>ออกจากระบบ</li></a>
		</ul>
		</nav>

	</div>
	<div v-else>
		<div class="login-panel">
			Login ด้วยคลิกเดียวผ่านบัญชี Google ของคุณ
		</div>
		<div class="profilebutton-loginchoices">
			<button @click="login" class="button white minicon">
				<img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" width="32"/>
				<span>Login ด้วย Google</span>
			</button>
		</div>
	</div>
	<!-- LEGACY
	<form>
		
		<label for="email">E-mail</label>
		<input type="email" id="email" name="email" placeholder="E-mail" required>

		<label for="password">Password</label>
		<input type="password" id="password" name="password" placeholder="Password" required>

		<input type="submit" value="Login">

	</form>
	-->
</template>