<script lang="ts">
import { defineComponent } from 'vue'

import AppHome from './AppHome.vue';
import AppAdmin from './AppAdmin.vue';

export default defineComponent({
	components: { AppHome, AppAdmin },
	computed: {
		admin() {
			return this.$route.meta.admin
		}
	},
});

</script>

<template>
	<main v-if="admin">
		<AppAdmin/>
	</main>
	<main v-else>
		<AppHome/>
	</main>
</template>