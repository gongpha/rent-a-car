<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      หนีไปไหนไม่ได้หรอก ฉันจะตามเธอไปทุกที่ 💀💀💀
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  font-family: 'Prompt', sans-serif;
  font-weight: 700;
  position: relative;
  top: -10px;
}

h3 {
  font-family: 'Prompt', sans-serif;
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
