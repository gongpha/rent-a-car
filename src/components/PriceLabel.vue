<script setup lang="ts">

const props = defineProps({
  suffix: {
	type: String,
	default: '',
  },
});

</script>

<template>
	<span class="price-prefix">
		<span class="price-text">฿<span class="price-number"><slot></slot></span></span>{{ suffix }}
	</span>
</template>