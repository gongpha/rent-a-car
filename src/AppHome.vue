<script setup lang="ts">
import './assets/main.css'
import './assets/admin.css'

import { onBeforeMount } from 'vue';
import WebHeader from './components/WebHeader.vue'
import WebBody from './components/WebBody.vue'
import WebFooter from './components/WebFooter.vue'

onBeforeMount(() => {
	document.body.className = 'apphome';
});

</script>

<template>
	<div>
		<WebHeader/>
		<WebBody>
			<!--
			<router-view v-slot="{ Component }">
				<transition name="fade" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>-->
			<router-view></router-view>
		</WebBody>
		<WebFooter/>
	</div>
</template>

<style scoped>

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}


</style>