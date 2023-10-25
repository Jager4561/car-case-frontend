<script setup lang="ts">
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid';
</script>

<template>
  <div class="write-comment">
    <div class="write-comment__avatar">
      <NuxtImg class="avatar" src="img/revenant.png"></NuxtImg>
    </div>
    <div class="write-comment__content">
      <textarea></textarea>
      <div class="options">
        <div class="limit alert">
          <span>501/500</span>
        </div>
        <button class="icon-button icon-button__primary icon-button__small">
          <PaperAirplaneIcon class="button-icon"></PaperAirplaneIcon>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .write-comment {
    @apply w-full h-auto flex items-start space-x-2;

    &__avatar {
      @apply w-auto h-auto flex-shrink-0 flex flex-col items-center space-y-2;

      .avatar {
        @apply w-10 h-10 object-center object-cover rounded-full;
      }
    }

    &__content {
      @apply w-full h-auto relative;

      textarea {
        @apply w-full h-20 bg-zinc-700 rounded-md text-sm font-semibold resize-none border border-zinc-500 p-2 pr-12 pb-10;
      }

      .options {
        @apply absolute bottom-4 right-2 w-auto h-auto flex items-end space-x-2;

        .limit {
          @apply text-xs font-light text-zinc-400;

          &.alert {
            @apply text-red-500;
          }
        }
      }
    }
  }
</style>