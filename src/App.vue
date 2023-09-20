<script setup lang="ts">
import WebHeader from './components/WebHeader.vue'
import WebBody from './components/WebBody.vue'
import ContentCenter from './components/ContentCenter.vue'

import SearchCar from './components/SearchCar.vue'
</script>

<template>
	<main>
		<WebHeader/>
		<WebBody>
			<img src="src/assets/home_cover.jpg" alt="Nissan" class="header-img"/>
			<div class="searchcar-float">
				<ContentCenter>
					<h1 class="header-center">ไปเช่ารถ เพื่อออกเดินทางไกล</h1>
					<h2 class="header-center">เดินทางไกล ?</h2>
					<SearchCar/>
				</ContentCenter>
			</div>
		</WebBody>
	</main>
</template>