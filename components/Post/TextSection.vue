<script setup lang="ts">
const props = defineProps<{
  data: string;
}>();
</script>

<template>
  <div class="text-section">
    {{ props.data }}
  </div>
</template>

<style scoped lang="scss">
.text-section {
  @apply w-full h-auto mb-6;
}
</style>
