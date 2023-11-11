<script setup lang="ts">
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  options: {
    to: string
  };
}>();

const { hidePopup } = usePopups();

const close = () => {
  hidePopup();
};

const confirmExit = async () => {
  hidePopup();
  navigateTo(props.options.to);
};
</script>

<template>
  <div class="comment-login-popup">
    <div class="header">
      <div class="title">
        <ExclamationTriangleIcon class="icon" />
        <span> Niezapisane zmiany </span>
      </div>
      <div class="header-actions">
        <button class="icon-button icon-button__medium icon-button__secondary" @click="close()">
          <XMarkIcon class="button-icon"></XMarkIcon>
        </button>
      </div>
    </div>
    <div class="content">
      <p>
        Czy na pewno chcesz opuścić stronę? Wprowadzone zmiany zostaną utracone.
      </p>
    </div>
    <div class="actions">
      <button @click="close()" class="text-button text-button__secondary text-button__medium">Anuluj</button>
      <button @click="confirmExit()" class="text-button text-button__danger text-button__medium">
        Wyjdź
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment-login-popup {
  @apply w-full max-w-lg h-auto bg-zinc-900 rounded-lg border border-zinc-600;

  .header {
    @apply w-full h-auto flex items-center justify-between p-4 border-b border-zinc-600;

    .title {
      @apply w-auto flex-shrink-0 flex items-center justify-start space-x-2 text-red-600 font-semibold;

      .icon {
        @apply w-10 h-10;
      }
    }
  }

  .content {
    @apply w-full h-auto p-4 text-sm;
  }

  .actions {
    @apply w-full h-auto flex items-center justify-end space-x-2 p-4;

    .text-button {
      @apply min-w-[5rem];
    }

    .loader {
      @apply space-x-1;

      .dot {
        @apply w-2 h-2;
      }
    }
  }
}
</style>
