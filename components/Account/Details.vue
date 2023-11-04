<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid';
import dayjs from 'dayjs';
import { IconClockEdit, IconLock, IconAt } from '@tabler/icons-vue';

const props = withDefaults(
  defineProps<{
    status: 'loading' | 'error' | 'loaded';
    account: Account;
  }>(),
  {
    status: 'loading',
  }
);
</script>

<template>
  <div class="account-details">
    <Transition name="fade" mode="out-in">
      <div v-if="props.status === 'loading'" class="account-details__loader">
        <div class="loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="note">Ładowanie informacji</div>
      </div>
      <div v-else-if="props.status === 'loaded'" class="account-details__container">
        <h5 class="account-details__title">Informacje o koncie</h5>
        <div class="single-info">
          <div class="label">
            <IconAt class="icon" />
            <span>Adres e-mail</span>
          </div>
          <div class="value">
            {{ props.account.email }}
          </div>
        </div>
        <div class="single-info">
          <div class="label">
            <IconClockEdit class="icon" />
            <span>Data rejestracji</span>
          </div>
          <div class="value">
            {{ dayjs(props.account.date_created).format('DD.MM.YYYY') }}
          </div>
        </div>
        <div class="single-info">
          <div class="label">
            <IconLock class="icon" />
            <span>Ostatnia zmiana hasła</span>
          </div>
          <div class="value">
            {{ props.account.last_password_change ? dayjs(props.account.last_password_change).format('DD.MM.YYYY HH:mm') : 'Brak informacji' }}
          </div>
        </div>
      </div>
      <div v-else class="account-details__error">
        <ExclamationTriangleIcon class="icon" />
        <div class="title">Brak informacji</div>
        <p class="description">Nie udało się załadować informacji o koncie.</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.account-details {
  @apply w-full h-full flex flex-col justify-between relative;

  &__loader {
    @apply w-full h-full flex flex-col items-center justify-center space-y-2;

    .note {
      @apply text-xs text-zinc-300 font-extralight;
    }
  }

  &__error {
    @apply w-full h-full flex flex-col items-center justify-center;

    .icon {
      @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/3 w-24 h-24 text-white opacity-10;
    }

    .title {
      @apply text-lg text-zinc-300 font-semibold mb-2;
    }

    .description {
      @apply w-1/2 text-center text-sm text-zinc-300 font-extralight mb-4;
    }
  }

  &__container {
    @apply flex-grow w-full h-auto p-4 overflow-auto;
    @apply lg:p-6;
  }

  &__title {
    @apply mb-4;
  }
  
  .single-info {
    @apply w-full h-auto rounded-lg border border-zinc-600 p-3 mb-3;

    .label {
      @apply w-full h-auto flex items-center space-x-2 text-neutral-400 mb-2;

      .icon {
        @apply w-4 h-4;
      }

      span {
        @apply text-sm font-extralight;
        @apply md:text-xs;
      }
    }

    .value {
      @apply text-lg font-light;
      @apply md:text-sm;
    }

    .value-disabled {
      @apply text-neutral-400;
    }
  }
}
</style>