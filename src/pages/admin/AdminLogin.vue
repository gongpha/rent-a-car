<script setup lang="ts">

import axios from 'axios';
import { apiURL } from '../../envvars';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const username = ref<string>("")
const password = ref<string>("")
const errorText = ref<string>("")

const router = useRouter();

function login() {
	axios.post(apiURL + '/admin/login', {
		username: username.value,
		password: password.value
	}, {
		withCredentials: true
	}).then((response) => {
		document.location.href = '/adminpanel';
	}).catch((error) => {
		errorText.value = error.response.data.error
	})
}
</script>

<template>
	<div class="admin-login">
		<router-link to="/" class="header-logo">
			<img src="/logo.svg" width="32"/>
			<span class="header-logo-text" style="color: #444">RentACar</span>
		</router-link>
		<h3>Admin Control Panel</h3>
		<div>
			<input type="text" placeholder="Username" v-model="username" />
			<input type="password" placeholder="Password" v-model="password" />
			<br/>
			<button @click="login">Login</button>
			<br/>
			<span class="admin-login-error">{{ errorText }}</span>
		</div>
		
		<span class="admin-footer">Copyright (c) RentACar 2004-2023</span>
	</div>
</template>