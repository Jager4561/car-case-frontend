<script setup lang="ts">
  import { TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline';

  const notifications = ref<Notification[]>([]);

  const props = defineProps<{
    modelValue: boolean;
  }>();
  const emit = defineEmits(['update:modelValue']);

  const closeNotifications = () => {
    emit('update:modelValue', false);
  }
</script>

<template>
  <Transition name="slide-right">
    <div v-if="props.modelValue" class="notifications-list">
      <div class="notifications-list__window-title">
        <div class="title">Powiadomienia</div>
        <div class="actions">
          <button aria-label="Usuń wszystkie powiadomienia" class="icon_button">
            <TrashIcon class="icon" />
          </button>
          <button aria-label="Zamknij powiadomienia" class="icon_button" @click="closeNotifications()">
            <XMarkIcon class="icon" />
          </button>
        </div>
      </div>
      <div class="notifications-list__list">
        <div v-if="notifications.length == 0" class="list-empty">
          Brak powiadomień
        </div>
        <div v-for="notification in notifications" class="notification">
          <div class="notification__header">
            <span class="name">Nowy komentarz</span>&nbsp;&nbsp;•&nbsp;&nbsp;<span class="date">10.07.2023 11:45</span>
          </div>
          <div class="notification__body">
            <NuxtImg class="image" src="revenant.png"></NuxtImg>
            <div class="content">
              Użytkonik Jan Kowalski zamieścił komentarz pod Twoim postem: <span class="post">Instrukcja wymiany wysprzęglika</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.notifications-list {
  height: calc(100vh - theme('spacing.20'));
  @apply fixed bottom-0 right-0 w-full flex flex-col bg-zinc-900;
  @apply sm:max-w-xs;

  &__window-title {
    @apply flex-shrink-0 w-full h-auto flex items-center justify-between space-x-4 border-b border-t border-zinc-700 px-6 py-3;
    @apply lg:p-2 lg:px-3 lg:border-t-0;

    .title {
      @apply text-xl text-white font-semibold;
      @apply lg:text-base;
    }

    .actions {
      @apply w-auto h-auto flex items-center space-x-1;

      .icon_button {
          @apply w-8 h-8 flex-shrink-0 rounded-md flex items-center justify-center text-gray-400 duration-150;
          @apply hover:bg-zinc-700 hover:text-white;
          @apply md:w-6 md:h-6;

          .icon {
            @apply w-6 h-6;
            @apply md:w-4 md:h-4;
          }
      }
    }
  }

  &__list {
    @apply flex-grow w-full h-auto overflow-y-auto;

    .list-empty {
      @apply w-full h-auto flex items-center justify-center text-zinc-300 text-base px-2 py-6;
      @apply md:text-sm;
    }

    .notification {
      @apply w-full h-auto p-3 duration-300 hover:bg-zinc-800 cursor-pointer;
  
      &__header {
        @apply w-full text-xs text-zinc-400 mb-2;
      }

      &__body {
        @apply w-full h-auto flex items-start space-x-2;

        .image {
          @apply flex-shrink-0 w-10 h-10 rounded-full object-center object-cover;
        }

        .content {
          @apply text-white text-sm font-extralight;
        }
      }
    }
  }

}
</style>