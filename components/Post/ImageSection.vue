<script setup lang="ts">
const props = defineProps<{
  data: string;
}>();
</script>

<template>
  <div class="image-section">
    <Image :src="props.data" altClass="w-16 h-16 text-zinc-500" mode="contain"></Image>
  </div>
</template>

<style scoped lang="scss">
.image-section {
  @apply w-full h-auto aspect-video rounded-lg overflow-hidden bg-zinc-900 mb-6;
}
</style>
