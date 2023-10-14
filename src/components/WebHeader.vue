<script setup lang="ts">

import ProfileButton from './ProfileButton.vue';

</script>

<template>
	<header id="web-header">
		<router-link to="/" class="header-logo">
			<img src="/logo_white.svg" width="32" style="filter: invert(100%);"/>
			<span class="header-logo-text">RentACar</span>
		</router-link>

		<div class="header-right">
			<ProfileButton/>
		</div>
	</header>
</template>