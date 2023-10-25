<script setup lang="ts">
  
</script>

<template>
  <div class="loader-container">
    <div v-for="index in [0, 1, 2, 3, 4]" class="box">
      <div class="content add-shadow"></div>
      <div class="bottom">
        <div class="start">
          <div class="model add-shadow"></div>
          <div class="author add-shadow"></div>
        </div>
        <div class="end">
          <div class="author add-shadow"></div>
          <div class="buttons">
            <div class="button add-shadow"></div>
            <div class="button add-shadow"></div>
            <div class="button add-shadow"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loader-container {
  @apply w-full h-auto;

  .box {
    @apply w-full h-auto bg-zinc-900 rounded-lg overflow-hidden p-3 mb-3;

    .content {
      @apply w-full h-28 bg-zinc-800 rounded-lg mb-3 relative overflow-hidden;
    }

    .bottom {
      @apply w-full flex flex-col items-center justify-between space-y-3;
      @apply sm:flex-row sm:space-x-3 sm:space-y-0;

      .start {
        @apply w-full h-auto flex items-center space-x-3;
        .model {
          @apply w-56 h-8 bg-zinc-800 rounded-lg;
        }

        .author {
          @apply hidden;
          @apply sm:block;
        }
      }

      .end {
        @apply w-full flex items-center justify-between space-x-3;
        @apply sm:w-auto;

        .buttons {
          @apply w-auto h-auto flex items-center space-x-2;
        }
        .button {
          @apply w-12 h-8 bg-zinc-800 rounded-lg;
        }
      }

      .author {
          @apply w-36 h-8 bg-zinc-800 rounded-lg;
          @apply sm:hidden;
        }
    }
  }
}
</style>
