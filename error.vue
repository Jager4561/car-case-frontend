<script setup lang="ts">
  const error = useError();
  onBeforeMount(() => {
    if(error.value === null) {
      console.error(error.value);
      return;
    }
    if(error.value instanceof Error) {
      console.error(error.value);
      return;
    }
    if(error.value?.statusCode === 404) {
      navigateTo('/');
      return;
    }
  });
</script>

<template>
</template>

<style scoped lang="scss"></style>