<script setup lang="ts">

import { onBeforeMount, onMounted } from 'vue';
import axios from 'axios';
import { ref } from 'vue';
import { apiURL } from '../envvars'
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
	requested: Boolean,
	username: String,
	branch_name: String
})

onBeforeMount(() => {
	document.body.className = 'adminpanel';
});

const username = ref(props.username);
const branch_name = ref(props.branch_name);
const router = useRouter();
const route = useRoute();

const isLoginPage = ref<boolean>();

const requested = ref(props.requested);

onMounted(async () => {
	await router.isReady();
	if (requested.value) return;

	isLoginPage.value = route.path == '/admin';
	if (isLoginPage.value) {
		document.body.className = 'appadmin';
	} else {
		document.body.className = 'adminpanel';
	}

	if (!route.meta.admin) return;

	axios.get(apiURL + '/admin/me', {
		withCredentials: true,
	}
	).then((response) => {
		if (isLoginPage.value) {
			document.location.href = '/adminpanel';
			isLoginPage.value = true;
		} else {
			username.value = response.data.username;
			branch_name.value = response.data.branch_name;
			requested.value = true;
		}
		
	}).catch((error) => {
		if (!isLoginPage.value) {
			console.error(error)
			document.location.href = '/admin';
			isLoginPage.value = false;
			requested.value = true;
		}
		
	})
})

function logout() {
	axios.post(apiURL + '/logout', {}, {
		withCredentials: true
	}).then((response) => {
		let returnCode : string = response.data.return
		if (returnCode == "ERROR") {
			console.error("Error logging out bro")
			return
		}
		document.location.href="/admin";
	})
}


</script>

<template>
	<div class="admin-center" v-if="!isLoginPage">
		<div class="admin-top">
			<span>สวัสดี {{ username }}</span>
			<span style="margin-left: auto; margin-right: auto;">{{ branch_name }}</span>
			<button @click="logout">ออกจากระบบ</button>
		</div>
		<div class="admin-body">
			<slot></slot>
		</div>
	</div>
	<slot v-else></slot>
</template>