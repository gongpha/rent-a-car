<script setup lang="ts">

import ProfileButton from './ProfileButton.vue';

</script>

<template>
	<header id="web-header">
		<router-link to="/" class="header-logo">
			<img src="/logo.svg" width="32"/>
			<span class="header-logo-text">RentACar</span>
		</router-link>

		<div class="header-right">
			<ProfileButton/>
		</div>
	</header>
</template>