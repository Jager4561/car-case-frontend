<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid';

const { toasts, removeToast, startDisapearCounter, stopDisapearCounter } = useToasts();
</script>

<template>
  <Teleport to="body">
    <div class="toasts">
      <TransitionGroup name="toasts">
        <div
          v-for="toast in toasts"
          :key="toast.index"
          class="toast"
          :class="'toast__' + toast.type"
          :style="{ zIndex: 1000 + toast.index }"
          @mouseover="stopDisapearCounter(toast.index)"
          @mouseout="startDisapearCounter(toast.index)"
        >
          <div class="toast__communicate">
            <p class="title">{{ toast.title }}</p>
            <p class="text">{{ toast.message }}</p>
          </div>
          <button class="icon-button icon-button__medium icon-button__thertiary close-button" title="Zamknij" @click="removeToast(toast.index)">
            <XMarkIcon class="icon-button__icon" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.toasts {
  @apply w-full max-w-xl h-auto fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[1000];

  .toast {
    width: calc(100% - theme('spacing.4') * 2);
    @apply absolute bottom-0 left-4 h-auto flex items-center justify-between p-3 rounded-lg bg-red-600 text-white shadow-lg;
    @apply sm:left-0;

    @screen sm {
      width: calc(100% - theme('spacing.6') * 2);
    }

    &__communicate {
      .title {
        @apply font-medium text-xs uppercase;
      }

      .text {
        @apply text-sm font-light;
      }
    }

    .close-button {
      @apply text-white;
    }

    &__success {
      @apply bg-green-600 text-white;

      .close-button {
        @apply text-white;
      }
    }

    &__error {
      @apply bg-red-600 text-white;

      .close-button {
        @apply text-white;
      }
    }

    &__warning {
      @apply bg-yellow-600 text-white;

      .close-button {
        @apply text-white;
      }
    }

    &__info {
      @apply bg-zinc-900 text-white;

      .close-button {
        @apply text-white;
      }
    }
  }
}

.toasts-enter-active,
.toasts-leave-active {
  transition: all 0.3s cubic-bezier(0,1,.5,1.01);
}
.toasts-enter-from,
.toasts-leave-to {
  transform: translateY(calc(100% + theme('spacing.4')));
}
</style>
