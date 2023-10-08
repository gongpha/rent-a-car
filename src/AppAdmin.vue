<script setup lang="ts">

import AdminPage from './components/AdminPage.vue'

// sppedrun design

</script>

<template>
	<AdminPage>
		<router-view v-slot="{ Component }">
			<component :is="Component" />
		</router-view>
	</AdminPage>
</template>