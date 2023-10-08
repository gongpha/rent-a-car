<script setup lang="ts">
</script>

<template>
	<nav class="admin-nav">
		<ul>
			<router-link class="admin-nav-a" to="/adminpanel"><li>แผงควบคุม</li></router-link>
			<router-link class="admin-nav-a" to="/adminpanel/reservations"><li>การจอง</li></router-link>
			<router-link class="admin-nav-a" to="/adminpanel/cars"><li>รถยนต์</li></router-link>
			<router-link class="admin-nav-a" to="/adminpanel/models"><li>รุ่นรถยนต์</li></router-link>
		</ul>
	</nav>
</template>