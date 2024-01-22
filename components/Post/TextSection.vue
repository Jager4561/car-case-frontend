<script setup lang="ts">
  const props = defineProps<{
    data: {
      type: string;
      size: number;
      content: string;
    };
  }>();
  const availableSizes = ref([12, 16, 20, 24, 28, 32, 36, 40]);
</script>

<template>
  <div class="text-section" :style="{fontSize: availableSizes[props.data.size] + 'px'}">
    {{ props.data.content }}
  </div>
</template>

<style scoped lang="scss">
  .text-section {
    @apply w-full h-auto mb-6;
    white-space: pre-wrap;
  }
</style>