<script setup lang="ts">
import axios from 'axios';
import LoginPanel from './LoginPanel.vue';
import { apiURL } from '../envvars';
import { onMounted } from 'vue';
import { ref } from 'vue';

const props = defineProps({
	requested: Boolean,

	type: String,
	name: String,
	pfp_url: String,
})

const type = ref(props.type);
const name = ref(props.name);
const pfp_url = ref(props.pfp_url);
const requested = ref(props.requested);

onMounted(() => {
	axios.get(apiURL + '/profile/button', {
		withCredentials: true,
	}).then((response) => {
		type.value = 'user';
		name.value = response.data.displayname;
		pfp_url.value = response.data.picture;

		requested.value = true;
	}).catch((error) => {
		if (error.response.status == 401) {
			type.value = 'anonymous';
			requested.value = true;
		}
	})
})

</script>

<template>
	<div id="profile-button">
		<VDropdown v-if="requested">
			<a v-if="type != 'anonymous' && pfp_url" href="javascript:void(0);">
				<img class="pfp" :src=pfp_url :alt=name>
			</a>
			<a v-else href="javascript:void(0);">เข้าสู่ระบบ</a>

			<template #popper>
				<LoginPanel v-if="type != 'anonymous'" :url=pfp_url :displayname=name />
				<LoginPanel v-else />
			</template>
		</VDropdown>
	</div>
</template>