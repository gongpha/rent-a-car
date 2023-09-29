<script setup lang="ts">
import WebHeader from './components/WebHeader.vue'
import WebBody from './components/WebBody.vue'

</script>

<template>
	<main>
		<WebHeader/>
		<WebBody>
			<router-view v-slot="{ Component }">
				<transition name="fade" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</WebBody>
	</main>
</template>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
</style>