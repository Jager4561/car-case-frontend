<script setup lang="ts">
  import { XMarkIcon } from '@heroicons/vue/24/solid';

  const { hidePopup } = usePopups();

  const close = () => {
    hidePopup();
  }
</script>

<template>
  <div class="comment-login-popup">
    <div class="header">
      <div class="title">
        Konto wymagane
      </div>
      <div class="header-actions">
        <button class="icon-button icon-button__medium icon-button__secondary" @click="close()">
          <XMarkIcon class="button-icon"></XMarkIcon>
        </button>
      </div>
    </div>
    <div class="content">
      <p>W celu dodania komentarza musisz posiadać konto w serwisie i  być zalogowany. Jeżeli nie posiadasz konta, możesz je założyć.</p>
    </div>
    <div class="actions">
      <NuxtLink to="/zaloguj" class="text-button text-button__primary text-button__medium">Zaloguj się</NuxtLink>
      <NuxtLink to="/zarejestruj" class="text-button text-button__secondary text-button__medium">Zarejestruj się</NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment-login-popup {
    @apply w-full max-w-lg h-auto bg-zinc-900 rounded-lg border border-zinc-600;

    .header {
      @apply w-full h-auto flex items-center justify-between p-4 border-b border-zinc-600;

      .title {
        @apply w-auto flex-shrink-0;
      }
    }

    .content {
      @apply w-full h-auto p-4 text-sm;
    }
    
    .actions {
      @apply w-full h-auto flex items-center justify-end space-x-2 p-4;
    }
  }
</style>