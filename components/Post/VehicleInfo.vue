<script setup lang="ts">
  
</script>

<template>
  <div class="vehicle-info">
    <Transition name="fade" mode="out-in">
      <div class="vehicle-info__container">
        <h5 class="filters__title">Informacje o pojeździe</h5>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
  .vehicle-info {
    @apply w-full h-full flex flex-col justify-between relative;

    &__container {
      @apply flex-grow w-full h-auto p-4 overflow-auto;
      @apply lg:p-6;
    }
  }
</style>